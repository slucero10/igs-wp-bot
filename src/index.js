import { create } from "venom-bot";
import randomWords from "random-words";
import express, { response } from "express";
import { graphqlHTTP } from "express-graphql";
import { connect } from "./database.js";
import {
  //fetchPhones,
  //fetchLines,
  fetchBGRClientsTC,
  createClient,
  updateClient,
} from "./graphql/query.js";
import { fetchPhones } from "./graphql/phones/query.js";
import { LineStatus } from "./graphql/phones/models/Phone.js";
import schema from "./graphql/phones/schema.js";
import { serverSchema } from "./graphql/campaigns/bgr/schema.js";
import {
  generar_pdf,
  saludo,
  mensaje,
  art_info,
  phoneNames,
  respuesta,
  getRandomInt,
} from "./components/content.js";

//(0) Andalucía
//(1) Multicoop - Multiayuda
//(2) Multicoop - Multisalud
//(3) Santa Rosa
//(4) BGR - Asistencia Celular Protegido
//(5) BGR - Asistencia Mascotas
//(6) FE - Medicity
//(7) FE - Farmacias Economicas
const campaign = 0
const campaign_info = art_info[campaign];
const activePhones = ["2-A"];
let startIndex = 0;
let numEnvios = 200;
let envio = true;
let heatingLines = false;
let firstMessage = false;

//Inicializar Express
const app = express();
connect();

//Uso de GraphQL
app.use("/api/phones", graphqlHTTP({ graphiql: true, schema: schema }));
app.use("/api/clients", graphqlHTTP({ graphiql: true, schema: serverSchema(campaign_info.name + 'Clients') }));
app.listen(3000, () => console.log("Server on port 3000"));

