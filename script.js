let canvas = document.getElementById('canvas');
let contexto = canvas.getContext('2d');
let larguraCanvas = 360;
let alturaCanvas = 640;
let imagemFundo = new Image();
imagemFundo.src = './assets/fundoLaranja.png';
let bloquearInteracao = false;
let pontuacao = 0;

document.addEventListener('keydown', teclas);

let statusJogo = {
    MENU: 'menu',
    JOGANDO: 'jogando',
    VOCE_PERDEU: 'vocePerdeu'
}

let estadoAtualJogo = statusJogo.MENU;

let botaoIniciar = {
    x: larguraCanvas / 2 - 115.5 / 2,
    y: alturaCanvas / 2 - 64 / 2,
    largura: 115,
    altura: 64
}

export let logoJogo = {
    x: larguraCanvas / 2 - 300 / 2,
    y: alturaCanvas / 4,  
    largura: 300,
    altura: 100
};


let imagemTitulo = new Image();
imagemTitulo.src = './assets/flappyBirdLogo.png';

let vocePerdeuImg = new Image();
vocePerdeuImg.src = './assets/flappy-gameover.png';

let passaro = {
    x: 50,
    y: alturaCanvas / 2,
    largura: 40,
    altura: 30
}

let velocidadeVertical = 0;
let velocidadeHorizontal = -2;
let gravidadePassaro = 0.5;
let passaroVertical = alturaCanvas / 2;
let larguraCanos = 50;
let distanciaCanos = 250;
let canosArray = [];
let canosIntervaloId; 

let imagemPassaro = new Image();
let canoSuperiorImg = new Image();
let canoInferiorImg = new Image();
let botaoIniciarImg = new Image(); 


function criarCanos(){
    let alturaMaximaCano = alturaCanvas - distanciaCanos - 50;
    let alturaCanoSuperior = Math.floor(Math.random() * alturaMaximaCano);
    let alturaCanoInferior = alturaCanvas - alturaCanoSuperior - distanciaCanos;

    let canoSuperior = {
        x: larguraCanvas,
        y: 0,
        largura: larguraCanos,
        altura: alturaCanoSuperior,
        ultrapassado: false,
        img: canoSuperiorImg
    };
    
    let canoInferior = {
        x: larguraCanvas,
        y: alturaCanoSuperior + distanciaCanos,
        largura: larguraCanos,
        altura: alturaCanoInferior,
        ultrapassado: false,
        img: canoInferiorImg
    };
    

    canosArray.push(canoSuperior, canoInferior);
}

window.onload = function() {
    canvas.height = alturaCanvas;
    canvas.width = larguraCanvas;

    imagemPassaro.src = './assets/flappybird.png';

    canoSuperiorImg.src = './assets/toppipe.png';

    canoInferiorImg.src = './assets/bottompipe.png';

    botaoIniciarImg.src = './assets/flappyBirdPlayButton.png';

    requestAnimationFrame(loopJogo);
} 

function loopJogo() {
    requestAnimationFrame(loopJogo);
    contexto.clearRect(0, 0, canvas.width, canvas.height);

    if (estadoAtualJogo === statusJogo.MENU)  {
        menu();
    }else if(estadoAtualJogo === statusJogo.JOGANDO) {
        jogo();
    }else if(estadoAtualJogo === statusJogo.VOCE_PERDEU) {
        vocePerdeu();
    }
}