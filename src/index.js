import { create } from "venom-bot";
import express, { response } from "express";
import { graphqlHTTP } from "express-graphql";
import { connect } from "./database.js";
import { Campaigns } from "./bot/config.js";
import {
  fetchClients,
  fetchClientByPhone,
  updateClient,
  updateCampaignStatus,
  checkCampaignStatus,
  updateContactStatus,
  checkContactStatus
} from "./graphql/clients/query.js";
import { fetchPhones, checkInDB } from "./graphql/phones/query.js";
import { fetchCampaign } from "./graphql/campaigns_info/query.js";
import { LineStatus } from "./graphql/phones/models/Phone.js";
import { WP_status } from "./graphql/clients/models/Clients.js";
import phoneSchema from "./graphql/phones/schema.js";
import { serverSchema } from "./graphql/clients/schema.js";
import campaignSchema from "./graphql/campaigns_info/schema.js";
import {
  generar_pdf,
  saludo,
  mensaje,
  getRandomInt,
  setArtInfo,
  mensaje_random,
  Responses
} from "./components/content.js";
import dontenv from 'dotenv';
import { sendToDialogFlow } from "./bot/dialogflow.js";
import { v4 } from "uuid";
import { appendFile } from "fs";
 
dontenv.config();

//Inicializar variables del Bot
const campaign = Campaigns.BGR;
const product = campaign.products.CelularProtegido;
const activePhones = ["13-S"];
const startIndex = 0;
const numEnvios = 350;
const envio = true;
const heatingLines = false;
let firstMessage = false;
let pdfOnly = true;
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

//Inicializar Express
const app = express();
connect();

//Uso de GraphQL
app.use("/api/phones", graphqlHTTP({ graphiql: true, schema: phoneSchema }));
app.use("/api/campaigns", graphqlHTTP({ graphiql: true, schema: campaignSchema }));
app.use("/api/clients", graphqlHTTP({ graphiql: true, schema: serverSchema(campaign.collection + 'Clients') }));
app.listen(3000, () => console.log("Server on port 3000"));

const log_date = new Date().toISOString().replace(/T.+/, '');
if (envio) {
  appendFile(`src/log_files/${log_date}.log`, `${new Date()}\n`,(err) => {
    if (err) throw err;
    console.log('Log file created');
  });
}
const campaign_info = await fetchCampaign(campaign.collection);
const product_info = campaign_info["searchCampaign"].products[product];
const sessionIds = new Map();

