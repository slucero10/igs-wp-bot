import { create } from 'pdf-creator-node';
import { readFileSync } from 'fs';
import randomWords from "random-words";

let palabras = [
  ' estimado/a',
  ' estimado/a Sr/a',
  ', estimado/a',
  ', estimado/a Sr/a',
];
let espacios = [' ', '  '];
let puntuacion = ['.', ' '];
let coma = [',', '']
let emojis = ['😀', '😱', '🥺', '😐', '👍🏻', '😠', '❤️', '🍻'];

let mensaje_activacion =
  'Para activar su servicio acceda al' +
  espacios[getRandomInt(0, 1)] +
  'PDF adjunto y de click en' +
  espacios[getRandomInt(0, 1)] +
  '"Activar Asistencia"' +
  puntuacion[getRandomInt(0, 1)];

let art_info = new Object();

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
  let URL = art_info.url_accept_assistance + user;
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