//Required package
import { create } from 'pdf-creator-node';
import { readFileSync } from 'fs';

let palabras = [
  ' estimado/a',
  ' estimado/a Sr/a',
  ', estimado/a',
  ', estimado/a Sr/a',
];
let espacios = [' ', '  '];
let puntuacion = ['.', ' '];
let coma = [',', '']
let mensaje_activacion =
  'Para activar su servicio acceda al' +
  espacios[getRandomInt(0, 1)] +
  'PDF adjunto y de click en' +
  espacios[getRandomInt(0, 1)] +
  '"Activar Asistencia"' +
  puntuacion[getRandomInt(0, 1)];

export const respuesta = [
  'Muchas gracias por su interés, este es un producto pensado para cuidar y mantener tu salud y la de tu familia',
  'Para proceder con la contratación del servicio, por favor abra al PDF y haga clic en el botón de activar la asistencia. El producto tiene un costo de USD 0.23 diarios que será descontado del producto financiero que tenga activo con Andalucía. ',
  'Recuerde que este es un servicio operado por IGS, exclusivo para clientes Cooperativa Andalucía. El servicio puede ser cancelado en cualquier momento, para más información acceder a las condiciones de servicio.',
];

export const art_info = [
  {
    name: 'Andalucia',
    db: '',
    pdf_name: 'AsistenciaSalud',
    db_name: 'asistencia_salud',
    url_accept_assistance:
      'https://www.igroupsolution.com/asistencia-salud-web/?utm_campaign=website&utm_source=andalucia&utm_medium=whatsapp?id=',
    html_path: 'src/components/html/html_andalucia.html',
    height: '10.2in',
    width: '6.5in',
  },
  {
    name: 'Multiayuda',
    db: '',
    url_accept_assistance:
      'http://www.igroupsolution.com/multiayudamulticoop/?utm_campaign=website&utm_source=multiayuda&utm_medium=whatsapp?id=',
    html_path: 'src/components/html/html_multiayuda.html',
    height: '18in',
    width: '9in',
  },
  {
    name: 'Multisalud',
    db: '',
    url_accept_assistance:
      'http://www.igroupsolution.com/multisaludmulticoop/?utm_campaign=website&utm_source=multisalud&utm_medium=whatsapp?id=',
    html_path: 'src/components/html/html_multisalud.html',
    height: '12in',
    width: '6.3in',
  },
  {
    name: 'Santa Rosa',
    db: '',
    url_accept_assistance:
      'http://www.igroupsolution.com/santarosasalud/?utm_campaign=website&utm_source=santa_rosa.com&utm_medium=whatsapp?id=',
    html_path: 'src/components/html/html_santarosa.html',
    height: '9.5in',
    width: '6.5in',
  },
  {
    name: 'BGR',
    db: '',
    pdf_name: 'AsistenciaCelularProtegido',
    db_name: 'asistencia_celular_protegido',
    url_accept_assistance:
      'https://www.igroupsolution.com/bgrasistenciacelular/?utm_campaign=website&utm_source=asistencia_celular_protegido&utm_medium=whatsapp?id=',
    html_path: 'src/components/html/html_bgr.html',
    height: '8.7in',
    width: '7.28in',
  },
  {
    name: 'BGR',
    db: '',
    pdf_name: 'AsistenciaMascotas',
    url_accept_assistance:
      'https://www.igroupsolution.com/bgr-asistencia-mascotas/?utm_campaign=website&utm_source=asistencia_mascotas&utm_medium=whatsapp?id=',
    html_path: 'src/components/html/html_bgr_asistencia_mascotas.html',
    height: '6.78in',
    width: '5.8in',
  },
  {
    name: 'FEMedicity',
    db: '',
    pdf_name: 'AsistenciaSaludIntegral',
    db_name: 'farmaenlace_medicity',
    url_accept_assistance:
      'https://www.igroupsolution.com/asistenciamedicity/?utm_campaign=website&utm_source=farmaenlace_asistencia_salud_integral&utm_medium=whatsapp?id=',
    html_path: 'src/components/html/html_farmaenlace_medicity.html',
    height: '10.2in',
    width: '6.5in',
  },
  {
    name: 'FEFarmaciasEconomicas',
    db: '',
    pdf_name: 'AsistenciaSalud',
    db_name: 'farmaenlace_fe',
    url_accept_assistance:
      'https://www.igroupsolution.com/asistenciafarmaciaseconomicas/?utm_campaign=website&utm_source=farmaenlace_asistencia_salud&utm_medium=whatsapp?id=',
    html_path: 'src/components/html/html_farmaenlace_fe.html',
    height: '10.2in',
    width: '6.5in',
  }
];