async function botInit() {
  //createClient('C');
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
          if (firstMessage) {
            firstChat(client, phoneName);
            firstMessage = false;
          }
          if (!heatingLines) {
            start(client, idActiveLine, phoneName);
          }
          else {
            startLinesHeating(client, idActiveLine);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
}

botInit();

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
      idActiveLine = lineById.searchLine._id;
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
      let name = randomLines._id;
      let line = randomProperty(randomLines.lines);
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

      let time_delay = getRandomInt(15000, 20000);
      let time_message = time_delay / getRandomInt(3, 5);
      let time_end = getRandomInt(30000, 35000);

      await delay(time_message);
      await client.sendText(to_message, "Hi! " + name);

      let numMessage = getRandomInt(1, 2);
      for (
        let messageRepetition = 1;
        messageRepetition <= numMessage;
        messageRepetition++
      ) {
        await delay(time_message);
        let randWords = randomWords({ min: 3, max: 10 });
        let randomString = randWords.join(' ');
        // Send basic text
        await client.sendText(to_message, randomString);
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
  let contact = "593" + 980535586 + "@c.us"; //980535586 andres  992900544 juan    987592024 Patricia     contact
  let name = "ANDRES";
  let contact_status = await client.checkNumberStatus(contact);
  if (contact_status.numberExists) {
    let time_delay = getRandomInt(10000, 15000);
    let time_file = time_delay / getRandomInt(3, 6);
    let time_message = time_delay / getRandomInt(2, 4);
    let time_end = getRandomInt(20000, 25000);
    if (envio == true) {
      //Genera pdf
      await generar_pdf("0", campaign_info, phoneName, name);
      await delay(time_file);
      //Envía pdf
      await client
        .sendFile(
          contact,
          `src/components/pdf/${campaign_info.name}${phoneName}.pdf`,
          `${campaign_info.pdf_name}${getRandomInt(1, 100)}.pdf`,
          "Abrir pdf"
        )
        .then((result) => {
          //console.log('Result: ', result); //return object success
        })
        .catch((error) => {
          //console.error('Error when sending: ', error); //return object error
        });
      await delay(time_message);
      await client.sendText(contact, `${saludo(start_t)} ${name}`); //name
      //Mensaje Completo
      await client.sendText(contact, mensaje(campaign_info.name + '-' + campaign_info.pdf_name));
      console.log("Primer envio terminado");
      await delay(time_end);
    } else {
      await delay(10000);
    }
  } else {
    console.log("Primer envio no existe");
  }
}

async function production(client, idActiveLine, phoneName) {
  let colec = "C"; //TC: Coleccion 1, C: Coleccion 2.
  let users = await fetchBGRClientsTC(colec);
  let obj = users["searchClients" + colec]; 
  let lengthLines = obj.length; 
  console.log("Nombre Telefono: ", phoneName);
  let num_existe = 0;
  let num_noexiste = 0;
  //let startIndex = 1085;
  let indexPhone = activePhones.indexOf(phoneName);
  let cont = 0;
  let startdate = new Date();
  for (
    let index = indexPhone + startIndex;
    index <= lengthLines - 1;
    index = index + activePhones.length
  ) {
    if (cont >= numEnvios) {
      break;
    }
    if (cont % 5 === 0 && cont !== 0) {
      await lineHeating(client, idActiveLine);
      console.log(`Telefono ${phoneName} Iniciando Ronda de Calentamineto`);
    }
    cont++;
    let start_t = new Date();
    let identificacion = obj[index].identification;
    let name = getName(obj[index].name);
    let contact = obj[index].phone;
    /*if (obj[index].IGS_status) {
      let times_reached = obj[index].IGS_status.wp_status[1].times_reached;
      console.log(times_reached);*/
    if (contact != null /*&& times_reached != 1*/) {
      contact = "593" + contact + "@c.us";
      //let contact = "593" + 995109767 + "@c.us"; //980535586 andres  992900544 juan    987592024 Patricia     contact
      let contact_status = await client.checkNumberStatus(contact);
      console.log("contact>>>" + contact);
      if (contact_status.numberExists) {
        num_existe++;
        console.log(
          `[${index}] [${phoneName}] ${obj[index].name} tef:${contact} id:${identificacion} (Total si existen: ${num_existe})`
        );
        let time_delay = getRandomInt(27000, 35000);
        let time_file = time_delay / getRandomInt(4, 10);
        let time_message = time_delay / getRandomInt(3, 8);
        let time_end = getRandomInt(40000, 50000);
        if (envio == true) {
          //Genera pdf
          await generar_pdf(identificacion, campaign_info, phoneName, name);
          await delay(time_file);
          //Envía pdf
          await client
            .sendFile(
              contact,
              `src/components/pdf/${campaign_info.name}${phoneName}.pdf`,
              `${campaign_info.pdf_name}${getRandomInt(1, 100)}.pdf`,
              "Abrir pdf"
            )
            .then((result) => {
              //console.log('Result: ', result); //return object success
            })
            .catch((error) => {
              //console.error('Error when sending: ', error); //return object error
            });
          await delay(time_message);
          await client.sendText(contact, `${saludo(start_t)} ${name}`); //name
          //Mensaje Completo
          await client.sendText(contact, mensaje(campaign_info.name + '-' + campaign_info.pdf_name));
          updateClient(
            colec,
            obj[index]._id,
            campaign_info.db_name,
            new Date(),
            phoneName
          );
          console.log(
            `Envío (${cont}) de ${phoneName} Terminado, esperando ${
              time_end / 1000
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
    //}
    /*
    console.log(
      `Envío (${cont}) realizado en ${(new Date() - start_t) / 1000} segundos`
    );
    */
  }
  console.log(
    `[${phoneName}] Tiempo de Ejecución: ${
      (new Date() - startdate) / 60000
    } minutos`
  );
  await delay(getRandomInt(600000, 900000));
  startLinesHeating(client, idActiveLine);
}

async function startLinesHeating(client, idActiveLine) {
  let start_t = new Date();
  let end_hour = getRandomInt(22, 23);
  while (start_t.getHours() < end_hour) {
    lineHeating(client, idActiveLine);
    await delay(getRandomInt(300000, 1200000));
    start_t = new Date();
  }
}

async function start(client, idActiveLine, phoneName) {
  console.log("Starting");
  let startdate = new Date();
  let day = startdate.getDate();
  let month = startdate.getMonth();
  let year = startdate.getFullYear();
  let hour = startdate.getHours();
  console.log(`${day}-${month}-${year}, ${hour}h`);
  client.onMessage(async (message) => {
    let name = message.sender.name;
    if (phoneNames.indexOf(name) == -1 && message.type == "chat") {
      let mensaje = message.body.toLowerCase();
      let keywords = [
        "información",
        "informacion",
        "consiste",
        "se activa",
        "activo",
        "trata",
      ];
      let term_found = keywords.some(function (_term) {
        return mensaje.indexOf(_term) > -1;
      });
      if (term_found) {
        await delay(getRandomInt(1000, 2000));
        client.sendText(message.from, respuesta[0]);
        await delay(getRandomInt(1000, 2000));
        client.sendText(message.from, respuesta[1]);
        await delay(getRandomInt(1000, 2000));
        client.sendText(message.from, respuesta[2]);
      }
    }
  });
  await production(client, idActiveLine, phoneName);
  //await lineHeating(client, idActiveLine);
}
