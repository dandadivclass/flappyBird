let canvas = document.getElementById('canvas');
let contexto = canvas.getContext('2d');
let larguraCanvas = 360;
let alturaCanvas = 640;
let imagemFundo = new Image(); imagemFundo.src = './assets/startFundo.jpeg';
let bloquearInteracao = false;
let pontuacaoInicial = document.querySelector('.pontuacao-numero');
const botaoJogarNovamente = document.querySelector('.botao-jogar');
const sairOuJogar = document.querySelector('.sair-ou-jogar');
sairOuJogar.style.display = 'none';
const botaoRegras = document.querySelector('.botao-regras');
const modalRegras = document.querySelector('.container-placa');
const botaoModal = document.getElementById('botao-modal');

document.addEventListener('keydown', teclas);
let statusJogo = {
    MENU: 'menu',
    JOGANDO: 'jogando',
    VOCE_PERDEU: 'vocePerdeu'
}
let estadoAtualJogo = statusJogo.MENU;
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
let distanciaCanos = 150;
let canosArray = [];
let canosIntervaloId; 
let imagemPassaro = new Image();
let canoSuperiorImg = new Image();
let canoInferiorImg = new Image(); 


let pontuacaoFinalJogo = parseInt(pontuacaoInicial.innerText);
let recordeAtualizado = parseInt(recorde.innerText);
let recorde = document.querySelector('.recorde-numero');
let recordeSalvo = localStorage.getItem('recorde');
if (recordeSalvo) {
    recorde.innerText = recordeSalvo;
} else {
    recorde.innerText = '0';
}


function atribuirPontuacao() {
    pontuacaoInicial.innerText = parseInt(pontuacaoInicial.innerText) + 5;
}

function abrirFecharModal() {
    let displayModal;
    displayModal = modalRegras.style.display = 'none';

    botaoRegras.addEventListener('click', () => {
        displayModal = modalRegras.style.display = 'flex'
        console.log('sdf');
        
    })

    botaoModal.addEventListener('click', () => {
        displayModal = modalRegras.style.display = 'none'
        console.log('sdf');
        
    })
}

abrirFecharModal();

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
        img: canoSuperiorImg,
        superior: true
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

function menu() {
    if (imagemFundo.complete) {
        contexto.drawImage(imagemFundo, 0, 0, 400, 645);
    }

    if (imagemTitulo.complete) {
        let proporcao = imagemTitulo.naturalHeight / imagemTitulo.naturalWidth;
        let scaleLargura = logoJogo.largura;
        let scaleAltura = scaleLargura * proporcao;

        contexto.drawImage(imagemTitulo, logoJogo.x, logoJogo.y, scaleLargura, scaleAltura);
    }

    contexto.fillStyle = '#4d0349'; 
    contexto.font = '18px "Special Gothic Expanded One", sans-serif'; 
    contexto.textAlign = 'center'; 
    contexto.fillText('Pressione Espaço para iniciar', larguraCanvas / 2, alturaCanvas / 2 + 6);  
}

function jogo() {
    velocidadeVertical += gravidadePassaro;
    passaro.y = Math.max(passaro.y + velocidadeVertical, 0);
    contexto.drawImage(imagemPassaro, passaro.x, passaro.y, passaro.largura, passaro.altura);

    if(passaro.y > canvas.altura){
        estadoAtualJogo = statusJogo.VOCE_PERDEU;
    }

    for(let index = 0; index < canosArray.length; index++){
        let cano = canosArray[index];
 
        cano.x += velocidadeHorizontal;
        
        contexto.drawImage(cano.img, cano.x, cano.y, cano.largura, cano.altura);
        
        if (!cano.ultrapassado && passaro.x > cano.x + cano.largura && cano.superior) {
            atribuirPontuacao();
            cano.ultrapassado = true;
        }

        if(colisao(passaro, cano)){
            estadoAtualJogo = statusJogo.VOCE_PERDEU;
        }
        if (colisaoComChao(passaro)) {
            estadoAtualJogo = statusJogo.VOCE_PERDEU;
        }
        
    }

    while(canosArray.length > 0 && canosArray[0].x < -larguraCanos){
        canosArray.shift();
    }

 
}

function vocePerdeu() {
    if(vocePerdeuImg.complete) {
        let larguraImg = 400;
        let alturaImg = 80;
        let x = (larguraCanvas - larguraImg) / 2;
        let y = alturaCanvas / 3;

        contexto.drawImage(vocePerdeuImg, x, y, larguraImg, alturaImg); 

        sairOuJogar.style.display = 'flex'; 

        if (pontuacaoFinalJogo > recordeAtualizado) {
            recorde.innerText = pontuacaoFinalJogo.toString();
            localStorage.setItem('recorde', pontuacaoFinalJogo.toString());
        }

        bloquearInteracao = true;
        setTimeout(() => {
            bloquearInteracao = false;
        }, 1000);

    }
}

function teclas(event) {
    if (bloquearInteracao) return;

    if (event.code === 'Space') {
        event.preventDefault(); 
        console.log('Barra de espaço pressionada');

        if (estadoAtualJogo === statusJogo.MENU) {
            iniciarJogo();
        } else if (estadoAtualJogo === statusJogo.VOCE_PERDEU) {
            return
        } else if (estadoAtualJogo === statusJogo.JOGANDO) {
            velocidadeVertical = -6;  
        }
    }
}

function iniciarJogo() {
    resetarJogo();
    estadoAtualJogo = statusJogo.JOGANDO;

    if(canosIntervaloId){
        clearInterval(canosIntervaloId);
    }

    canosIntervaloId = setInterval(criarCanos, 1500);
}

function resetarJogo() {
    passaro.y = passaroVertical;
    velocidadeVertical = 0;
    canosArray = [];
    pontuacaoInicial.innerText = '0';
}

botaoJogarNovamente.addEventListener('click', () => {
    resetarJogo();
    iniciarJogo();
    sairOuJogar.style.display = 'none';
})


function colisao(passaro, cano){
    let margem = 5;
    return (
        passaro.x + margem < cano.x + cano.largura &&
        passaro.x + passaro.largura - margem > cano.x &&
        passaro.y + margem < cano.y + cano.altura &&
        passaro.y + passaro.altura - margem > cano.y
    );
}

function colisaoComChao(passaro) {
    return passaro.y + passaro.altura >= alturaCanvas;
}