export const phoneNames = [
  '1-A',
  '2-A',
  '3-A',
  '4-A',
  '5-A',
  '6-A',
  '7-A',
  '8-A',
  '9-A',
  '10-A',
  '11-A',
  '1-N',
  '2-N',
  '2-I',
  '4-I'
];

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function generar_pdf(user, info, id, name) {
  let options = {
    height: info.height,
    width: info.width,
    //format: "A5",
    orientation: 'portrait',
  };

  let html = readFileSync(info.html_path, 'utf8');
  let URL = info.url_accept_assistance + user; //user
  if (info.name == 'Farmaenlace') {
    URL = URL + '&id_name=' + name;
  }
  let PDF = {
    html: html,
    data: {
      URL: URL,
    },
    path: 'src/components/pdf/' + info.name + id + '.pdf',
    type: '',
  };
  await create(PDF, options)
    .then((res) => {
      //console.log(res);
    })
    .catch((error) => {
      //console.error(error);
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

export function mensaje(coop) {
  let mensaje = '';
  if (coop == art_info[0].name + '-' + art_info[0].pdf_name) {
    mensaje =
      'IGS Ecuador con el soporte de la Cooperativa Andalucía pensando en su bienestar y su familia, ha creado la *Asistencia Salud*.' +
      espacios[getRandomInt(0, 1)];
    return mensaje + mensaje_activacion;
  }
  if (coop == 'Multiayuda') {
    mensaje =
      'La Cooperativa Multicoop pensando en su bienestar,' +
      espacios[getRandomInt(0, 1)] +
      'ha creado la' +
      espacios[getRandomInt(0, 1)] +
      'Asistencia MultiAyuda para desempleo.' +
      espacios[getRandomInt(0, 1)];
    return mensaje + mensaje_activacion;
  }
  if (coop == 'Multisalud') {
    mensaje =
      'La Cooperativa Multicoop pensando en su bienestar,' +
      espacios[getRandomInt(0, 1)] +
      'ha creado la' +
      espacios[getRandomInt(0, 1)] +
      'Asistencia Asistencia Multisalud.' +
      espacios[getRandomInt(0, 1)];
    return mensaje + mensaje_activacion;
  }
  if (coop == 'Santa Rosa') {
    mensaje =
      'La Cooperativa Santa Rosa pensando en su bienestar y su familia,' +
      espacios[getRandomInt(0, 1)] +
      'ha creado la' +
      espacios[getRandomInt(0, 1)] +
      'Asistencia Salud 360º.' +
      espacios[getRandomInt(0, 1)];
    return mensaje + mensaje_activacion;
  }
  if (coop == art_info[4].name + '-' + art_info[4].pdf_name) {
    mensaje = [
      'IGS pensando en su tranquilidad y en cubrir su celular ante cualquier eventualidad' +
        espacios[getRandomInt(0, 1)] +
        'ha creado para usted' +
        espacios[getRandomInt(0, 1)] +
        'la Asistencia Celular Protegido.' +
        espacios[getRandomInt(0, 1)] +
        'Este es un servicio prestado por IGS para clientes del *Banco General Rumiñahui*.',

      'Pensando en su tranquilidad y en cubrir su celular ante cualquier eventualidad' +
        espacios[getRandomInt(0, 1)] +
        'IGS ha creado' +
        espacios[getRandomInt(0, 1)] +
        'la Asistencia Celular Protegido.' +
        espacios[getRandomInt(0, 1)] +
        'Este es un servicio prestado por IGS para clientes del *Banco General Rumiñahui*.',

      'IGS ha creado para clientes del *Banco General Rumiñahui*' +
        espacios[getRandomInt(0, 1)] +
        'la Asistencia Celular Protegido.' +
        espacios[getRandomInt(0, 1)] +
        'Este es un servicio pensado en su tranquilidad, cubrirá su celular ante cualquier eventualidad.',
    ];
    return mensaje[getRandomInt(0, 2)] + mensaje_activacion; //
  }
  if (coop == art_info[5].name + '-' + art_info[5].pdf_name) {
    mensaje = [
      'IGS pensando en su tranquilidad y en cuidar de su mascota' +
        coma[getRandomInt(0, 1)] +
        espacios[getRandomInt(0, 1)] +
        'ha creado para usted' +
        espacios[getRandomInt(0, 1)] +
        'la Asistencia Mascotas.' +
        espacios[getRandomInt(0, 1)] +
        'Este es un servicio prestado por IGS para clientes del *Banco General Rumiñahui*.',

      'Pensando en su tranquilidad y en cuidar de su mascota' +
        coma[getRandomInt(0, 1)] +
        espacios[getRandomInt(0, 1)] +
        'IGS ha creado' +
        espacios[getRandomInt(0, 1)] +
        'la *Asistencia Mascotas*.' +
        espacios[getRandomInt(0, 1)] +
        'Este es un servicio prestado por IGS para clientes del *Banco General Rumiñahui*.',

      'IGS ha creado para clientes del *Banco General Rumiñahui*' +
        espacios[getRandomInt(0, 1)] +
        'la Asistencia Mascotas.' +
        espacios[getRandomInt(0, 1)] +
        'Este es un servicio pensado en su tranquilidad y en el bienestar de su mascota.',
    ];
    return mensaje[getRandomInt(0, 2)] + mensaje_activacion; //
  }
  if (coop == art_info[6].name + '-' + art_info[6].pdf_name) {
    mensaje =
      'IGS Ecuador con el soporte de Farmacias Medicity' +
      coma[getRandomInt(0, 1)] + 
      espacios[getRandomInt(0, 1)] +
      'pensando en tu bienestar y el de tu familia,' +
      espacios[getRandomInt(0, 1)] +
      'ha creado la *Asistencia Salud Integral*.' +
      espacios[getRandomInt(0, 1)] +
      'Este es un producto de salud que te cubririrá a ti y a tu familia' +
      espacios[getRandomInt(0, 1)] +
      '(cónyuge e hijos menores de 21 años) con coberturas de:' +
      espacios[getRandomInt(0, 1)] +
      'consultas médicas presenciales, gastos hospitalarios ($500),' +
      espacios[getRandomInt(0, 1)] +
      'gastos de sala de emergencia ($800), ambulancia, nutricionista, servicio exequial' +
      espacios[getRandomInt(0, 1)] +
      '(sin límite en el costo) y mchos beneficios más.';
    return mensaje + mensaje_activacion;
  }
  if (coop == art_info[6].name + '-' + art_info[6].pdf_name) {
    mensaje =
      'IGS Ecuador con el soporte de Farmacias Económicas' +
      coma[getRandomInt(0, 1)] + 
      espacios[getRandomInt(0, 1)] +
      'pensando en tu bienestar y el de tu familia,' +
      espacios[getRandomInt(0, 1)] +
      'ha creado la *Asistencia Salud*.' +
      espacios[getRandomInt(0, 1)] +
      'Este es un producto de salud que te cubririrá a ti y a tu familia' +
      espacios[getRandomInt(0, 1)] +
      '(cónyuge e hijos menores de 21 años) con coberturas de:' +
      espacios[getRandomInt(0, 1)] +
      'consultas médicas presenciales, telemedicina, ambulancia, gastos hospitalarios ($250),' +
      espacios[getRandomInt(0, 1)] +
      'sala de emergencia ($400) y mchos beneficios más.' +
      espacios[getRandomInt(0, 1)] +
      'El servicio tiene un costo de menos de $3 mensual'
      espacios[getRandomInt(0, 1)] +
      'y lo puedes contratar por 3, 6 y 12 meses. ';
    return mensaje + mensaje_activacion;
  }
}

/*
let info = 
{
    "name":"Santa Rosa",
    'url_accept_assistance': 'http://www.igroupsolution.com/santarosasalud/?utm_campaign=website&utm_source=santa_rosa.com&utm_medium=whatsapp?id=',
    "html_path":"src/components/html/html_santarosa.html",
    "height": "9.5in",
    "width": "6.5in"
};
let user = "1717398428";
generar_pdf(user,info);
*/

