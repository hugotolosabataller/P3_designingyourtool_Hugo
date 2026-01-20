let inputCols, inputFilas, pickFondo, pickForma; 
let inputAncho, inputAlto; 

let btnGuardar, btnLimpiar;

let checkLineas;  // CHECKBOX

let columnas = 1;
let filas = 1;
let matriz = []; 
let formaSeleccionada = 0; 

function setup() {
  // VALORES POR DEFECTO
  let lienzo = createCanvas(600, 600);
  lienzo.parent('canvas-container');
  colorMode(HSL, 360, 100, 100);
  angleMode(DEGREES);

  // CONEXIÓN CON EL HTML
  inputCols = select('#idCols');
  inputFilas = select('#idRows');
  pickFondo = select('#idPickFondo');
  pickForma = select('#idPickForma');
  
  // DIMENSIONES
  inputAncho = select('#idAncho');
  inputAlto = select('#idAlto');

  // EVENTOS
  inputCols.changed(inicializarMatriz);
  inputFilas.changed(inicializarMatriz);
  
  // CAMBIO DE CANVAS RECIBIDO
  inputAncho.input(actualizarDimensiones);
  inputAlto.input(actualizarDimensiones);

  // BOTONES GUARDAR LIMPIAR
  btnGuardar = select('#btnGuardar');
  btnGuardar.mousePressed(guardarImagen);

  btnLimpiar = select('#btnLimpiar');
  btnLimpiar.mousePressed(limpiarMosaico);

  // CHECKBOX
  checkLineas = select('#idCheckLineas');

  inicializarMatriz();
}

// FUNCIÓN PARA REDIMENSIONAR EL CANVAS
function actualizarDimensiones() {
  let nuevoAncho = int(inputAncho.value());
  let nuevoAlto = int(inputAlto.value());

  // LIMITES AJUSTADOS A LA PANTALLA
  nuevoAncho = constrain(nuevoAncho, 200, 1250);
  nuevoAlto = constrain(nuevoAlto, 200, 730);

  // REAJUSTE AUTOMATICO DEL CANVAS
  resizeCanvas(nuevoAncho, nuevoAlto);
}

function keyPressed() {
  if (key >= '0' && key <= '5') {
    formaSeleccionada = int(key); 
  }
}

function mousePressed() {
  // CALCULO PROPORCIONAL
  let anchoCelda = width / columnas;
  let altoCelda = height / filas;
  let i = floor(mouseX / anchoCelda);
  let j = floor(mouseY / altoCelda);

  if (i >= 0 && i < columnas && j >= 0 && j < filas) {
    let celdaExistente = matriz[i][j];

    if (celdaExistente.tipo === formaSeleccionada && formaSeleccionada !== 0) {
      celdaExistente.rot = (celdaExistente.rot + 90) % 360;
      celdaExistente.colorBg = pickFondo.value();
      celdaExistente.colorFg = pickForma.value();
    } else {
      matriz[i][j] = {
        tipo: formaSeleccionada, 
        colorBg: pickFondo.value(), 
        colorFg: pickForma.value(), 
        rot: 0 
      };
    }
  }
}

function inicializarMatriz() {
  let nuevasCols = int(inputCols.value());
  let nuevasRows = int(inputFilas.value());
  let matrizAnterior = matriz; 
  matriz = []; 

  for (let i = 0; i < nuevasCols; i++) {
    matriz[i] = []; 
    for (let j = 0; j < nuevasRows; j++) {
      if (i < columnas && j < filas && matrizAnterior[i] && matrizAnterior[i][j]) {
        matriz[i][j] = matrizAnterior[i][j];
      } else {
        matriz[i][j] = { 
          tipo: 0,
          colorBg: '#FFFFFF', 
          colorFg: '#000000', 
          rot: 0
        };
      }
    }
  }
  columnas = nuevasCols;
  filas = nuevasRows;
}

function draw() {
    background(0, 0, 90); 
    
    let anchoCelda = width / columnas;
    let altoCelda = height / filas;

    for (let i = 0; i < columnas; i++) {
        for (let j = 0; j < filas; j++) {
            let x = i * anchoCelda;
            let y = j * altoCelda;
            let celdaActual = matriz[i][j];

            push();
            translate(x + anchoCelda / 2, y + altoCelda / 2); 
            rectMode(CENTER);

            // SI O NO LINEAS
            if (checkLineas.checked()) {
                stroke(0, 0, 80);
                strokeWeight(0.5);
            } else {
                noStroke();
            }
            
            fill(celdaActual.colorBg);
            rect(0, 0, anchoCelda, altoCelda);

            noStroke(); 
            rotate(celdaActual.rot);
            fill(celdaActual.colorFg);

            let wDibujo = anchoCelda;
            let hDibujo = altoCelda;

            if (celdaActual.rot === 90 || celdaActual.rot === 270) {
                wDibujo = altoCelda;
                hDibujo = anchoCelda;
            }

            dibujarForma(celdaActual.tipo, wDibujo, hDibujo);
            pop();
        }
    }
}

function dibujarForma(tipo, w, h) {
  switch (tipo) {
    case 1: ellipse(0, 0, w, h); break;
    case 2: 
      arc(0, h/2, w, h, 180, 360); 
      arc(0, 0, w, h, 180, 360); 
      break;
    case 3: arc(-w/2, h/2, w * 2, h * 2, 270, 360); break;
    case 4: triangle(0, -h/2, -w/2, h/2, w/2, h/2); break;
    case 5: rectMode(CENTER); rect(0, 0, w, h); break;
  }
}

// LIMPIAR MOSAICO
function limpiarMosaico() {
  for (let i = 0; i < columnas; i++) {
    for (let j = 0; j < filas; j++) {
      matriz[i][j] = {
        tipo: 0,
        colorBg: '#FFFFFF',
        colorFg: '#000000',
        rot: 0
      };
    }
  }
}

// GUARDAR PNG
function guardarImagen() {
  saveCanvas('MiMosaico', 'png');
}