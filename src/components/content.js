import { create } from 'pdf-creator-node';
import { readFileSync } from 'fs';
import randomWords from "random-words";

const palabras = [
  ' estimado/a',
  ' estimado/a Sr/a',
  ', estimado/a',
  ', estimado/a Sr/a',
];
const espacios = [' ', '  '];
const puntuacion = ['.', ' '];
const coma = [',', '']
const emojis = ['😀', '😱', '🥺', '😐', '👍🏻', '😠', '❤️', '🍻'];

let mensaje_activacion =
  'Para activar su servicio, acceda al' +
  espacios[getRandomInt(0, 1)] +
  'PDF adjunto y de click en' +
  espacios[getRandomInt(0, 1)] +
  '"Activar Asistencia".' +
  espacios[getRandomInt(0, 1)] +
  'Contáctenos para más información' +
  puntuacion[getRandomInt(0, 1)];

let art_info = new Object();

export const Responses = Object.freeze({
  welcome: 'Muchas gracias por comunicarse con nosotros y su interés en nuestra &A exclusivo para clientes &C. &L elija una de las siguientes opciones:',
  choose_option: 'Por favor elija una de las opciones del menú:',
  menu: '\n\n1️⃣ Más información' + 
  '\n2️⃣ Costo de la Asistencia' +
  '\n3️⃣ Activar la Asistencia' +
  '\n4️⃣ Quiero que me contacten' +
  '\n5️⃣ Dejar de recibir información',
  activate:'*Activar la Asistencia*\n\n✔️Para activar el servicio, acceda al PDF adjunto y de clic en el botón de *“Activar Asistencia”*, una vez que sea re direccionado a nuestro sitio web, su servicio de encontrará activado\n'+
  '✔️ O comuníquese a este mismo número y un operador se pondrá en contacto con usted. Recuerde que, al hacer clic en el botón usted está aceptando las condiciones del servicio que se encuentran detalladas en el PDF adjunto',
  unsubscribe_service: 'Muchas gracias. A partir de ahora ya no recibirá más información acerca de este servicio',
  unsubscribed_service: 'Usted ya ha cancelado la suscripción a este servicio',
  unsubscribe_number: 'Disculpe las molestias, a partir de ahora ya no recibirá más información acerca de nuestras asistencias',
  unsubscribed_number: 'Este número ya se encuentra fuera de nuestra base de datos',
  contact: 'Muchas gracias por contactarnos. Uno de nuestros operadores se comunicará con usted lo más pronto posible.',
  link: 'Puede activar su servicio haciendo clic en el siguiente enlace: ',
});

export function setArtInfo(obj) {
  art_info = obj;
}

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Return local time as a String, in 30 minute intervals (ex. 13:47 represented as 13:30)
 * @return {Number}      The total of the two numbers
 */
function getCurrentTime() {
  try{
    let currDate = new Date();
    let hour = currDate.getHours();
    let minutesRaw = currDate.getMinutes();
    let minutesExcess = minutesRaw % 30;
    let minutes = minutesRaw - minutesExcess;
    let minutesString = minutes.toString().length < 2 ? '0' + minutes.toString() : minutes.toString();
    return hour.toString() + minutesString;
  } catch (e){
    console.log(e);
  }
}

export async function generar_pdf(user, id, name) {
  let options = {
    height: art_info.height,
    width: art_info.width,
    //format: "A5",
    orientation: 'portrait',
  };

  let html = readFileSync(art_info.html_path, 'utf8');
  let URL = art_info.url_accept_assistance + user + '_' + id.replace('-', '') + '_' + getCurrentTime();
  if (art_info.product_name === 'FEMedicity' || art_info.product_name === 'FEFarmaciasEconomicas') {
    URL = URL + '&id_name=' + name;
  }
  let PDF = {
    html: html,
    data: {
      URL: URL,
    },
    path: 'src/components/pdf/' + art_info.product_name + id + '.pdf',
    type: '',
  };
  await create(PDF, options)
    .then((res) => {
      //console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
}

export function saludo(date) {
  let hora = date.getHours();
  let Saludo;
  if (hora >= 0 && hora <= 12) {
    Saludo = 'Buenos días';
  }
  if (hora > 12 && hora <= 18) {
    Saludo = 'Buenas tardes';
  }
  if (hora > 18 && hora <= 24) {
    Saludo = 'Buenas noches';
  }
  //Saludo = Saludo + palabras[getRandomInt(0, 3)];
  return Saludo;
}

export function mensaje() {
  let mensaje = art_info.message[getRandomInt(0, art_info.message.length - 1)]; //+ Responses.menu;
  while (mensaje.includes('\\c')) {
    mensaje = mensaje.replace('\\c', coma[getRandomInt(0, 1)])
  }
  while (mensaje.includes('\\s')) {
    mensaje = mensaje.replace('\\s', espacios[getRandomInt(0, 1)])
  }
  while (mensaje.includes('\\p')) {
    mensaje = mensaje.replace('\\p', puntuacion[getRandomInt(0, 1)])
  }
  return mensaje + espacios[getRandomInt(0, 1)];
}

export function mensaje_random() {
  let randWords = randomWords({ min: 3, max: 10 });
  let randomString = randWords.join(' ') + ((Math.random() < 0.6) ? ('') : (' ' + emojis[getRandomInt(0, emojis.length - 1)]));
  return randomString;
}