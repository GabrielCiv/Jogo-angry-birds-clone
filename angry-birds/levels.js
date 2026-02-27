// ============================================================
// LEVELS.JS — Definição de todas as fases do Angry Birds Clone
// Episódios e fases com posicionamento de blocos, porcos e pássaros
// ============================================================

const EPISODES = [
  {
    id: 1,
    name: "Poached Eggs",
    description: "Os porcos roubaram os ovos! Hora da vingança.",
    color: "#4CAF50",
    unlocked: true
  },
  {
    id: 2,
    name: "Mighty Hoax",
    description: "Os porcos ficaram mais espertos. Cuidado!",
    color: "#2196F3",
    unlocked: false
  },
  {
    id: 3,
    name: "Danger Above",
    description: "Porcos nas alturas. Use a cabeça!",
    color: "#FF9800",
    unlocked: false
  },
  {
    id: 4,
    name: "The Big Setup",
    description: "Estruturas enormes e porcos covardes.",
    color: "#9C27B0",
    unlocked: false
  },
  {
    id: 5,
    name: "Ham 'Em High",
    description: "O desafio final. Boa sorte!",
    color: "#F44336",
    unlocked: false
  }
];

// Tipos de bloco: 'wood', 'glass', 'stone', 'tnt', 'ice'
// Formas: 'rect', 'circle', 'triangle'
// Pássaros: 'red','blue','chuck','bomb','matilda','hal','terence','bubbles'

