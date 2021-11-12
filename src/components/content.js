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
  'Contáctenos para más información.' +
  puntuacion[getRandomInt(0, 1)];

let art_info = new Object();

export const Responses = Object.freeze({
  welcome: 'Muchas gracias por comunicarse con nosotros y su interés en nuestra &A exclusivo para clientes &C. &L elija una de las siguientes opciones:',
  choose_option: 'Opción no válida, por favor elija una de las opciones del menú:',
  menu: '\n1. Más información\n2. Costo de la asistencia\n3. Activar la asistencia\n4. Dejar de recibir información acerca de este servicio'
    +'\n5. Dejar de recibir información de esta o cualquier otra asistencia\n6. Quiero que me contacten',
  activate:'Para activar el servicio, acceda al PDF adjunto y haga clic en el botón de "Activar Asistencia". '
    +'Una vez que sea redireccionado a nuestro sitio web, su asistencia ya se encontrará activada. '
    +'Recuerde que al hacer clic en el botón, usted está aceptando las Condiciones del servicio que se encuentran detalladas en el PDF adjunto',
  unsubscribe_service: 'Muchas gracias. A partir de ahora ya no recibirá más información acerca de este servicio',
  unsubscribed_service: 'Usted ya ha cancelado la suscripción a este servicio',
  unsubscribe_number: 'Disculpe las molestias, a partir de ahora ya no recibirá más información de nuestras asistencias',
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

export async function generar_pdf(user, id, name) {
  let options = {
    height: art_info.height,
    width: art_info.width,
    //format: "A5",
    orientation: 'portrait',
  };

  let html = readFileSync(art_info.html_path, 'utf8');
  let URL = art_info.url_accept_assistance + user + '_' + id.replace('-', '');
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
  Saludo = Saludo + palabras[getRandomInt(0, 3)]; //
  return Saludo;
}

export function mensaje() {
  let mensaje = art_info.message[getRandomInt(0, art_info.message.length - 1)];
  while (mensaje.includes('\\c')) {
    mensaje = mensaje.replace('\\c', coma[getRandomInt(0, 1)])
  }
  while (mensaje.includes('\\s')) {
    mensaje = mensaje.replace('\\s', espacios[getRandomInt(0, 1)])
  }
  while (mensaje.includes('\\p')) {
    mensaje = mensaje.replace('\\p', puntuacion[getRandomInt(0, 1)])
  }
  return mensaje + espacios[getRandomInt(0, 1)] + mensaje_activacion;
}

export function mensaje_random() {
  let randWords = randomWords({ min: 3, max: 10 });
  let randomString = randWords.join(' ') + ((Math.random() < 0.6) ? ('') : (' ' + emojis[getRandomInt(0, emojis.length - 1)]));
  return randomString;
}