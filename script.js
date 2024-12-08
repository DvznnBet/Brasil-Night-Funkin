const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
let gameStarted = false;

canvas.width = 800;
canvas.height = 400;

// Carregar a música
const music = new Audio('assets/music/brasil_funk.mp3');
music.loop = true;
let score = 0;
let arrowPositions = [];

// Efeitos sonoros
const acertoSom = new Audio('assets/sounds/acerto.mp3');
const erroSom = new Audio('assets/sounds/erro.mp3');
const inicioSom = new Audio('assets/sounds/inicio.mp3');

// Função para começar o jogo
function startGame() {
  startScreen.style.display = 'none'; // Oculta a tela inicial
  canvas.style.display = 'block'; // Exibe o canvas do jogo
  music.play(); // Inicia a música
  inicioSom.play(); // Som de início
  gameStarted = true;
}

// Evento de pressionamento de tecla para começar
document.addEventListener('keydown', () => {
  if (!gameStarted) {
    startGame(); // Inicia o jogo ao pressionar uma tecla
  }
});

// Função para gerar setas (simplificado)
function generateArrows() {
  const currentTime = music.currentTime;
  if (Math.abs(currentTime - 1) < 0.1) {
    const randomArrow = ['⬆', '⬇', '⬅', '➡'][Math.floor(Math.random() * 4)];
    arrowPositions.push({
      arrow: randomArrow,
      position: 800,
      speed: 2,
      color: '#009c3b' // Cor inicial
    });
  }
}

// Função para desenhar as setas
function drawArrows() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  arrowPositions.forEach((arrowObj, index) => {
    ctx.fillStyle = arrowObj.color; // Cor da seta
    ctx.font = '50px Arial';
    ctx.fillText(arrowObj.arrow, arrowObj.position, 300);
    arrowObj.position -= arrowObj.speed;
    
    if (arrowObj.position < 0) {
      arrowPositions.splice(index, 1);
    }
  });
}

// Função para desenhar a pontuação
function drawScore() {
  ctx.fillStyle = '#002776';
  ctx.font = '20px Arial';
  ctx.fillText(`Pontuação: ${score}`, 10, 20);
}

// Função de efeito visual de acerto
function efeitoAcerto(arrowObj) {
  // Explosão de cor (simples efeito visual)
  arrowObj.color = 'yellow'; 
  setTimeout(() => {
    arrowObj.color = '#009c3b'; // Volta à cor original
  }, 100);
  acertoSom.play(); // Som de acerto
}

// Função de efeito visual de erro
function efeitoErro() {
  // Piscando a tela
  document.body.style.backgroundColor = 'red'; // Fica vermelho ao errar
  setTimeout(() => {
    document.body.style.backgroundColor = '#f4f4f4'; // Volta à cor original
  }, 100);
  erroSom.play(); // Som de erro
}

// Função para verificar se a tecla correta foi pressionada
function checkKeyPress() {
  keys.forEach((key, index) => {
    arrowPositions.forEach((arrowObj, arrowIndex) => {
      if (arrowObj.position < 150 && key === arrowObj.arrow) {
        // Se acertou a tecla certa, aumenta a pontuação
        score++;
        efeitoAcerto(arrowObj); // Chama o efeito de acerto
        arrowPositions.splice(arrowIndex, 1); // Remove a seta após acertar
        keys.splice(index, 1); // Remove a tecla pressionada
      } else if (arrowObj.position < 150) {
        // Se errou a tecla
        efeitoErro(); // Chama o efeito de erro
      }
    });
  });
}

// Função para verificar a entrada de teclado
const keys = [];
document.addEventListener('keydown', (e) => {
  if (!keys.includes(e.key)) keys.push(e.key);
});
document.addEventListener('keyup', (e) => {
  const index = keys.indexOf(e.key);
  if (index > -1) keys.splice(index, 1);
});

// Loop do jogo
function gameLoop() {
  if (gameStarted) {
    generateArrows();
    drawArrows();
    drawScore();
    checkKeyPress();
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();