const LEVELS = [
  // ============ EPISÓDIO 1: POACHED EGGS ============
  {
    episode: 1, level: 1,
    birds: ['red','red','red'],
    pigs: [
      { x: 750, y: 520, type: 'normal', size: 'small' }
    ],
    blocks: [
      { x: 720, y: 540, w: 80, h: 20, type: 'wood', shape: 'rect' }
    ],
    starScores: [1000, 5000, 10000],
    ground: 570
  },
  {
    episode: 1, level: 2,
    birds: ['red','red','red'],
    pigs: [
      { x: 750, y: 510, type: 'normal', size: 'small' },
      { x: 870, y: 510, type: 'normal', size: 'small' }
    ],
    blocks: [
      { x: 710, y: 540, w: 80, h: 20, type: 'wood', shape: 'rect' },
      { x: 830, y: 540, w: 80, h: 20, type: 'wood', shape: 'rect' }
    ],
    starScores: [2000, 8000, 15000],
    ground: 570
  },
  {
    episode: 1, level: 3,
    birds: ['red','red','blue'],
    pigs: [
      { x: 760, y: 490, type: 'normal', size: 'small' }
    ],
    blocks: [
      { x: 720, y: 540, w: 20, h: 60, type: 'wood', shape: 'rect' },
      { x: 800, y: 540, w: 20, h: 60, type: 'wood', shape: 'rect' },
      { x: 760, y: 505, w: 100, h: 20, type: 'wood', shape: 'rect' }
    ],
    starScores: [3000, 10000, 18000],
    ground: 570
  },
  {
    episode: 1, level: 4,
    birds: ['red','red','blue','blue'],
    pigs: [
      { x: 760, y: 480, type: 'normal', size: 'medium' },
      { x: 900, y: 540, type: 'normal', size: 'small' }
    ],
    blocks: [
      { x: 720, y: 540, w: 20, h: 80, type: 'wood', shape: 'rect' },
      { x: 800, y: 540, w: 20, h: 80, type: 'wood', shape: 'rect' },
      { x: 760, y: 495, w: 100, h: 20, type: 'glass', shape: 'rect' },
      { x: 760, y: 470, w: 60, h: 20, type: 'glass', shape: 'rect' }
    ],
    starScores: [4000, 12000, 22000],
    ground: 570
  },
  {
    episode: 1, level: 5,
    birds: ['red','chuck','chuck'],
    pigs: [
      { x: 760, y: 500, type: 'normal', size: 'small' },
      { x: 900, y: 500, type: 'normal', size: 'small' }
    ],
    blocks: [
      { x: 720, y: 540, w: 20, h: 70, type: 'glass', shape: 'rect' },
      { x: 800, y: 540, w: 20, h: 70, type: 'glass', shape: 'rect' },
      { x: 760, y: 502, w: 100, h: 20, type: 'glass', shape: 'rect' },
      { x: 860, y: 540, w: 20, h: 70, type: 'glass', shape: 'rect' },
      { x: 940, y: 540, w: 20, h: 70, type: 'glass', shape: 'rect' },
      { x: 900, y: 502, w: 100, h: 20, type: 'glass', shape: 'rect' }
    ],
    starScores: [5000, 15000, 28000],
    ground: 570
  },
  {
    episode: 1, level: 6,
    birds: ['red','chuck','bomb'],
    pigs: [
      { x: 760, y: 480, type: 'normal', size: 'medium' },
      { x: 900, y: 540, type: 'helmet', size: 'small' }
    ],
    blocks: [
      { x: 720, y: 540, w: 20, h: 100, type: 'wood', shape: 'rect' },
      { x: 800, y: 540, w: 20, h: 100, type: 'wood', shape: 'rect' },
      { x: 760, y: 485, w: 100, h: 20, type: 'wood', shape: 'rect' },
      { x: 760, y: 460, w: 60, h: 20, type: 'stone', shape: 'rect' },
      { x: 870, y: 540, w: 20, h: 60, type: 'stone', shape: 'rect' },
      { x: 930, y: 540, w: 20, h: 60, type: 'stone', shape: 'rect' },
      { x: 900, y: 505, w: 80, h: 20, type: 'stone', shape: 'rect' }
    ],
    starScores: [6000, 18000, 32000],
    ground: 570
  },
  {
    episode: 1, level: 7,
    birds: ['red','blue','chuck','bomb'],
    pigs: [
      { x: 750, y: 460, type: 'normal', size: 'small' },
      { x: 850, y: 540, type: 'normal', size: 'small' },
      { x: 970, y: 500, type: 'normal', size: 'medium' }
    ],
    blocks: [
      { x: 710, y: 540, w: 20, h: 120, type: 'wood', shape: 'rect' },
      { x: 790, y: 540, w: 20, h: 120, type: 'wood', shape: 'rect' },
      { x: 750, y: 475, w: 100, h: 20, type: 'glass', shape: 'rect' },
      { x: 750, y: 450, w: 60, h: 20, type: 'glass', shape: 'rect' },
      { x: 820, y: 540, w: 20, h: 60, type: 'wood', shape: 'rect' },
      { x: 880, y: 540, w: 20, h: 60, type: 'wood', shape: 'rect' },
      { x: 850, y: 505, w: 80, h: 20, type: 'wood', shape: 'rect' },
      { x: 940, y: 540, w: 20, h: 80, type: 'stone', shape: 'rect' },
      { x: 1000, y: 540, w: 20, h: 80, type: 'stone', shape: 'rect' },
      { x: 970, y: 495, w: 80, h: 20, type: 'stone', shape: 'rect' }
    ],
    starScores: [8000, 22000, 40000],
    ground: 570
  },
  {
    episode: 1, level: 8,
    birds: ['red','chuck','bomb','matilda'],
    pigs: [
      { x: 760, y: 440, type: 'normal', size: 'small' },
      { x: 880, y: 440, type: 'helmet', size: 'small' },
      { x: 820, y: 540, type: 'king', size: 'large' }
    ],
    blocks: [
      { x: 720, y: 540, w: 20, h: 140, type: 'wood', shape: 'rect' },
      { x: 800, y: 540, w: 20, h: 140, type: 'wood', shape: 'rect' },
      { x: 760, y: 455, w: 100, h: 20, type: 'wood', shape: 'rect' },
      { x: 760, y: 430, w: 60, h: 20, type: 'glass', shape: 'rect' },
      { x: 840, y: 540, w: 20, h: 140, type: 'wood', shape: 'rect' },
      { x: 920, y: 540, w: 20, h: 140, type: 'wood', shape: 'rect' },
      { x: 880, y: 455, w: 100, h: 20, type: 'glass', shape: 'rect' },
      { x: 880, y: 430, w: 60, h: 20, type: 'glass', shape: 'rect' },
      { x: 780, y: 540, w: 20, h: 80, type: 'stone', shape: 'rect' },
      { x: 860, y: 540, w: 20, h: 80, type: 'stone', shape: 'rect' },
      { x: 820, y: 455, w: 100, h: 20, type: 'stone', shape: 'rect' }
    ],
    starScores: [10000, 28000, 50000],
    ground: 570
  },
  {
    episode: 1, level: 9,
    birds: ['chuck','bomb','matilda','hal'],
    pigs: [
      { x: 760, y: 500, type: 'normal', size: 'small' },
      { x: 900, y: 460, type: 'helmet', size: 'medium' },
      { x: 1050, y: 540, type: 'normal', size: 'small' }
    ],
    blocks: [
      { x: 720, y: 540, w: 20, h: 80, type: 'glass', shape: 'rect' },
      { x: 800, y: 540, w: 20, h: 80, type: 'glass', shape: 'rect' },
      { x: 760, y: 495, w: 100, h: 20, type: 'glass', shape: 'rect' },
      { x: 860, y: 540, w: 20, h: 120, type: 'wood', shape: 'rect' },
      { x: 940, y: 540, w: 20, h: 120, type: 'wood', shape: 'rect' },
      { x: 900, y: 475, w: 100, h: 20, type: 'wood', shape: 'rect' },
      { x: 900, y: 450, w: 60, h: 20, type: 'stone', shape: 'rect' },
      { x: 1020, y: 540, w: 20, h: 60, type: 'stone', shape: 'rect' },
      { x: 1080, y: 540, w: 20, h: 60, type: 'stone', shape: 'rect' },
      { x: 1050, y: 505, w: 80, h: 20, type: 'stone', shape: 'rect' }
    ],
    starScores: [12000, 32000, 58000],
    ground: 570
  },
  {
    episode: 1, level: 10,
    birds: ['bomb','matilda','hal','terence'],
    pigs: [
      { x: 760, y: 420, type: 'normal', size: 'small' },
      { x: 900, y: 420, type: 'helmet', size: 'small' },
      { x: 1060, y: 420, type: 'king', size: 'large' }
    ],
    blocks: [
      { x: 720, y: 540, w: 20, h: 160, type: 'stone', shape: 'rect' },
      { x: 800, y: 540, w: 20, h: 160, type: 'stone', shape: 'rect' },
      { x: 760, y: 435, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 760, y: 410, w: 60, h: 20, type: 'glass', shape: 'rect' },
      { x: 860, y: 540, w: 20, h: 160, type: 'stone', shape: 'rect' },
      { x: 940, y: 540, w: 20, h: 160, type: 'stone', shape: 'rect' },
      { x: 900, y: 435, w: 100, h: 20, type: 'wood', shape: 'rect' },
      { x: 900, y: 410, w: 60, h: 20, type: 'glass', shape: 'rect' },
      { x: 1020, y: 540, w: 20, h: 160, type: 'stone', shape: 'rect' },
      { x: 1100, y: 540, w: 20, h: 160, type: 'stone', shape: 'rect' },
      { x: 1060, y: 435, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 1060, y: 410, w: 60, h: 20, type: 'stone', shape: 'rect' },
      { x: 760, y: 540, w: 20, h: 80, type: 'tnt', shape: 'rect' }
    ],
    starScores: [15000, 40000, 70000],
    ground: 570
  },

  // ============ EPISÓDIO 2: MIGHTY HOAX ============
  {
    episode: 2, level: 1,
    birds: ['red','blue','chuck'],
    pigs: [
      { x: 780, y: 510, type: 'normal', size: 'small' },
      { x: 920, y: 510, type: 'normal', size: 'small' }
    ],
    blocks: [
      { x: 740, y: 540, w: 20, h: 60, type: 'wood', shape: 'rect' },
      { x: 820, y: 540, w: 20, h: 60, type: 'wood', shape: 'rect' },
      { x: 780, y: 505, w: 100, h: 20, type: 'glass', shape: 'rect' },
      { x: 880, y: 540, w: 20, h: 60, type: 'wood', shape: 'rect' },
      { x: 960, y: 540, w: 20, h: 60, type: 'wood', shape: 'rect' },
      { x: 920, y: 505, w: 100, h: 20, type: 'glass', shape: 'rect' }
    ],
    starScores: [5000, 15000, 28000],
    ground: 570
  },
  {
    episode: 2, level: 2,
    birds: ['blue','chuck','bomb','bomb'],
    pigs: [
      { x: 760, y: 460, type: 'normal', size: 'medium' },
      { x: 900, y: 540, type: 'helmet', size: 'small' },
      { x: 1050, y: 480, type: 'normal', size: 'small' }
    ],
    blocks: [
      { x: 720, y: 540, w: 20, h: 120, type: 'wood', shape: 'rect' },
      { x: 800, y: 540, w: 20, h: 120, type: 'wood', shape: 'rect' },
      { x: 760, y: 475, w: 100, h: 20, type: 'wood', shape: 'rect' },
      { x: 760, y: 450, w: 60, h: 20, type: 'glass', shape: 'rect' },
      { x: 860, y: 540, w: 20, h: 60, type: 'stone', shape: 'rect' },
      { x: 940, y: 540, w: 20, h: 60, type: 'stone', shape: 'rect' },
      { x: 900, y: 505, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 1010, y: 540, w: 20, h: 100, type: 'wood', shape: 'rect' },
      { x: 1090, y: 540, w: 20, h: 100, type: 'wood', shape: 'rect' },
      { x: 1050, y: 495, w: 100, h: 20, type: 'glass', shape: 'rect' },
      { x: 1050, y: 470, w: 60, h: 20, type: 'glass', shape: 'rect' }
    ],
    starScores: [8000, 22000, 40000],
    ground: 570
  },
  {
    episode: 2, level: 3,
    birds: ['chuck','bomb','matilda','hal'],
    pigs: [
      { x: 760, y: 440, type: 'helmet', size: 'small' },
      { x: 900, y: 480, type: 'normal', size: 'medium' },
      { x: 1060, y: 440, type: 'normal', size: 'small' }
    ],
    blocks: [
      { x: 720, y: 540, w: 20, h: 140, type: 'glass', shape: 'rect' },
      { x: 800, y: 540, w: 20, h: 140, type: 'glass', shape: 'rect' },
      { x: 760, y: 455, w: 100, h: 20, type: 'glass', shape: 'rect' },
      { x: 760, y: 430, w: 60, h: 20, type: 'wood', shape: 'rect' },
      { x: 860, y: 540, w: 20, h: 100, type: 'wood', shape: 'rect' },
      { x: 940, y: 540, w: 20, h: 100, type: 'wood', shape: 'rect' },
      { x: 900, y: 495, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 900, y: 470, w: 60, h: 20, type: 'wood', shape: 'rect' },
      { x: 1020, y: 540, w: 20, h: 140, type: 'stone', shape: 'rect' },
      { x: 1100, y: 540, w: 20, h: 140, type: 'stone', shape: 'rect' },
      { x: 1060, y: 455, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 1060, y: 430, w: 60, h: 20, type: 'glass', shape: 'rect' }
    ],
    starScores: [10000, 28000, 52000],
    ground: 570
  },
  {
    episode: 2, level: 4,
    birds: ['bomb','matilda','hal','terence'],
    pigs: [
      { x: 760, y: 400, type: 'normal', size: 'small' },
      { x: 900, y: 400, type: 'helmet', size: 'medium' },
      { x: 1060, y: 400, type: 'king', size: 'large' },
      { x: 820, y: 540, type: 'normal', size: 'small' }
    ],
    blocks: [
      { x: 720, y: 540, w: 20, h: 180, type: 'stone', shape: 'rect' },
      { x: 800, y: 540, w: 20, h: 180, type: 'stone', shape: 'rect' },
      { x: 760, y: 415, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 760, y: 390, w: 60, h: 20, type: 'glass', shape: 'rect' },
      { x: 860, y: 540, w: 20, h: 180, type: 'stone', shape: 'rect' },
      { x: 940, y: 540, w: 20, h: 180, type: 'stone', shape: 'rect' },
      { x: 900, y: 415, w: 100, h: 20, type: 'wood', shape: 'rect' },
      { x: 900, y: 390, w: 60, h: 20, type: 'glass', shape: 'rect' },
      { x: 1020, y: 540, w: 20, h: 180, type: 'stone', shape: 'rect' },
      { x: 1100, y: 540, w: 20, h: 180, type: 'stone', shape: 'rect' },
      { x: 1060, y: 415, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 1060, y: 390, w: 60, h: 20, type: 'stone', shape: 'rect' },
      { x: 780, y: 540, w: 20, h: 80, type: 'tnt', shape: 'rect' },
      { x: 860, y: 540, w: 20, h: 80, type: 'tnt', shape: 'rect' }
    ],
    starScores: [15000, 42000, 75000],
    ground: 570
  },
  {
    episode: 2, level: 5,
    birds: ['matilda','hal','terence','bubbles'],
    pigs: [
      { x: 760, y: 380, type: 'normal', size: 'small' },
      { x: 900, y: 380, type: 'helmet', size: 'small' },
      { x: 1060, y: 380, type: 'normal', size: 'small' },
      { x: 820, y: 540, type: 'king', size: 'large' }
    ],
    blocks: [
      { x: 720, y: 540, w: 20, h: 200, type: 'stone', shape: 'rect' },
      { x: 800, y: 540, w: 20, h: 200, type: 'stone', shape: 'rect' },
      { x: 760, y: 395, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 760, y: 370, w: 60, h: 20, type: 'stone', shape: 'rect' },
      { x: 860, y: 540, w: 20, h: 200, type: 'stone', shape: 'rect' },
      { x: 940, y: 540, w: 20, h: 200, type: 'stone', shape: 'rect' },
      { x: 900, y: 395, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 900, y: 370, w: 60, h: 20, type: 'glass', shape: 'rect' },
      { x: 1020, y: 540, w: 20, h: 200, type: 'stone', shape: 'rect' },
      { x: 1100, y: 540, w: 20, h: 200, type: 'stone', shape: 'rect' },
      { x: 1060, y: 395, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 1060, y: 370, w: 60, h: 20, type: 'stone', shape: 'rect' },
      { x: 780, y: 540, w: 20, h: 100, type: 'tnt', shape: 'rect' },
      { x: 860, y: 540, w: 20, h: 100, type: 'tnt', shape: 'rect' },
      { x: 940, y: 540, w: 20, h: 100, type: 'tnt', shape: 'rect' }
    ],
    starScores: [18000, 50000, 90000],
    ground: 570
  },

  // ============ EPISÓDIO 3: DANGER ABOVE ============
  {
    episode: 3, level: 1,
    birds: ['red','blue','chuck','bomb'],
    pigs: [
      { x: 760, y: 460, type: 'normal', size: 'small' },
      { x: 900, y: 460, type: 'normal', size: 'small' },
      { x: 1050, y: 540, type: 'helmet', size: 'medium' }
    ],
    blocks: [
      { x: 720, y: 540, w: 20, h: 120, type: 'wood', shape: 'rect' },
      { x: 800, y: 540, w: 20, h: 120, type: 'wood', shape: 'rect' },
      { x: 760, y: 475, w: 100, h: 20, type: 'glass', shape: 'rect' },
      { x: 760, y: 450, w: 60, h: 20, type: 'glass', shape: 'rect' },
      { x: 860, y: 540, w: 20, h: 120, type: 'glass', shape: 'rect' },
      { x: 940, y: 540, w: 20, h: 120, type: 'glass', shape: 'rect' },
      { x: 900, y: 475, w: 100, h: 20, type: 'glass', shape: 'rect' },
      { x: 900, y: 450, w: 60, h: 20, type: 'wood', shape: 'rect' },
      { x: 1010, y: 540, w: 20, h: 60, type: 'stone', shape: 'rect' },
      { x: 1090, y: 540, w: 20, h: 60, type: 'stone', shape: 'rect' },
      { x: 1050, y: 505, w: 100, h: 20, type: 'stone', shape: 'rect' }
    ],
    starScores: [8000, 22000, 42000],
    ground: 570
  },
  {
    episode: 3, level: 2,
    birds: ['chuck','bomb','matilda','hal','terence'],
    pigs: [
      { x: 760, y: 420, type: 'helmet', size: 'small' },
      { x: 900, y: 420, type: 'normal', size: 'medium' },
      { x: 1060, y: 420, type: 'helmet', size: 'small' },
      { x: 830, y: 540, type: 'normal', size: 'small' }
    ],
    blocks: [
      { x: 720, y: 540, w: 20, h: 160, type: 'stone', shape: 'rect' },
      { x: 800, y: 540, w: 20, h: 160, type: 'stone', shape: 'rect' },
      { x: 760, y: 435, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 760, y: 410, w: 60, h: 20, type: 'glass', shape: 'rect' },
      { x: 860, y: 540, w: 20, h: 160, type: 'wood', shape: 'rect' },
      { x: 940, y: 540, w: 20, h: 160, type: 'wood', shape: 'rect' },
      { x: 900, y: 435, w: 100, h: 20, type: 'wood', shape: 'rect' },
      { x: 900, y: 410, w: 60, h: 20, type: 'glass', shape: 'rect' },
      { x: 1020, y: 540, w: 20, h: 160, type: 'stone', shape: 'rect' },
      { x: 1100, y: 540, w: 20, h: 160, type: 'stone', shape: 'rect' },
      { x: 1060, y: 435, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 1060, y: 410, w: 60, h: 20, type: 'stone', shape: 'rect' },
      { x: 800, y: 540, w: 20, h: 80, type: 'tnt', shape: 'rect' }
    ],
    starScores: [12000, 35000, 62000],
    ground: 570
  },
  {
    episode: 3, level: 3,
    birds: ['bomb','matilda','hal','terence','bubbles'],
    pigs: [
      { x: 760, y: 380, type: 'normal', size: 'small' },
      { x: 900, y: 380, type: 'helmet', size: 'medium' },
      { x: 1060, y: 380, type: 'king', size: 'large' },
      { x: 820, y: 540, type: 'normal', size: 'small' },
      { x: 980, y: 540, type: 'normal', size: 'small' }
    ],
    blocks: [
      { x: 720, y: 540, w: 20, h: 200, type: 'stone', shape: 'rect' },
      { x: 800, y: 540, w: 20, h: 200, type: 'stone', shape: 'rect' },
      { x: 760, y: 395, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 760, y: 370, w: 60, h: 20, type: 'glass', shape: 'rect' },
      { x: 860, y: 540, w: 20, h: 200, type: 'stone', shape: 'rect' },
      { x: 940, y: 540, w: 20, h: 200, type: 'stone', shape: 'rect' },
      { x: 900, y: 395, w: 100, h: 20, type: 'wood', shape: 'rect' },
      { x: 900, y: 370, w: 60, h: 20, type: 'glass', shape: 'rect' },
      { x: 1020, y: 540, w: 20, h: 200, type: 'stone', shape: 'rect' },
      { x: 1100, y: 540, w: 20, h: 200, type: 'stone', shape: 'rect' },
      { x: 1060, y: 395, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 1060, y: 370, w: 60, h: 20, type: 'stone', shape: 'rect' },
      { x: 780, y: 540, w: 20, h: 100, type: 'tnt', shape: 'rect' },
      { x: 960, y: 540, w: 20, h: 100, type: 'tnt', shape: 'rect' }
    ],
    starScores: [18000, 50000, 90000],
    ground: 570
  },

  // ============ EPISÓDIO 4: THE BIG SETUP ============
  {
    episode: 4, level: 1,
    birds: ['red','blue','chuck','bomb','matilda'],
    pigs: [
      { x: 760, y: 440, type: 'normal', size: 'small' },
      { x: 900, y: 440, type: 'helmet', size: 'small' },
      { x: 1060, y: 440, type: 'normal', size: 'medium' },
      { x: 820, y: 540, type: 'normal', size: 'small' }
    ],
    blocks: [
      { x: 720, y: 540, w: 20, h: 140, type: 'wood', shape: 'rect' },
      { x: 800, y: 540, w: 20, h: 140, type: 'wood', shape: 'rect' },
      { x: 760, y: 455, w: 100, h: 20, type: 'glass', shape: 'rect' },
      { x: 760, y: 430, w: 60, h: 20, type: 'glass', shape: 'rect' },
      { x: 860, y: 540, w: 20, h: 140, type: 'glass', shape: 'rect' },
      { x: 940, y: 540, w: 20, h: 140, type: 'glass', shape: 'rect' },
      { x: 900, y: 455, w: 100, h: 20, type: 'glass', shape: 'rect' },
      { x: 900, y: 430, w: 60, h: 20, type: 'wood', shape: 'rect' },
      { x: 1020, y: 540, w: 20, h: 140, type: 'stone', shape: 'rect' },
      { x: 1100, y: 540, w: 20, h: 140, type: 'stone', shape: 'rect' },
      { x: 1060, y: 455, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 1060, y: 430, w: 60, h: 20, type: 'glass', shape: 'rect' },
      { x: 780, y: 540, w: 20, h: 80, type: 'tnt', shape: 'rect' }
    ],
    starScores: [12000, 35000, 65000],
    ground: 570
  },
  {
    episode: 4, level: 2,
    birds: ['chuck','bomb','matilda','hal','terence','bubbles'],
    pigs: [
      { x: 760, y: 400, type: 'helmet', size: 'medium' },
      { x: 900, y: 400, type: 'helmet', size: 'medium' },
      { x: 1060, y: 400, type: 'helmet', size: 'medium' },
      { x: 820, y: 540, type: 'king', size: 'large' },
      { x: 980, y: 540, type: 'normal', size: 'small' }
    ],
    blocks: [
      { x: 720, y: 540, w: 20, h: 180, type: 'stone', shape: 'rect' },
      { x: 800, y: 540, w: 20, h: 180, type: 'stone', shape: 'rect' },
      { x: 760, y: 415, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 760, y: 390, w: 60, h: 20, type: 'stone', shape: 'rect' },
      { x: 860, y: 540, w: 20, h: 180, type: 'stone', shape: 'rect' },
      { x: 940, y: 540, w: 20, h: 180, type: 'stone', shape: 'rect' },
      { x: 900, y: 415, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 900, y: 390, w: 60, h: 20, type: 'stone', shape: 'rect' },
      { x: 1020, y: 540, w: 20, h: 180, type: 'stone', shape: 'rect' },
      { x: 1100, y: 540, w: 20, h: 180, type: 'stone', shape: 'rect' },
      { x: 1060, y: 415, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 1060, y: 390, w: 60, h: 20, type: 'stone', shape: 'rect' },
      { x: 780, y: 540, w: 20, h: 100, type: 'tnt', shape: 'rect' },
      { x: 860, y: 540, w: 20, h: 100, type: 'tnt', shape: 'rect' },
      { x: 940, y: 540, w: 20, h: 100, type: 'tnt', shape: 'rect' }
    ],
    starScores: [20000, 55000, 100000],
    ground: 570
  },

  // ============ EPISÓDIO 5: HAM 'EM HIGH ============
  {
    episode: 5, level: 1,
    birds: ['red','blue','chuck','bomb','matilda','hal','terence'],
    pigs: [
      { x: 760, y: 360, type: 'normal', size: 'small' },
      { x: 900, y: 360, type: 'helmet', size: 'medium' },
      { x: 1060, y: 360, type: 'king', size: 'large' },
      { x: 820, y: 540, type: 'normal', size: 'small' },
      { x: 980, y: 540, type: 'helmet', size: 'small' }
    ],
    blocks: [
      { x: 720, y: 540, w: 20, h: 220, type: 'stone', shape: 'rect' },
      { x: 800, y: 540, w: 20, h: 220, type: 'stone', shape: 'rect' },
      { x: 760, y: 375, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 760, y: 350, w: 60, h: 20, type: 'glass', shape: 'rect' },
      { x: 860, y: 540, w: 20, h: 220, type: 'stone', shape: 'rect' },
      { x: 940, y: 540, w: 20, h: 220, type: 'stone', shape: 'rect' },
      { x: 900, y: 375, w: 100, h: 20, type: 'wood', shape: 'rect' },
      { x: 900, y: 350, w: 60, h: 20, type: 'glass', shape: 'rect' },
      { x: 1020, y: 540, w: 20, h: 220, type: 'stone', shape: 'rect' },
      { x: 1100, y: 540, w: 20, h: 220, type: 'stone', shape: 'rect' },
      { x: 1060, y: 375, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 1060, y: 350, w: 60, h: 20, type: 'stone', shape: 'rect' },
      { x: 780, y: 540, w: 20, h: 110, type: 'tnt', shape: 'rect' },
      { x: 860, y: 540, w: 20, h: 110, type: 'tnt', shape: 'rect' },
      { x: 940, y: 540, w: 20, h: 110, type: 'tnt', shape: 'rect' }
    ],
    starScores: [25000, 65000, 120000],
    ground: 570
  },
  {
    episode: 5, level: 2,
    birds: ['blue','chuck','bomb','matilda','hal','terence','bubbles'],
    pigs: [
      { x: 760, y: 340, type: 'helmet', size: 'medium' },
      { x: 900, y: 340, type: 'helmet', size: 'medium' },
      { x: 1060, y: 340, type: 'king', size: 'large' },
      { x: 820, y: 540, type: 'normal', size: 'small' },
      { x: 980, y: 540, type: 'normal', size: 'small' },
      { x: 1140, y: 540, type: 'helmet', size: 'small' }
    ],
    blocks: [
      { x: 720, y: 540, w: 20, h: 240, type: 'stone', shape: 'rect' },
      { x: 800, y: 540, w: 20, h: 240, type: 'stone', shape: 'rect' },
      { x: 760, y: 355, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 760, y: 330, w: 60, h: 20, type: 'stone', shape: 'rect' },
      { x: 860, y: 540, w: 20, h: 240, type: 'stone', shape: 'rect' },
      { x: 940, y: 540, w: 20, h: 240, type: 'stone', shape: 'rect' },
      { x: 900, y: 355, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 900, y: 330, w: 60, h: 20, type: 'stone', shape: 'rect' },
      { x: 1020, y: 540, w: 20, h: 240, type: 'stone', shape: 'rect' },
      { x: 1100, y: 540, w: 20, h: 240, type: 'stone', shape: 'rect' },
      { x: 1060, y: 355, w: 100, h: 20, type: 'stone', shape: 'rect' },
      { x: 1060, y: 330, w: 60, h: 20, type: 'stone', shape: 'rect' },
      { x: 1110, y: 540, w: 20, h: 60, type: 'wood', shape: 'rect' },
      { x: 1170, y: 540, w: 20, h: 60, type: 'wood', shape: 'rect' },
      { x: 1140, y: 505, w: 80, h: 20, type: 'wood', shape: 'rect' },
      { x: 780, y: 540, w: 20, h: 120, type: 'tnt', shape: 'rect' },
      { x: 860, y: 540, w: 20, h: 120, type: 'tnt', shape: 'rect' },
      { x: 940, y: 540, w: 20, h: 120, type: 'tnt', shape: 'rect' },
      { x: 1020, y: 540, w: 20, h: 120, type: 'tnt', shape: 'rect' }
    ],
    starScores: [30000, 80000, 150000],
    ground: 570
  }
];

// Função para obter fases de um episódio
function getLevelsByEpisode(episodeId) {
  return LEVELS.filter(l => l.episode === episodeId);
}

// Função para obter uma fase específica
function getLevel(episodeId, levelIndex) {
  const epLevels = getLevelsByEpisode(episodeId);
  return epLevels[levelIndex] || null;
}