async function botInit() {
  setArtInfo(product_info);
  let skip = startIndex + (numEnvios * activePhones.length) + 500;
  let users = await fetchClients(campaign.current_db, startIndex, skip);
  let usersObj = users["searchClients"];
  let phones = await fetchPhones();
  for (const phone of phones.searchPhones) {
    if (activePhones.includes(phone.name)) {
      let phoneName = phone.name;
      let phoneLines = phone.lines;
      let idActiveLine = "";
      if (phoneLines.length > 0) {
        idActiveLine = phone._id;
      }
      await delay(10000);
      create(
        phoneName,
        undefined,
        (statusSession, session) => {
          console.log("Status Session: ", statusSession);
          //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
          //Create session wss return "serverClose" case server for close
          console.log("Session name: ", session);
        },
        undefined
      )
        .then((client) => {
          start(client, idActiveLine, phoneName, usersObj);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
}

botInit();

async function delay(ms) {
  try {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, ms);
    });
  } catch (error) {
    console.log(error);
  }
}

function randomProperty(obj) {
  let keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
}

function getName(fullname) {
  if (fullname.split(/[\s,-]+/).length > 2) return fullname.split(/[\s,-]+/)[2];
  return fullname.split(/[\s,-]+/)[0];
}

function getActiveLine(lines) {
  for (const line of lines) {
    if (line.status === LineStatus.ACTIVE) {
      return line;
    }
  }
}

async function lineHeating(client, idLine, lineName) {
  console.log(`Telefono ${lineName} Iniciando Ronda de Calentamineto`);
  let heatedLines = [];
  let lines = await fetchPhones();
  let obj = lines["searchPhones"];
  let lengthLines = 0;
  if (obj.length >= 8) {
    lengthLines = getRandomInt(5, 8);
  } else {
    lengthLines = Math.trunc(obj.length / 2);
  }
  for (let index = 0; index <= lengthLines; index++) {
    let randomLines = randomProperty(obj);
    if (idLine !== randomLines._id) {
      let name = randomLines.name;
      let line = getActiveLine(randomLines.lines);
      let number = line.number;

      let to_message = "";
      // Retrieve all groups
      /*const groups = await client.getAllChatsGroups();
      if (Math.random() > 0.5 && groups.length > 0) {
        let group = randomProperty(groups);
        heatedLines.push(group.name);
        to_message = group.id.user + "@g.us";
      } else {*/
      heatedLines.push(name);
      to_message = "593" + number + "@c.us";
      let contact_status = await client.checkNumberStatus(to_message);
      if (!contact_status.numberExists)
        continue;
      //}

      let time_delay = getRandomInt(10000, 15000);
      let time_message = time_delay / getRandomInt(3, 5);
      let time_end = getRandomInt(30000, 35000);

      await delay(time_message);
      await client.sendText(to_message, "Hi! " + name + ((Math.random() > 0.4) ? '' : ' 👋'));

      let numMessage = getRandomInt(1, 2);
      for (
        let messageRepetition = 1;
        messageRepetition <= numMessage;
        messageRepetition++
      ) {
        await delay(time_message);
        await client.sendText(to_message, mensaje_random());
      }

      await delay(time_end);
    }
  }
  console.log(`Telefono ${lineName} Completó Ronda de Calentamiento - Chats: ${heatedLines}`);
}

async function firstChat(client, phoneName) {
  let start_t = new Date();
  let contact = "593" + "980535586" + "@c.us"; //980535586 andres  992900544 juan
  let name = "ANDRES";
  let contact_status = await client.checkNumberStatus(contact);
  if (contact_status.numberExists) {
    let time_delay = getRandomInt(10000, 15000);
    let time_file = time_delay / getRandomInt(3, 6);
    let time_message = time_delay / getRandomInt(2, 4);
    let time_end = getRandomInt(20000, 25000);
    if (envio == true) {
      if(!pdfOnly){
        await delay(time_message);
        await client.sendText(contact, `${saludo(start_t)} ${name}` + '. ' + mensaje());
      }
      //Genera pdf
      await generar_pdf("0", phoneName, name);
      await delay(time_file);
      //Envía pdf
      await client
        .sendFile(
          contact,
          `src/components/pdf/${product_info.product_name}${phoneName}.pdf`,
          `${product_info.product_name}_${getRandomInt(1, 100)}.pdf`,
          "Abrir pdf"
        )
        .then((result) => {
          //console.log('Result: ', result); //return object success
        })
        .catch((error) => {
          //console.error('Error when sending: ', error); //return object error
        });
      //await delay(time_message);
      //await client.sendText(contact, `${saludo(start_t)} ${name}` + '. ' + mensaje());
      //Mensaje Completo
      //await client.sendText(contact, mensaje());
      console.log("Primer envío completado");
      await delay(time_end);
    } else {
      await delay(10000);
    }
  } else {
    console.log("Error en el primer envio");
  }
}

async function production(client, idActiveLine, phoneName, obj) {
  let lengthLines = obj.length;
  console.log("Nombre Telefono: ", phoneName);
  let num_existe = 0;
  let num_noexiste = 0;
  let indexPhone = activePhones.indexOf(phoneName);
  let cont = 0;
  let startdate = new Date();
  for (
    let index = indexPhone;
    index <= lengthLines - 1;
    index = index + activePhones.length
  ) {
    if (cont % 10 === 0 && cont !== 0) {
      await lineHeating(client, idActiveLine, phoneName);
    }
    let start_t = new Date();
    let identificacion = obj[index].identification;
    let name = getName(obj[index].name);
    let number = obj[index].phone;
    let campaign_status = null;
    let contact_st = null;
    if (obj[index].IGS_status != null) {
      if (obj[index].IGS_status.campaign_status[product] != undefined) {
        campaign_status = obj[index].IGS_status.campaign_status[product].assistance_status;
      }
      if (obj[index].IGS_status.contact_status != undefined) {
        contact_st = obj[index].IGS_status.contact_status;
      }
    }
    if (number != null) {
      let contact = "593" + number + "@c.us";
      let contact_exists = false;
      try{
        let contact_status = await client.checkNumberStatus(contact);
        contact_exists = contact_status.numberExists;
      } catch (error){
        console.error(error);
      }

      if (contact_exists) {
        num_existe++;
        cont++;
        console.log(
          `[${startIndex + index}] [${phoneName}] ${obj[index].name} telf:${contact} id:${identificacion} (Total si existen: ${num_existe})`
        );
        let time_delay = getRandomInt(27000, 35000);
        let time_file = time_delay / getRandomInt(4, 10);
        let time_message = time_delay / getRandomInt(3, 8);
        let time_end = getRandomInt(40000, 50000);
        if (envio == true && campaign_status != WP_status.UNSUBSCRIBED && campaign_status != WP_status.ACTIVE &&
          contact_st != WP_status.UNSUBSCRIBED) {
          if(!pdfOnly){
            await delay(time_message);
            await client.sendText(contact, `${saludo(start_t)} ${name}. ` + mensaje());
          }
          //Genera pdf
          await generar_pdf(identificacion, phoneName, name);
          await delay(time_file);
          //Envía pdf
          await client
            .sendFile(
              contact,
              `src/components/pdf/${product_info.product_name}${phoneName}.pdf`,
              `${product_info.product_name}_${getRandomInt(1, 100)}.pdf`,
              "Abrir pdf"
            )
            .then((result) => {
              //console.log('Result: ', result); //return object success
            })
            .catch((error) => {
              //console.error('Error when sending: ', error); //return object error
            });
          //await delay(time_message);
          //await client.sendText(contact, `${saludo(start_t)} ${name}. ` + mensaje());
          updateClient(
            obj[index]._id,
            product_info.product_name,
            start_t,
            phoneName,
            product
          );
          cont++;
          console.log(
            `Envío (${cont}) de ${phoneName} Terminado, esperando ${time_end / 1000}s para el próximo envío`
          );
          if (cont % 10 === 0 && cont !== 0) {
            appendFile(`src/log_files/${log_date}.log`, `[${phoneName}] ${cont} mensajes enviados\n`,(err) => {
              if (err) throw err;
            });
          }
          await delay(time_end);
        } else {
          await delay(7000);
        }
      } else {
        num_noexiste++;
        console.log(
          `NO Index [${index}] ${obj[index].name} telf:${contact} (Total no existen: ${num_noexiste})`
        );
        await updateContactStatus(number, WP_status.UNREACHABLE);
        delay(1000);
      }
    }
    if (cont >= numEnvios) {
      break;
    }
  }
  const totalTime = (new Date() - startdate) / 60000;
  console.log(
    `ENVIOS TERMINADOS >> [${phoneName}] Tiempo de Ejecución: ${totalTime} minutos (${cont} mensajes enviados)`
  );
  if (envio) {
    appendFile(`src/log_files/${log_date}.log`, `ENVIOS TERMINADOS >> [${phoneName}] Tiempo de Ejecución: 
    ${totalTime} minutos (${cont} mensajes enviados)\n`,(err) => {
      if (err) throw err;
    });
  }
  await delay(getRandomInt(600000, 900000));
}

async function startLinesHeating(client, idActiveLine, phoneName) {
  let start_t = new Date();
  let end_hour = getRandomInt(22, 23);
  let wait_time = 0;
  while (start_t.getHours() < end_hour) {
    await lineHeating(client, idActiveLine, phoneName);
    wait_time = getRandomInt(300000, 1200000);
    console.log(`Teléfono ${phoneName} esperando ${(wait_time / 1000) / 60} min para la próxima ronda de calentamiento`)
    await delay(wait_time);
    start_t = new Date();
  }
}

async function start(client, idActiveLine, phoneName, obj) {
  console.log("Starting");
  let startdate = new Date();
  let day = startdate.getDate();
  let month = startdate.getMonth();
  let year = startdate.getFullYear();
  let hour = startdate.getHours();
  const message_received = `MENSAJE RECIBIDO [${phoneName}] Opcion emparejada: `;
  console.log(`${day}-${month}-${year}, ${hour}h`);
  client.onMessage(async (message) => {
    let name = message.sender.name;
    let searchInDB = await checkInDB(name);
    let phoneInDB = searchInDB["searchDB"];
    if (!phoneInDB && message.type == "chat" && message.body.length < 255) {
      /*await setSessionAndUser(message.from);
      let session = sessionIds.get(message.from);
      let payload = await sendToDialogFlow(message.body, session, phoneName);
      let response = payload.fulfillmentMessages[0].text.text[0];*/
      let number = message.from.replace('593', '').replace('@c.us', '');
      let searchClient = await fetchClientByPhone(number);
      let user_info = searchClient['searchClientByPhone'];
      if (await setSessionAndUser(message.from)) {
        switch (message.body) {
          case '1':
            for (let reply_message of product_info.info_messages) {
              await delay(2000);
              client.sendText(message.from, reply_message);
            }
            console.log(message_received + message.body);
            break;
          case '2':
            await delay(2000);
            client.sendText(message.from, product_info.cost_message);
            console.log(message_received + message.body);
            break;
          case '3':
            await delay(2000);
            client.sendText(message.from, Responses.activate);
            console.log(message_received + message.body);
            break;
          case '4':
            await delay(2000);
            let temp = await checkCampaignStatus(number, product);
            let status = temp["searchCampaignStatus"];
            if (status != null) {
              if (status.assistance_status != WP_status.UNSUBSCRIBED) {
                await updateCampaignStatus(number, product_info.product_name, WP_status.UNSUBSCRIBED, product);
                client.sendText(message.from, Responses.unsubscribe_service);
              } else {
                client.sendText(message.from, Responses.unsubscribed_service);
              }
            } else {
              await updateCampaignStatus(number, product_info.product_name, WP_status.UNSUBSCRIBED, product);
              client.sendText(message.from, Responses.unsubscribe_service);
            }
            console.log(message_received + message.body);
            break;
          case '5':
            await delay(2000);
            let contact_temp = await checkContactStatus(number);
            let contact_status = contact_temp["searchContactStatus"];
            if (contact_status == WP_status.UNSUBSCRIBED) {
              client.sendText(message.from, Responses.unsubscribed_number);
            } else {
              await updateContactStatus(number, WP_status.UNSUBSCRIBED);
              client.sendText(message.from, Responses.unsubscribe_number);
            }
            console.log(message_received + message.body);
            break;
          case '6':
            await delay(2000);
            await updateCampaignStatus(number, product_info.product_name, WP_status.TO_CONTACT, product);
            client.sendText(message.from, Responses.contact);
            console.log(message_received + message.body);
            break;
          default:
            let payload = await sendToDialogFlow(message.body, sessionIds.get(message.from), phoneName);
            //let response = payload.fulfillmentMessages[0].text.text[0];
            sendMenu(false, user_info, client, message.from);
            console.log(message_received + "MENU");
            break;
        }
      } else {
        sendMenu(true, user_info, client, message.from);
        console.log(message_received + "FIRST_TIME_MENU");
      }
      /*switch (response) {
        case 'GET_INFO':
          for (let reply_message of product_info.info_messages) {
            await delay(getRandomInt(1000, 2000));
            client.sendText(message.from, reply_message);
          }
          break;
        case 'GET_COST_INFO':
          await delay(getRandomInt(1000, 2000));
          client.sendText(message.from, product_info.cost_message);
          break;
        case 'WRONG_NUMBER':
          
          break;
        default:
          break;
      }*/
    }
  });
  if (firstMessage) {
    await firstChat(client, phoneName);
    firstMessage = false;
  }
  if (!heatingLines) {
    await production(client, idActiveLine, phoneName, obj);
  }
  await startLinesHeating(client, idActiveLine, phoneName);
}

function sendMenu(firstTime, user, client, contact) {
  if (firstTime) {
    if (user != null && user.identification != undefined) {
      client.sendText(contact,
        Responses.welcome.replace('&A', product_info.assistance_name).replace('&C', campaign.name)
          .replace('&L', Responses.link + product_info.url_accept_assistance + user.identification + ' o') + Responses.menu);
    } else {
      client.sendText(contact,
        Responses.welcome.replace('&A', product_info.assistance_name).replace('&C', campaign.name).replace('&L', '') + Responses.menu);
    }
  } else {
    if (user != null && user.identification != undefined) {
      client.sendText(contact, Responses.choose_option + Responses.menu + '\nO ' 
      + Responses.link + product_info.url_accept_assistance + user.identification);
    } else {
      client.sendText(contact, Responses.choose_option + Responses.menu);
    }
  }
}

async function setSessionAndUser(senderId) {
  try {
    if (!sessionIds.has(senderId)) {
      sessionIds.set(senderId, v4());
      return false;
    }
  } catch (error) {
    throw error;
  }
  return true;
}