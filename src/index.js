//Prueba 2 

import { create } from "venom-bot";
import express, { response } from "express";
import { graphqlHTTP } from "express-graphql";
import { connect } from "./database.js";
import { Campaigns } from "./bot/config.js";
import {
  fetchClients,
  updateClient,
} from "./graphql/clients/query.js";
import { fetchPhones, checkInDB } from "./graphql/phones/query.js";
import { fetchCampaign } from "./graphql/campaigns_info/query.js";
import { LineStatus } from "./graphql/phones/models/Phone.js";
import phoneSchema from "./graphql/phones/schema.js";
import { serverSchema } from "./graphql/clients/schema.js";
import campaignSchema from "./graphql/campaigns_info/schema.js";
import {
  generar_pdf,
  saludo,
  mensaje,
  getRandomInt,
  setArtInfo,
  mensaje_random
} from "./components/content.js";
import dontenv from 'dotenv';
import { sendToDialogFlow } from "./bot/dialogflow.js";
import { v4 } from "uuid";

dontenv.config();

//Inicializar variables del Bot
const campaign = Campaigns.BGR;
const product = campaign.products.Mascotas;
const activePhones = [];
let startIndex = 0;
let numEnvios = 350;
let envio = true;
let heatingLines = true;
let firstMessage = false;

//Inicializar Express
const app = express();
connect();
//Uso de GraphQL
app.use("/api/phones", graphqlHTTP({ graphiql: true, schema: phoneSchema }));
app.use("/api/campaigns", graphqlHTTP({ graphiql: true, schema: campaignSchema }));
app.use("/api/clients", graphqlHTTP({ graphiql: true, schema: serverSchema(campaign.collection + 'Clients') }));
app.listen(3000, () => console.log("Server on port 3000"));

const campaign_info = await fetchCampaign(campaign.collection);
const product_info = campaign_info["searchCampaign"].products[product];
const sessionIds = new Map();

async function botInit() {
  setArtInfo(product_info);
  let skip = startIndex + (numEnvios * activePhones.length);
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

async function lineHeating(client, idLine) {
  let lines = await fetchPhones();
  let obj = lines["searchPhones"];
  let lengthLines = Math.trunc(obj.length / 3);
  console.log("Calentando Línea");
  for (let index = 1; index <= lengthLines; index++) {
    let start_t = new Date();
    let randomLines = randomProperty(obj);
    if (idLine !== randomLines._id) {
      let name = randomLines.name;
      let line = getActiveLine(randomLines.lines);
      let number = line.number;

      let to_message = "";
      // Retrieve all groups
      const groups = await client.getAllChatsGroups();
      if (Math.random() > 0.5 && groups.length > 0) {
        let group = randomProperty(groups);
        to_message = group.id.user + "@g.us";
      } else {
        to_message = "593" + number + "@c.us";
      }

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

      let end_t = new Date();
      let timestamp = end_t - start_t;
      console.log("Timestamp: " + timestamp / 60000);
    }
  }
}

async function firstChat(client, phoneName) {
  let start_t = new Date();
  let contact = "593" + "980535586" + "@c.us"; //980535586 andres  992900544 juan    987592024 Patricia     contact
  let name = "ANDRES";
  let contact_status = await client.checkNumberStatus(contact);
  if (contact_status.numberExists) {
    let time_delay = getRandomInt(10000, 15000);
    let time_file = time_delay / getRandomInt(3, 6);
    let time_message = time_delay / getRandomInt(2, 4);
    let time_end = getRandomInt(20000, 25000);
    if (envio == true) {
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
      await delay(time_message);
      await client.sendText(contact, `${saludo(start_t)} ${name}` + '. ' + mensaje()); //name
      //Mensaje Completo
      //await client.sendText(contact, mensaje());
      console.log("Primer envio terminado");
      await delay(time_end);
    } else {
      await delay(10000);
    }
  } else {
    console.log("Error en primer envio");
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
    if (cont >= numEnvios) {
      break;
    }
    if (cont % 10 === 0 && cont !== 0) {
      await lineHeating(client, idActiveLine);
      console.log(`Telefono ${phoneName} Iniciando Ronda de Calentamineto`);
    }
    let start_t = new Date();
    let identificacion = obj[index].identification;
    let name = getName(obj[index].name);
    let contact = obj[index].phone;
    /*if (obj[index].IGS_status) {
      let times_reached = obj[index].IGS_status.wp_status[1].times_reached;
      console.log(times_reached);*/
    if (contact != null /*&& times_reached != 1*/) {
      contact = "593" + contact + "@c.us";
      //let contact = "593" + 995109767 + "@c.us";
      let contact_status = await client.checkNumberStatus(contact);
      if (contact_status.numberExists) {
        num_existe++;
        console.log(
          `[${startIndex + index}] [${phoneName}] ${obj[index].name} tef:${contact} id:${identificacion} (Total si existen: ${num_existe})`
        );
        let time_delay = getRandomInt(27000, 35000);
        let time_file = time_delay / getRandomInt(4, 10);
        let time_message = time_delay / getRandomInt(3, 8);
        let time_end = getRandomInt(40000, 50000);
        if (envio == true) {
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
          await delay(time_message);
          await client.sendText(contact, `${saludo(start_t)} ${name}.` + mensaje());
          //Mensaje Completo
          //await client.sendText(contact, mensaje(campaign_info.name + '-' + campaign_info.pdf_name));
          updateClient(
            obj[index]._id,
            product_info.product_name,
            new Date(),
            phoneName,
            product
          );
          cont++;
          console.log(
            `Envío (${cont}) de ${phoneName} Terminado, esperando ${time_end / 1000
            }s para el próximo envío`
          );
          await delay(time_end);
        } else {
          await delay(7000);
        }
      } else {
        num_noexiste++;
        console.log(
          `NO Index[${index}] ${obj[index].name} tef:${contact} (Total no existen: ${num_noexiste})`
        );
      }
    }
  }
  console.log(
    `[${phoneName}] Tiempo de Ejecución: ${(new Date() - startdate) / 60000
    } minutos`
  );
  await delay(getRandomInt(600000, 900000));
}

async function startLinesHeating(client, idActiveLine) {
  let start_t = new Date();
  let end_hour = getRandomInt(22, 23);
  while (start_t.getHours() < end_hour) {
    await lineHeating(client, idActiveLine);
    await delay(getRandomInt(300000, 1200000));
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
  console.log(`${day}-${month}-${year}, ${hour}h`);
  client.onMessage(async (message) => {
    let name = message.sender.name;
    let searchInDB = await checkInDB(name);
    let phoneInDB = searchInDB["searchDB"];
    if (!phoneInDB && message.type == "chat" && message.length < 255) {
      setSessionAndUser(message.from);
      let session = sessionIds.get(message.from);
      let payload = await sendToDialogFlow(message.body, session);
      let response = payload.fulfillmentMessages[0].text.text[0];
      switch (response) {
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
        default:
          break;
      }
    }
  });
  if (firstMessage) {
    await firstChat(client, phoneName);
    firstMessage = false;
  }
  if (!heatingLines) {
    await production(client, idActiveLine, phoneName, obj);
  }
  await startLinesHeating(client, idActiveLine);
}

async function setSessionAndUser(senderId) {
  try {
    if (!sessionIds.has(senderId)) {
      sessionIds.set(senderId, v4());
    }
  } catch (error) {
    throw error;
  }
}