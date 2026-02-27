// ============================================================
// GAME.JS — Motor principal do Angry Birds Clone
// Usa Matter.js para física 2D realista
// ============================================================
'use strict';

// ─── CONSTANTES GLOBAIS ─────────────────────────────────────
const CANVAS_W = 1280;
const CANVAS_H = 640;
const GROUND_Y = 570;
const SLING_X  = 160;
const SLING_Y  = 440;
const SLING_PIVOT_X = 175;
const SLING_PIVOT_Y = 410;
const SLING_LEFT_X  = 165;
const SLING_LEFT_Y  = 380;
const SLING_RIGHT_X = 195;
const SLING_RIGHT_Y = 380;
const LAUNCH_POWER  = 0.030;
const MAX_DRAG      = 85;

// Propriedades físicas por material
const MATERIAL_PROPS = {
  wood:  { density:0.002, friction:0.5, restitution:0.2, hp:100, color:'#8B6914', strokeColor:'#5C4008', scorePerHp:0.5 },
  glass: { density:0.001, friction:0.1, restitution:0.4, hp:40,  color:'#A8D8EA', strokeColor:'#5BA4CF', scorePerHp:1.0 },
  stone: { density:0.005, friction:0.8, restitution:0.1, hp:400, color:'#9E9E9E', strokeColor:'#616161', scorePerHp:0.3 },
  tnt:   { density:0.003, friction:0.5, restitution:0.1, hp:60,  color:'#FF5722', strokeColor:'#BF360C', scorePerHp:2.0 },
  ice:   { density:0.001, friction:0.05,restitution:0.5, hp:30,  color:'#B3E5FC', strokeColor:'#0288D1', scorePerHp:1.2 }
};

// Propriedades dos pássaros
const BIRD_PROPS = {
  red:     { radius:18, density:0.004, color:'#E53935', strokeColor:'#B71C1C', label:'Red',     ability:'shockwave' },
  blue:    { radius:13, density:0.002, color:'#1E88E5', strokeColor:'#0D47A1', label:'Blue',    ability:'split'     },
  chuck:   { radius:16, density:0.003, color:'#FDD835', strokeColor:'#F57F17', label:'Chuck',   ability:'turbo'     },
  bomb:    { radius:20, density:0.006, color:'#212121', strokeColor:'#000000', label:'Bomb',    ability:'explode'   },
  matilda: { radius:17, density:0.003, color:'#F5F5F5', strokeColor:'#9E9E9E', label:'Matilda', ability:'egg'       },
  hal:     { radius:18, density:0.004, color:'#43A047', strokeColor:'#1B5E20', label:'Hal',     ability:'boomerang' },
  terence: { radius:28, density:0.010, color:'#C62828', strokeColor:'#7F0000', label:'Terence', ability:'none'      },
  bubbles: { radius:15, density:0.002, color:'#FF8F00', strokeColor:'#E65100', label:'Bubbles', ability:'inflate'   }
};

// Propriedades dos porcos
const PIG_PROPS = {
  normal: { hp:60,  radius:18, color:'#66BB6A', strokeColor:'#2E7D32' },
  helmet: { hp:150, radius:20, color:'#66BB6A', strokeColor:'#2E7D32' },
  king:   { hp:300, radius:26, color:'#66BB6A', strokeColor:'#2E7D32' }
};
const PIG_SIZE_MULT = { small:0.8, medium:1.0, large:1.3 };

// ─── ESTADO DO JOGO ─────────────────────────────────────────
let gameState = 'menu';
let currentEpisode = 1;
let currentLevelIndex = 0;
let score = 0;
let highScores = {};
let starsData = {};
let unlockedEpisodes = [1];
let unlockedLevels = {1:[0], 2:[], 3:[], 4:[], 5:[]};
let soundEnabled = true;

// ─── VARIÁVEIS DE JOGO ───────────────────────────────────────
let engine, world;
let birds = [];
let pigs = [];
let blocks = [];
let birdQueue = [];
let activeBird = null;
let isDragging = false;
let dragCurrent = { x: SLING_PIVOT_X, y: SLING_PIVOT_Y };
let launched = false;
let abilityUsed = false;
let trajectoryPoints = [];
let particles = [];
let explosionEffects = [];
let scorePopups = [];
let levelData = null;
let cameraX = 0;
let targetCameraX = 0;
let levelComplete = false;
let levelFail = false;
let resultTimer = 0;
let settleTimer = 0;
let stars_earned = 0;
let animFrame = 0;
let bgClouds = [];
let bgMountains = [];
let nextBirdTimer = -1;
let splitBodies = [];

// ─── CANVAS E CONTEXTO ───────────────────────────────────────
let canvas, ctx;

// ─── ÁUDIO ───────────────────────────────────────────────────
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
  }
}

function playTone(freq, dur, type='sine', vol=0.3) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = type;
    o.frequency.setValueAtTime(freq, audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(freq*0.4, audioCtx.currentTime + dur);
    g.gain.setValueAtTime(vol, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    o.start(); o.stop(audioCtx.currentTime + dur);
  } catch(e) {}
}

function sndSling()     { playTone(280, 0.12, 'sawtooth', 0.18); }
function sndLaunch()    { playTone(480, 0.18, 'square', 0.22); }
function sndHit(v)      { playTone(80+v*180, 0.25, 'sawtooth', Math.min(0.35, v*0.45)); }
function sndPigHit()    { playTone(380, 0.18, 'square', 0.28); }
function sndPigDie()    { playTone(180, 0.35, 'sawtooth', 0.38); }
function sndExplode()   { playTone(75, 0.7, 'sawtooth', 0.45); setTimeout(()=>playTone(55,0.5,'sawtooth',0.28),90); }
function sndVictory()   { [523,659,784,1047].forEach((f,i)=>setTimeout(()=>playTone(f,0.28,'sine',0.38),i*140)); }
function sndFail()      { [380,280,180,120].forEach((f,i)=>setTimeout(()=>playTone(f,0.28,'sawtooth',0.28),i*140)); }
function sndAbility(t)  {
  ({shockwave:()=>playTone(580,0.18,'square',0.28),
    split:    ()=>playTone(760,0.14,'sine',0.28),
    turbo:    ()=>playTone(980,0.09,'sawtooth',0.22),
    explode:  ()=>sndExplode(),
    egg:      ()=>playTone(680,0.14,'sine',0.28),
    boomerang:()=>playTone(480,0.18,'square',0.22),
    inflate:  ()=>playTone(280,0.28,'sine',0.28)
  }[t] || (()=>{}))();
}

// ─── INICIALIZAÇÃO ───────────────────────────────────────────
function init() {
  canvas = document.getElementById('gameCanvas');
  ctx    = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  canvas.addEventListener('mousedown',  onMouseDown);
  canvas.addEventListener('mousemove',  onMouseMove);
  canvas.addEventListener('mouseup',    onMouseUp);
  canvas.addEventListener('click',      onCanvasClick);
  canvas.addEventListener('touchstart', onTouchStart, {passive:false});
  canvas.addEventListener('touchmove',  onTouchMove,  {passive:false});
  canvas.addEventListener('touchend',   onTouchEnd,   {passive:false});

  loadProgress();
  generateBackground();
  requestAnimationFrame(gameLoop);
}

function resizeCanvas() {
  const ratio = CANVAS_W / CANVAS_H;
  let w = window.innerWidth, h = window.innerWidth / ratio;
  if (h > window.innerHeight) { h = window.innerHeight; w = h * ratio; }
  canvas.style.width  = w + 'px';
  canvas.style.height = h + 'px';
  canvas.style.left   = ((window.innerWidth  - w) / 2) + 'px';
  canvas.style.top    = ((window.innerHeight - h) / 2) + 'px';
}

function generateBackground() {
  bgClouds = [];
  for (let i = 0; i < 14; i++) {
    bgClouds.push({ x:Math.random()*3200, y:25+Math.random()*160, w:70+Math.random()*130, h:35+Math.random()*55, speed:0.08+Math.random()*0.18 });
  }
  bgMountains = [];
  for (let i = 0; i < 10; i++) {
    bgMountains.push({ x:i*380+Math.random()*180, h:90+Math.random()*160, w:180+Math.random()*220 });
  }
}

// ─── LOOP PRINCIPAL ──────────────────────────────────────────
let lastTime = 0;
function gameLoop(ts) {
  const dt = Math.min((ts - lastTime) / 1000, 0.05);
  lastTime = ts;
  animFrame++;
  update(dt);
  draw();
  requestAnimationFrame(gameLoop);
}

function update(dt) {
  bgClouds.forEach(c => { c.x -= c.speed; if (c.x < -300) c.x = 3400; });
  updateParticles(dt);
  updateScorePopups(dt);
  updateExplosions(dt);
  if (gameState === 'playing') updatePlaying(dt);
}

function updateParticles(dt) {
  for (let i = particles.length-1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * dt * 60; p.y += p.vy * dt * 60; p.vy += 0.28;
    p.life -= dt; p.alpha = Math.max(0, p.life / p.maxLife);
    if (p.isConfetti && p.rotSpeed) p.rotation += p.rotSpeed;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function updateScorePopups(dt) {
  for (let i = scorePopups.length-1; i >= 0; i--) {
    const p = scorePopups[i]; p.y -= 0.8; p.life -= dt;
    p.alpha = Math.max(0, p.life / p.maxLife);
    if (p.life <= 0) scorePopups.splice(i, 1);
  }
}

function updateExplosions(dt) {
  for (let i = explosionEffects.length-1; i >= 0; i--) {
    const e = explosionEffects[i]; e.life -= dt; e.radius += dt*180; e.alpha = Math.max(0, e.life/e.maxLife);
    if (e.life <= 0) explosionEffects.splice(i, 1);
  }
}

// ─── LÓGICA DO JOGO ─────────────────────────────────────────
function updatePlaying(dt) {
  if (!engine) return;
  Matter.Engine.update(engine, dt * 1000);

  // Câmera
  if (activeBird && launched) {
    const bx = activeBird.body.position.x;
    targetCameraX = Math.max(0, bx - CANVAS_W * 0.32);
  }
  cameraX += (targetCameraX - cameraX) * 0.07;

  // Pássaro ativo
  if (activeBird && launched) {
    const pos = activeBird.body.position;
    const vel = activeBird.body.velocity;
    const spd = Math.hypot(vel.x, vel.y);

    if (pos.x > 2200 || pos.y > CANVAS_H + 120 || pos.x < -300) {
      scheduleNextBird();
    } else if (spd < 0.6 && pos.y > GROUND_Y - 60) {
      settleTimer += dt;
      if (settleTimer > 1.8) scheduleNextBird();
    } else {
      settleTimer = 0;
    }

    // Trajetória
    if (animFrame % 3 === 0) {
      trajectoryPoints.push({ x: pos.x, y: pos.y });
      if (trajectoryPoints.length > 35) trajectoryPoints.shift();
    }
  }

  // Próximo pássaro agendado
  if (nextBirdTimer > 0) {
    nextBirdTimer -= dt;
    if (nextBirdTimer <= 0) {
      nextBirdTimer = -1;
      doSpawnNextBird();
    }
  }

  // Dano por posição (porcos caindo)
  pigs.forEach(pig => {
    if (pig.hitTimer > 0) pig.hitTimer -= dt;
    if (pig.hitTimer <= 0 && pig.expression !== 'happy') {
      pig.expression = pig.hp < pig.maxHp * 0.5 ? 'scared' : 'happy';
    }
  });
  blocks.forEach(b => { if (b.hitTimer > 0) b.hitTimer -= dt; });

  // Remove mortos
  for (let i = pigs.length-1; i >= 0; i--) {
    if (pigs[i].hp <= 0 && !pigs[i].dead) {
      const pig = pigs[i]; pig.dead = true;
      spawnParticles(pig.body.position.x, pig.body.position.y, '#66BB6A', 14);
      addScorePopup(pig.body.position.x, pig.body.position.y, pig.scoreValue);
      score += pig.scoreValue; sndPigDie();
      Matter.World.remove(world, pig.body);
      pigs.splice(i, 1);
    }
  }
  for (let i = blocks.length-1; i >= 0; i--) {
    if (blocks[i].hp <= 0 && !blocks[i].dead) {
      const b = blocks[i]; b.dead = true;
      spawnParticles(b.body.position.x, b.body.position.y, MATERIAL_PROPS[b.type].color, 8);
      const sc = Math.floor(MATERIAL_PROPS[b.type].hp * MATERIAL_PROPS[b.type].scorePerHp);
      addScorePopup(b.body.position.x, b.body.position.y, sc);
      score += sc;
      Matter.World.remove(world, b.body);
      blocks.splice(i, 1);
    }
  }

  // Vitória / derrota
  checkWinLose(dt);
}

function checkWinLose(dt) {
  if (levelComplete || levelFail) {
    resultTimer += dt;
    if (resultTimer > 2.2) {
      gameState = levelComplete ? 'levelComplete' : 'levelFail';
    }
    return;
  }

  if (pigs.length === 0) {
    levelComplete = true; resultTimer = 0;
    const rem = birdQueue.length + (activeBird && !launched ? 1 : 0);
    score += rem * 10000;
    calculateStars(); saveProgress(); sndVictory(); spawnConfetti();
  } else if (birdQueue.length === 0 && nextBirdTimer < 0 && (!activeBird || (launched && !activeBird))) {
    levelFail = true; resultTimer = 0; sndFail();
  }
}

function calculateStars() {
  if (!levelData) return;
  stars_earned = score >= levelData.starScores[2] ? 3 : score >= levelData.starScores[1] ? 2 : 1;
  const key = `${currentEpisode}_${currentLevelIndex}`;
  if (!starsData[key] || starsData[key] < stars_earned) starsData[key] = stars_earned;
  if (!highScores[key] || highScores[key] < score) highScores[key] = score;
}

// ─── CARREGAMENTO DE FASE ────────────────────────────────────
function loadLevel(epId, lvIdx) {
  currentEpisode = epId; currentLevelIndex = lvIdx;
  const epLevels = getLevelsByEpisode(epId);
  levelData = epLevels[lvIdx];
  if (!levelData) return;

  score = 0; levelComplete = false; levelFail = false; resultTimer = 0;
  cameraX = 0; targetCameraX = 0; trajectoryPoints = [];
  particles = []; explosionEffects = []; scorePopups = [];
  stars_earned = 0; settleTimer = 0; nextBirdTimer = -1; splitBodies = [];

  if (engine) { Matter.World.clear(world); Matter.Engine.clear(engine); }

  engine = Matter.Engine.create({ gravity:{ x:0, y:1.2 } });
  world  = engine.world;
  Matter.Events.on(engine, 'collisionStart', onCollision);

  // Chão
  const ground = Matter.Bodies.rectangle(1500, GROUND_Y+25, 3000, 50, {
    isStatic:true, label:'ground', friction:0.8, restitution:0.1,
    collisionFilter:{ category:0x0002, mask:0xFFFF }
  });
  Matter.World.add(world, ground);

  // Blocos
  blocks = [];
  levelData.blocks.forEach(bd => {
    const mp = MATERIAL_PROPS[bd.type] || MATERIAL_PROPS.wood;
    const body = Matter.Bodies.rectangle(bd.x, bd.y, bd.w, bd.h, {
      density:mp.density, friction:mp.friction, restitution:mp.restitution,
      label:'block_'+bd.type, frictionAir:0.01,
      collisionFilter:{ category:0x0002, mask:0xFFFF }
    });
    body.gameRef = { type:'block', idx:blocks.length };
    Matter.World.add(world, body);
    blocks.push({ body, type:bd.type, hp:mp.hp, maxHp:mp.hp, w:bd.w, h:bd.h, dead:false, hitTimer:0 });
  });

  // Porcos
  pigs = [];
  levelData.pigs.forEach(pd => {
    const pt = PIG_PROPS[pd.type] || PIG_PROPS.normal;
    const sm = PIG_SIZE_MULT[pd.size] || 1.0;
    const r  = pt.radius * sm;
    const body = Matter.Bodies.circle(pd.x, pd.y, r, {
      density:0.003, friction:0.5, restitution:0.2,
      label:'pig_'+pd.type, frictionAir:0.01,
      collisionFilter:{ category:0x0002, mask:0xFFFF }
    });
    body.gameRef = { type:'pig', idx:pigs.length };
    Matter.World.add(world, body);
    pigs.push({
      body, type:pd.type, size:pd.size, hp:pt.hp*sm, maxHp:pt.hp*sm,
      radius:r, dead:false, expression:'happy', hitTimer:0,
      scoreValue: pd.type==='king'?3000 : pd.type==='helmet'?1500 : 500
    });
  });

  // Pássaros
  birdQueue = [...levelData.birds];
  birds = []; activeBird = null; launched = false; abilityUsed = false;
  doSpawnNextBird();
  gameState = 'playing';
}

function doSpawnNextBird() {
  if (birdQueue.length === 0) { activeBird = null; return; }
  const type  = birdQueue.shift();
  const props = BIRD_PROPS[type] || BIRD_PROPS.red;
  const body  = Matter.Bodies.circle(SLING_PIVOT_X, SLING_PIVOT_Y, props.radius, {
    density:props.density, friction:0.3, restitution:0.3,
    label:'bird_'+type, frictionAir:0.005, isStatic:true,
    collisionFilter:{ category:0x0001, mask:0x0002 }
  });
  Matter.World.add(world, body);
  activeBird = { body, type, props, launched:false, abilityUsed:false, inflated:false };
  launched = false; abilityUsed = false; isDragging = false;
  dragCurrent = { x:SLING_PIVOT_X, y:SLING_PIVOT_Y };
  trajectoryPoints = []; settleTimer = 0; splitBodies = [];
}

function scheduleNextBird() {
  if (nextBirdTimer > 0) return;
  if (activeBird) {
    Matter.World.remove(world, activeBird.body);
    // Remove split bodies
    splitBodies.forEach(b => { try { Matter.World.remove(world, b); } catch(e){} });
    splitBodies = [];
    activeBird = null;
  }
  launched = false; abilityUsed = false; trajectoryPoints = [];
  cameraX = 0; targetCameraX = 0;
  if (birdQueue.length > 0) nextBirdTimer = 1.2;
}

// ─── COLISÕES ────────────────────────────────────────────────
function onCollision(event) {
  event.pairs.forEach(pair => {
    const { bodyA, bodyB } = pair;
    const vel = {
      x: (bodyA.velocity.x - bodyB.velocity.x),
      y: (bodyA.velocity.y - bodyB.velocity.y)
    };
    const speed = Math.hypot(vel.x, vel.y);
    if (speed < 1.5) return;

    const intensity = Math.min(speed / 18, 1);
    sndHit(intensity);

    const isBirdA = activeBird && bodyA === activeBird.body;
    const isBirdB = activeBird && bodyB === activeBird.body;
    const isSplitA = splitBodies.includes(bodyA);
    const isSplitB = splitBodies.includes(bodyB);
    const isBird = isBirdA || isBirdB || isSplitA || isSplitB;

    const birdMultiplier = isBird ? 2.0 : 1.0;

    // Dano em blocos
    [bodyA, bodyB].forEach(body => {
      if (!body.label) return;
      if (body.label.startsWith('block_')) {
        const block = blocks.find(b => b.body === body);
        if (block && !block.dead) {
          const dmg = speed * 7 * birdMultiplier * (body.label.includes('glass') ? 1.8 : 1);
          block.hp -= dmg; block.hitTimer = 0.3;
          if (block.type === 'tnt' && block.hp < block.maxHp * 0.45) triggerTNT(block);
        }
      }
      if (body.label.startsWith('pig_')) {
        const pig = pigs.find(p => p.body === body);
        if (pig && !pig.dead) {
          const dmg = speed * 5.5 * birdMultiplier;
          pig.hp -= dmg; pig.hitTimer = 0.45;
          pig.expression = pig.hp < pig.maxHp*0.5 ? 'scared' : 'hurt';
          if (dmg > 4) sndPigHit();
        }
      }
    });
  });
}

function triggerTNT(block) {
  if (block.dead) return;
  block.dead = true;
  const pos = block.body.position;
  createExplosion(pos.x, pos.y, 130, 900);
  Matter.World.remove(world, block.body);
  blocks = blocks.filter(b => b !== block);
}

function createExplosion(x, y, radius, damage) {
  explosionEffects.push({ x, y, radius:12, maxRadius:radius, life:0.55, maxLife:0.55, alpha:1 });
  spawnParticles(x, y, '#FF5722', 22);
  sndExplode();

  Matter.Composite.allBodies(world).forEach(body => {
    if (body.isStatic) return;
    const dx = body.position.x - x, dy = body.position.y - y;
    const dist = Math.hypot(dx, dy);
    if (dist < radius && dist > 0) {
      const f = (1 - dist/radius) * damage * 0.00009;
      Matter.Body.applyForce(body, body.position, { x:(dx/dist)*f, y:(dy/dist)*f - f*0.25 });
      if (body.label && body.label.startsWith('block_')) {
        const b = blocks.find(bl => bl.body === body);
        if (b && !b.dead) b.hp -= damage * 0.6 * (1 - dist/radius);
      }
      if (body.label && body.label.startsWith('pig_')) {
        const p = pigs.find(pg => pg.body === body);
        if (p && !p.dead) { p.hp -= damage * 0.45 * (1 - dist/radius); p.expression = 'scared'; }
      }
    }
  });
}

// ─── HABILIDADES ─────────────────────────────────────────────
function activateAbility() {
  if (!activeBird || !launched || abilityUsed) return;
  abilityUsed = true; activeBird.abilityUsed = true;
  sndAbility(activeBird.props.ability);
  switch (activeBird.type) {
    case 'red':     abilityShockwave(); break;
    case 'blue':    abilitySplit();     break;
    case 'chuck':   abilityTurbo();     break;
    case 'bomb':    abilityExplode();   break;
    case 'matilda': abilityEgg();       break;
    case 'hal':     abilityBoomerang(); break;
    case 'bubbles': abilityInflate();   break;
  }
}

function abilityShockwave() {
  const pos = activeBird.body.position;
  createExplosion(pos.x, pos.y, 90, 350);
}

function abilitySplit() {
  if (!activeBird) return;
  const pos = activeBird.body.position;
  const vel = activeBird.body.velocity;
  Matter.World.remove(world, activeBird.body);

  const offs = [{x:0,y:-18},{x:-12,y:12},{x:12,y:12}];
  const newBodies = offs.map((off, i) => {
    const props = BIRD_PROPS.blue;
    const b = Matter.Bodies.circle(pos.x+off.x, pos.y+off.y, props.radius*0.82, {
      density:props.density*0.65, friction:0.3, restitution:0.3,
      label:'bird_blue_split', frictionAir:0.005,
      collisionFilter:{ category:0x0001, mask:0x0002 }
    });
    Matter.World.add(world, b);
    Matter.Body.setVelocity(b, { x:vel.x+off.x*0.28, y:vel.y+off.y*0.28 });
    return b;
  });

  activeBird.body = newBodies[0];
  splitBodies = newBodies.slice(1);
}

function abilityTurbo() {
  if (!activeBird) return;
  const vel = activeBird.body.velocity;
  const spd = Math.hypot(vel.x, vel.y) || 1;
  Matter.Body.setVelocity(activeBird.body, { x:(vel.x/spd)*spd*3.8, y:(vel.y/spd)*spd*3.8*0.45 });
  spawnParticles(activeBird.body.position.x, activeBird.body.position.y, '#FDD835', 12);
}

function abilityExplode() {
  if (!activeBird) return;
  const pos = activeBird.body.position;
  createExplosion(pos.x, pos.y, 160, 1400);
  const bRef = activeBird;
  setTimeout(() => {
    try { Matter.World.remove(world, bRef.body); } catch(e) {}
    if (activeBird === bRef) { activeBird = null; scheduleNextBird(); }
  }, 180);
}

function abilityEgg() {
  if (!activeBird) return;
  const pos = activeBird.body.position;
  const vel = activeBird.body.velocity;

  const egg = Matter.Bodies.circle(pos.x, pos.y+22, 10, {
    density:0.003, friction:0.3, restitution:0.1, label:'egg', frictionAir:0.01,
    collisionFilter:{ category:0x0001, mask:0x0002 }
  });
  Matter.World.add(world, egg);
  Matter.Body.setVelocity(egg, { x:vel.x*0.28, y:5.5 });

  // Pássaro sobe
  Matter.Body.setVelocity(activeBird.body, { x:vel.x*0.45, y:-Math.abs(vel.y)*1.6 });

  let eggDone = false;
  const eggHandler = (ev) => {
    if (eggDone) return;
    ev.pairs.forEach(pair => {
      if (pair.bodyA === egg || pair.bodyB === egg) {
        eggDone = true;
        createExplosion(egg.position.x, egg.position.y, 110, 700);
        try { Matter.World.remove(world, egg); } catch(e) {}
        Matter.Events.off(engine, 'collisionStart', eggHandler);
      }
    });
  };
  Matter.Events.on(engine, 'collisionStart', eggHandler);
}

function abilityBoomerang() {
  if (!activeBird) return;
  const vel = activeBird.body.velocity;
  Matter.Body.setVelocity(activeBird.body, { x:-Math.abs(vel.x)*2.0, y:vel.y*0.4 });
  spawnParticles(activeBird.body.position.x, activeBird.body.position.y, '#43A047', 12);
}

function abilityInflate() {
  if (!activeBird) return;
  activeBird.inflated = true;
  const pos = activeBird.body.position;
  createExplosion(pos.x, pos.y, 110, 500);
  spawnParticles(pos.x, pos.y, '#FF8F00', 16);
}

// ─── PARTÍCULAS ──────────────────────────────────────────────
function spawnParticles(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    const a = Math.random()*Math.PI*2, s = 1.2+Math.random()*4.5;
    particles.push({ x, y, vx:Math.cos(a)*s, vy:Math.sin(a)*s-1.8, color,
      size:2.5+Math.random()*5, life:0.45+Math.random()*0.55, maxLife:1, alpha:1 });
  }
}

function spawnConfetti() {
  const cols = ['#FF5722','#FDD835','#4CAF50','#2196F3','#9C27B0','#FF9800','#E91E63'];
  for (let i = 0; i < 90; i++) {
    particles.push({
      x:Math.random()*CANVAS_W, y:-20,
      vx:(Math.random()-0.5)*4.5, vy:2.2+Math.random()*4.5,
      color:cols[Math.floor(Math.random()*cols.length)],
      size:5+Math.random()*9, life:2.2+Math.random()*2.2, maxLife:4.4, alpha:1,
      isConfetti:true, rotation:Math.random()*Math.PI*2, rotSpeed:(Math.random()-0.5)*0.22
    });
  }
}

function addScorePopup(x, y, value) {
  scorePopups.push({ x:x-cameraX, y, text:'+'+value, life:1.6, maxLife:1.6, alpha:1 });
}

// ─── CONTROLES ───────────────────────────────────────────────
function getCanvasPos(cx, cy) {
  const r = canvas.getBoundingClientRect();
  return { x:(cx-r.left)*(CANVAS_W/r.width), y:(cy-r.top)*(CANVAS_H/r.height) };
}

function onMouseDown(e)  { if (gameState==='playing') handleDown(getCanvasPos(e.clientX,e.clientY)); }
function onMouseMove(e)  { if (gameState==='playing') handleMove(getCanvasPos(e.clientX,e.clientY)); }
function onMouseUp(e)    { if (gameState==='playing') handleUp(); }
function onTouchStart(e) { e.preventDefault(); if (gameState==='playing') handleDown(getCanvasPos(e.touches[0].clientX,e.touches[0].clientY)); }
function onTouchMove(e)  { e.preventDefault(); if (gameState==='playing') handleMove(getCanvasPos(e.touches[0].clientX,e.touches[0].clientY)); }
function onTouchEnd(e)   { e.preventDefault(); if (gameState==='playing') handleUp(); }

function handleDown(pos) {
  if (!activeBird || launched) {
    if (activeBird && launched && !abilityUsed) activateAbility();
    return;
  }
  const dist = Math.hypot(pos.x - SLING_PIVOT_X, pos.y - SLING_PIVOT_Y);
  if (dist < 55) { isDragging = true; dragCurrent = { x:pos.x, y:pos.y }; sndSling(); }
}

function handleMove(pos) {
  if (!isDragging || !activeBird || launched) return;
  let dx = pos.x - SLING_PIVOT_X, dy = pos.y - SLING_PIVOT_Y;
  const dist = Math.hypot(dx, dy);
  if (dist > MAX_DRAG) { dx = (dx/dist)*MAX_DRAG; dy = (dy/dist)*MAX_DRAG; }
  dragCurrent = { x:SLING_PIVOT_X+dx, y:SLING_PIVOT_Y+dy };
  Matter.Body.setPosition(activeBird.body, { x:dragCurrent.x, y:dragCurrent.y });
}

function handleUp() {
  if (!isDragging || !activeBird || launched) { isDragging = false; return; }
  isDragging = false;
  const dx = SLING_PIVOT_X - dragCurrent.x;
  const dy = SLING_PIVOT_Y - dragCurrent.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 12) {
    Matter.Body.setPosition(activeBird.body, { x:SLING_PIVOT_X, y:SLING_PIVOT_Y });
    dragCurrent = { x:SLING_PIVOT_X, y:SLING_PIVOT_Y };
    return;
  }
  Matter.Body.setStatic(activeBird.body, false);
  activeBird.body.collisionFilter = { category:0x0001, mask:0xFFFF };
  const power = dist * LAUNCH_POWER;
  Matter.Body.setVelocity(activeBird.body, { x:dx*power, y:dy*power });
  launched = true; activeBird.launched = true;
  sndLaunch();
}

function onCanvasClick(e) {
  initAudio();
  const pos = getCanvasPos(e.clientX, e.clientY);
  if (gameState === 'playing') {
    if (activeBird && launched && !abilityUsed) activateAbility();
    else handleUIClick(pos.x, pos.y);
  } else {
    handleUIClick(pos.x, pos.y);
  }
}

// ─── RENDERIZAÇÃO ────────────────────────────────────────────
function draw() {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  switch (gameState) {
    case 'menu':          drawMenu();          break;
    case 'episodeSelect': drawEpisodeSelect(); break;
    case 'levelSelect':   drawLevelSelect();   break;
    case 'playing':       drawGame();          break;
    case 'levelComplete': drawGame(); drawLevelComplete(); break;
    case 'levelFail':     drawGame(); drawLevelFail();     break;
    case 'paused':        drawGame(); drawPauseOverlay();  break;
  }
}

// ─── MENU ────────────────────────────────────────────────────
function drawMenu() {
  drawSky(); drawMountains(0); drawGround(0); drawCloudsLayer(0);

  // Fundo do título
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,0.5)'; ctx.shadowBlur=18;
  const g = ctx.createLinearGradient(CANVAS_W/2-320,90,CANVAS_W/2+320,210);
  g.addColorStop(0,'#B71C1C'); g.addColorStop(0.5,'#E53935'); g.addColorStop(1,'#B71C1C');
  ctx.fillStyle=g;
  rr(CANVAS_W/2-320,88,640,135,22); ctx.fill();
  ctx.strokeStyle='#FDD835'; ctx.lineWidth=5; ctx.stroke();
  ctx.restore();

  ctx.fillStyle='#FFF'; ctx.font='bold 76px "Arial Black",Arial'; ctx.textAlign='center';
  ctx.shadowColor='rgba(0,0,0,0.6)'; ctx.shadowBlur=8;
  ctx.fillText('ANGRY BIRDS', CANVAS_W/2, 178);
  ctx.shadowBlur=0;

  ctx.fillStyle='rgba(255,255,255,0.85)'; ctx.font='bold 20px Arial';
  ctx.fillText('Clone Clássico 2009–2012', CANVAS_W/2, 218);

  // Pássaros decorativos
  const bob = t => Math.sin(animFrame*0.05+t)*6;
  ctx.save(); ctx.translate(CANVAS_W/2-210, 295+bob(0)); drawBirdShape(ctx,0,0,42,'red');     ctx.restore();
  ctx.save(); ctx.translate(CANVAS_W/2,     280+bob(2)); drawBirdShape(ctx,0,0,46,'chuck');   ctx.restore();
  ctx.save(); ctx.translate(CANVAS_W/2+210, 295+bob(4)); drawBirdShape(ctx,0,0,40,'bomb');    ctx.restore();
  ctx.save(); ctx.translate(CANVAS_W/2-110, 310+bob(1)); drawBirdShape(ctx,0,0,32,'blue');    ctx.restore();
  ctx.save(); ctx.translate(CANVAS_W/2+110, 310+bob(3)); drawBirdShape(ctx,0,0,34,'matilda'); ctx.restore();

  drawButton(CANVAS_W/2-130, 390, 260, 65, 'JOGAR', '#4CAF50','#1B5E20', 32);
  drawButton(CANVAS_W/2-100, 472, 200, 48, soundEnabled?'🔊 SOM: ON':'🔇 SOM: OFF', soundEnabled?'#2196F3':'#757575','#0D47A1', 20);

  ctx.fillStyle='rgba(255,255,255,0.55)'; ctx.font='14px Arial'; ctx.textAlign='center';
  ctx.fillText('Arraste o pássaro para atirar • Clique durante o voo para usar habilidade', CANVAS_W/2, 556);
  ctx.fillText('ESPAÇO = habilidade  |  ESC = pausa  |  R = reiniciar  |  Duplo-clique = fullscreen', CANVAS_W/2, 576);
}

// ─── SELEÇÃO DE EPISÓDIO ─────────────────────────────────────
function drawEpisodeSelect() {
  drawSky(); drawMountains(0); drawGround(0); drawCloudsLayer(0);
  panel(CANVAS_W/2-220,14,440,62,10,'rgba(0,0,0,0.6)');
  ctx.fillStyle='#FFF'; ctx.font='bold 30px Arial'; ctx.textAlign='center';
  ctx.fillText('Selecionar Episódio', CANVAS_W/2, 56);

  EPISODES.forEach((ep,i) => {
    const col=i%3, row=Math.floor(i/3);
    const x=170+col*320, y=120+row*230;
    const unlocked = unlockedEpisodes.includes(ep.id);
    drawEpisodeCard(x,y,ep,unlocked);
  });
  drawButton(28,18,105,42,'← Voltar','#607D8B','#37474F',18);
}

function drawEpisodeCard(x,y,ep,unlocked) {
  const w=270,h=190;
  ctx.save(); ctx.shadowColor='rgba(0,0,0,0.4)'; ctx.shadowBlur=12;
  ctx.fillStyle = unlocked ? ep.color : '#616161';
  rr(x,y,w,h,16); ctx.fill();
  ctx.strokeStyle = unlocked ? '#FFF' : '#9E9E9E'; ctx.lineWidth=3; ctx.stroke();
  ctx.restore();

  if (!unlocked) {
    ctx.fillStyle='rgba(0,0,0,0.45)'; rr(x,y,w,h,16); ctx.fill();
    ctx.font='44px Arial'; ctx.textAlign='center'; ctx.fillStyle='#FFF';
    ctx.fillText('🔒', x+w/2, y+h/2+14); return;
  }

  ctx.fillStyle='#FFF'; ctx.textAlign='center';
  ctx.font='bold 16px Arial'; ctx.fillText('Episódio '+ep.id, x+w/2, y+32);
  ctx.font='bold 21px Arial'; ctx.fillText(ep.name, x+w/2, y+60);
  ctx.font='13px Arial'; ctx.fillStyle='rgba(255,255,255,0.88)';
  wrapText(ctx, ep.description, x+w/2, y+88, w-24, 18);

  const epLevels = getLevelsByEpisode(ep.id);
  let ts=0; epLevels.forEach((_,li)=>{ ts+=(starsData[`${ep.id}_${li}`]||0); });
  ctx.fillStyle='#FDD835'; ctx.font='bold 15px Arial';
  ctx.fillText(`⭐ ${ts} / ${epLevels.length*3}`, x+w/2, y+h-18);
}

// ─── SELEÇÃO DE FASE ─────────────────────────────────────────
function drawLevelSelect() {
  drawSky(); drawMountains(0); drawGround(0); drawCloudsLayer(0);
  const ep = EPISODES.find(e=>e.id===currentEpisode);
  panel(CANVAS_W/2-260,12,520,65,10,'rgba(0,0,0,0.6)');
  ctx.fillStyle='#FFF'; ctx.font='bold 26px Arial'; ctx.textAlign='center';
  ctx.fillText(`Ep.${currentEpisode}: ${ep?ep.name:''}`, CANVAS_W/2, 52);

  const epLevels = getLevelsByEpisode(currentEpisode);
  epLevels.forEach((lv,i) => {
    const col=i%5, row=Math.floor(i/5);
    const x=118+col*215, y=115+row*165;
    drawLevelButton(x,y,i+1, starsData[`${currentEpisode}_${i}`]||0, isLevelUnlocked(currentEpisode,i));
  });
  drawButton(28,18,105,42,'← Voltar','#607D8B','#37474F',18);
}

function drawLevelButton(x,y,num,starCount,unlocked) {
  const w=170,h=130;
  ctx.save(); ctx.shadowColor='rgba(0,0,0,0.4)'; ctx.shadowBlur=8;
  ctx.fillStyle = unlocked ? '#388E3C' : '#616161';
  rr(x,y,w,h,14); ctx.fill();
  ctx.strokeStyle='#FFF'; ctx.lineWidth=2; ctx.stroke(); ctx.restore();

  if (!unlocked) {
    ctx.fillStyle='rgba(0,0,0,0.4)'; rr(x,y,w,h,14); ctx.fill();
    ctx.font='32px Arial'; ctx.textAlign='center'; ctx.fillStyle='#FFF';
    ctx.fillText('🔒', x+w/2, y+h/2+10); return;
  }
  ctx.fillStyle='#FFF'; ctx.font='bold 38px Arial'; ctx.textAlign='center';
  ctx.fillText(num, x+w/2, y+56);
  for (let i=0;i<3;i++) {
    ctx.fillStyle = i<starCount ? '#FDD835' : 'rgba(255,255,255,0.25)';
    ctx.font='22px Arial'; ctx.fillText('★', x+w/2-28+i*28, y+h-16);
  }
}

// ─── JOGO ────────────────────────────────────────────────────
function drawGame() {
  drawSky(); drawCloudsLayer(cameraX); drawMountains(cameraX*0.3); drawGround(cameraX);

  ctx.save(); ctx.translate(-cameraX, 0);
  blocks.forEach(drawBlock);
  pigs.forEach(drawPig);
  drawSlingBack();
  drawTrajectory();
  if (activeBird) drawActiveBird();
  ctx.restore();

  ctx.save(); ctx.translate(-cameraX, 0);
  drawSlingFront();
  ctx.restore();

  drawParticles();
  drawExplosions();
  drawScorePopups();
  drawHUD();
}

function drawSky() {
  const g = ctx.createLinearGradient(0,0,0,CANVAS_H);
  g.addColorStop(0,'#5DADE2'); g.addColorStop(0.55,'#85C1E9'); g.addColorStop(1,'#D6EAF8');
  ctx.fillStyle=g; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
}

function drawCloudsLayer(camX) {
  bgClouds.forEach(c => {
    const cx = ((c.x - camX*0.18) % (CANVAS_W+500)) - 250;
    drawCloud(cx, c.y, c.w, c.h);
  });
}

function drawCloud(x,y,w,h) {
  ctx.save(); ctx.fillStyle='rgba(255,255,255,0.88)';
  ctx.beginPath(); ctx.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x+w*0.28,y+h*0.42,w*0.28,h*0.46,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x+w*0.72,y+h*0.42,w*0.26,h*0.43,0,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawMountains(camX) {
  bgMountains.forEach(m => {
    const mx = ((m.x - camX) % (CANVAS_W+700)) - 350;
    ctx.fillStyle='#7DCEA0';
    ctx.beginPath(); ctx.moveTo(mx,GROUND_Y); ctx.lineTo(mx+m.w/2,GROUND_Y-m.h); ctx.lineTo(mx+m.w,GROUND_Y); ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.moveTo(mx+m.w/2,GROUND_Y-m.h); ctx.lineTo(mx+m.w/2-22,GROUND_Y-m.h+44); ctx.lineTo(mx+m.w/2+22,GROUND_Y-m.h+44); ctx.closePath(); ctx.fill();
  });
}

function drawGround(camX) {
  const g = ctx.createLinearGradient(0,GROUND_Y,0,CANVAS_H);
  g.addColorStop(0,'#58D68D'); g.addColorStop(0.12,'#4CAF50'); g.addColorStop(1,'#27AE60');
  ctx.fillStyle=g; ctx.fillRect(0,GROUND_Y,CANVAS_W,CANVAS_H-GROUND_Y);
  ctx.fillStyle='#6FCF97'; ctx.fillRect(0,GROUND_Y,CANVAS_W,7);
  ctx.fillStyle='#82E0AA';
  for (let gx=((-camX%38)+38)%38; gx<CANVAS_W+38; gx+=38) {
    ctx.beginPath(); ctx.moveTo(gx,GROUND_Y); ctx.lineTo(gx+5,GROUND_Y-11); ctx.lineTo(gx+10,GROUND_Y); ctx.fill();
  }
}

function drawSlingBack() {
  ctx.strokeStyle='#4E342E'; ctx.lineWidth=9; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(SLING_X+8,GROUND_Y); ctx.lineTo(SLING_LEFT_X,SLING_LEFT_Y); ctx.stroke();

  if (isDragging && activeBird) {
    ctx.strokeStyle='#6D4C41'; ctx.lineWidth=5;
    ctx.beginPath(); ctx.moveTo(SLING_LEFT_X,SLING_LEFT_Y); ctx.lineTo(dragCurrent.x,dragCurrent.y); ctx.stroke();
  } else if (!launched && activeBird) {
    ctx.strokeStyle='#6D4C41'; ctx.lineWidth=5;
    ctx.beginPath(); ctx.moveTo(SLING_LEFT_X,SLING_LEFT_Y); ctx.lineTo(SLING_PIVOT_X,SLING_PIVOT_Y); ctx.stroke();
  }
}

function drawSlingFront() {
  ctx.strokeStyle='#4E342E'; ctx.lineWidth=9; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(SLING_X+32,GROUND_Y); ctx.lineTo(SLING_RIGHT_X,SLING_RIGHT_Y); ctx.stroke();

  if (isDragging && activeBird) {
    ctx.strokeStyle='#6D4C41'; ctx.lineWidth=5;
    ctx.beginPath(); ctx.moveTo(SLING_RIGHT_X,SLING_RIGHT_Y); ctx.lineTo(dragCurrent.x,dragCurrent.y); ctx.stroke();
  } else if (!launched && activeBird) {
    ctx.strokeStyle='#6D4C41'; ctx.lineWidth=5;
    ctx.beginPath(); ctx.moveTo(SLING_RIGHT_X,SLING_RIGHT_Y); ctx.lineTo(SLING_PIVOT_X,SLING_PIVOT_Y); ctx.stroke();
  }

  ctx.fillStyle='#3E2723';
  rr(SLING_X-2,GROUND_Y-12,44,22,6); ctx.fill();
}

function drawTrajectory() {
  // Trajetória prevista
  if (isDragging && activeBird) {
    const dx = SLING_PIVOT_X - dragCurrent.x, dy = SLING_PIVOT_Y - dragCurrent.y;
    const dist = Math.hypot(dx,dy);
    const power = dist * LAUNCH_POWER;
    let px=SLING_PIVOT_X, py=SLING_PIVOT_Y, pvx=dx*power, pvy=dy*power;
    const grav = 0.012 * 1.2;
    ctx.save(); ctx.setLineDash([5,9]); ctx.strokeStyle='rgba(255,255,255,0.55)'; ctx.lineWidth=2.5;
    ctx.beginPath();
    for (let t=0; t<65; t++) {
      ctx.lineTo(px,py); px+=pvx; py+=pvy; pvy+=grav;
      if (py > GROUND_Y) break;
    }
    ctx.stroke(); ctx.restore();
  }

  // Trajetória percorrida
  if (trajectoryPoints.length > 1 && launched) {
    ctx.save(); ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.lineWidth=2; ctx.setLineDash([3,7]);
    ctx.beginPath();
    trajectoryPoints.forEach((p,i) => i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y));
    ctx.stroke(); ctx.restore();
  }
}

function drawActiveBird() {
  if (!activeBird) return;
  const pos = activeBird.body.position;
  const r = activeBird.props.radius * (activeBird.inflated ? 2.6 : 1);
  drawBirdShape(ctx, pos.x, pos.y, r, activeBird.type);

  // Anel de habilidade disponível
  if (launched && !abilityUsed && activeBird.props.ability !== 'none') {
    ctx.save();
    ctx.strokeStyle = `rgba(255,230,0,${0.5+Math.sin(animFrame*0.15)*0.4})`;
    ctx.lineWidth=2.5; ctx.setLineDash([5,5]);
    ctx.beginPath(); ctx.arc(pos.x,pos.y,r+10,0,Math.PI*2); ctx.stroke();
    ctx.restore();
  }

  // Split bodies
  splitBodies.forEach(b => drawBirdShape(ctx, b.position.x, b.position.y, BIRD_PROPS.blue.radius*0.82, 'blue'));
}

function drawBirdShape(ctx, x, y, r, type) {
  const props = BIRD_PROPS[type] || BIRD_PROPS.red;
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,0.28)'; ctx.shadowBlur=6; ctx.shadowOffsetY=3;

  // Chuck tem forma triangular
  if (type === 'chuck') {
    const g = ctx.createRadialGradient(x-r*0.3,y-r*0.3,r*0.1,x,y,r*1.1);
    g.addColorStop(0, lighten(props.color,45)); g.addColorStop(1, props.color);
    ctx.fillStyle=g;
    ctx.beginPath();
    ctx.moveTo(x-r*0.95, y+r*0.55);
    ctx.lineTo(x+r*1.25, y);
    ctx.lineTo(x-r*0.95, y-r*0.55);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle=props.strokeColor; ctx.lineWidth=2.5; ctx.stroke();
    ctx.restore(); ctx.save();
    drawEyes(ctx, x-r*0.15, y-r*0.05, r*0.78);
    ctx.fillStyle='#FF8F00';
    ctx.beginPath(); ctx.moveTo(x+r*0.2,y-r*0.1); ctx.lineTo(x+r*0.65,y); ctx.lineTo(x+r*0.2,y+r*0.1); ctx.closePath(); ctx.fill();
    ctx.restore(); return;
  }

  // Corpo circular
  const g = ctx.createRadialGradient(x-r*0.3,y-r*0.3,r*0.08,x,y,r);
  g.addColorStop(0, lighten(props.color,42)); g.addColorStop(1, props.color);
  ctx.fillStyle=g;
  ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle=props.strokeColor; ctx.lineWidth=2.5; ctx.stroke();
  ctx.restore(); ctx.save();

  switch(type) {
    case 'red': case 'terence':
      ctx.strokeStyle='#000'; ctx.lineWidth=2.2;
      ctx.beginPath(); ctx.moveTo(x-r*0.52,y-r*0.28); ctx.lineTo(x-r*0.08,y-r*0.52); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x+r*0.52,y-r*0.28); ctx.lineTo(x+r*0.08,y-r*0.52); ctx.stroke();
      drawEyes(ctx,x,y,r);
      ctx.fillStyle='#FF8F00';
      ctx.beginPath(); ctx.moveTo(x-r*0.16,y+r*0.04); ctx.lineTo(x+r*0.16,y+r*0.04); ctx.lineTo(x,y+r*0.36); ctx.closePath(); ctx.fill();
      ctx.fillStyle=props.strokeColor;
      ctx.beginPath(); ctx.moveTo(x-r*0.22,y-r*0.82); ctx.lineTo(x,y-r*1.22); ctx.lineTo(x+r*0.22,y-r*0.82); ctx.closePath(); ctx.fill();
      break;
    case 'blue':
      drawEyes(ctx,x,y,r*0.88);
      ctx.fillStyle='#FF8F00';
      ctx.beginPath(); ctx.moveTo(x-r*0.13,y+r*0.04); ctx.lineTo(x+r*0.13,y+r*0.04); ctx.lineTo(x,y+r*0.3); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#1565C0';
      ctx.beginPath(); ctx.moveTo(x-r*0.16,y-r*0.78); ctx.lineTo(x,y-r*1.12); ctx.lineTo(x+r*0.16,y-r*0.78); ctx.closePath(); ctx.fill();
      break;
    case 'bomb':
      ctx.strokeStyle='#6D4C41'; ctx.lineWidth=3.5;
      ctx.beginPath(); ctx.moveTo(x,y-r); ctx.quadraticCurveTo(x+r*0.32,y-r*1.32,x+r*0.12,y-r*1.55); ctx.stroke();
      if (animFrame%10<5) { ctx.fillStyle='#FDD835'; ctx.beginPath(); ctx.arc(x+r*0.12,y-r*1.55,4.5,0,Math.PI*2); ctx.fill(); }
      drawEyes(ctx,x,y,r);
      ctx.fillStyle='#FF8F00';
      ctx.beginPath(); ctx.moveTo(x-r*0.16,y+r*0.08); ctx.lineTo(x+r*0.16,y+r*0.08); ctx.lineTo(x,y+r*0.36); ctx.closePath(); ctx.fill();
      break;
    case 'matilda':
      ctx.fillStyle='rgba(255,255,255,0.92)';
      ctx.beginPath(); ctx.ellipse(x,y,r*0.88,r,0,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#BDBDBD'; ctx.lineWidth=2; ctx.stroke();
      drawEyes(ctx,x,y-r*0.08,r*0.82);
      ctx.fillStyle='#FF8F00';
      ctx.beginPath(); ctx.moveTo(x-r*0.13,y+r*0.14); ctx.lineTo(x+r*0.13,y+r*0.14); ctx.lineTo(x,y+r*0.4); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#E91E63';
      ctx.beginPath(); ctx.ellipse(x-r*0.22,y-r*0.82,r*0.22,r*0.13,-0.5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x+r*0.22,y-r*0.82,r*0.22,r*0.13,0.5,0,Math.PI*2); ctx.fill();
      break;
    case 'hal':
      ctx.fillStyle='#FF8F00';
      ctx.beginPath(); ctx.moveTo(x+r*0.28,y-r*0.22); ctx.lineTo(x+r*1.25,y); ctx.lineTo(x+r*0.28,y+r*0.22); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='#E65100'; ctx.lineWidth=1.5; ctx.stroke();
      drawEyes(ctx,x-r*0.12,y-r*0.08,r*0.82);
      break;
    case 'bubbles':
      ctx.fillStyle='#FF8F00';
      ctx.beginPath(); ctx.moveTo(x-r*0.1,y+r*0.1); ctx.lineTo(x+r*0.52,y); ctx.lineTo(x-r*0.1,y-r*0.1); ctx.closePath(); ctx.fill();
      drawEyes(ctx,x-r*0.18,y-r*0.08,r*0.82);
      break;
  }
  ctx.restore();
}

function drawEyes(ctx,x,y,r) {
  [[-0.3,0.3]].forEach(()=>{
    [-1,1].forEach(side => {
      const ex=x+side*r*0.3, ey=y-r*0.16;
      ctx.fillStyle='#FFF'; ctx.beginPath(); ctx.ellipse(ex,ey,r*0.22,r*0.26,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#1A237E'; ctx.beginPath(); ctx.arc(ex,ey+r*0.04,r*0.13,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#FFF'; ctx.beginPath(); ctx.arc(ex+side*r*0.06,ey-r*0.06,r*0.055,0,Math.PI*2); ctx.fill();
    });
  });
}

function drawBlock(b) {
  const pos=b.body.position, ang=b.body.angle;
  const mp=MATERIAL_PROPS[b.type];
  const dr=1-b.hp/b.maxHp;
  ctx.save(); ctx.translate(pos.x,pos.y); ctx.rotate(ang);
  ctx.shadowColor='rgba(0,0,0,0.25)'; ctx.shadowBlur=4;

  if (b.type==='tnt') {
    ctx.fillStyle='#FF5722'; ctx.fillRect(-b.w/2,-b.h/2,b.w,b.h);
    ctx.strokeStyle='#BF360C'; ctx.lineWidth=3; ctx.strokeRect(-b.w/2,-b.h/2,b.w,b.h);
    ctx.fillStyle='#FFF'; ctx.font=`bold ${Math.min(b.w*0.38,17)}px Arial`; ctx.textAlign='center'; ctx.fillText('TNT',0,5);
    ctx.strokeStyle='#FDD835'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(-b.w/2,-b.h/2+5); ctx.lineTo(b.w/2,-b.h/2+5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-b.w/2,b.h/2-5); ctx.lineTo(b.w/2,b.h/2-5); ctx.stroke();
  } else {
    let col = dr>0.3 ? blend(mp.color,'#2c2c2c',dr*0.5) : mp.color;
    if (b.hitTimer>0) col = lighten(col, 40);
    ctx.fillStyle=col; ctx.fillRect(-b.w/2,-b.h/2,b.w,b.h);
    ctx.strokeStyle=mp.strokeColor; ctx.lineWidth=2.2; ctx.strokeRect(-b.w/2,-b.h/2,b.w,b.h);
    drawBlockTexture(ctx,b.type,b.w,b.h);
  }
  if (dr>0.38) drawCracks(ctx,b.w,b.h,dr);
  ctx.restore();
}

function drawBlockTexture(ctx,type,w,h) {
  ctx.save(); ctx.globalAlpha=0.28;
  if (type==='wood') {
    ctx.strokeStyle='#5C3D11'; ctx.lineWidth=1;
    for (let i=-h/2+7; i<h/2; i+=7) { ctx.beginPath(); ctx.moveTo(-w/2,i); ctx.lineTo(w/2,i); ctx.stroke(); }
  } else if (type==='glass') {
    ctx.strokeStyle='rgba(255,255,255,0.8)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(-w/2+4,-h/2+4); ctx.lineTo(w/2-4,h/2-4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w/2-4,-h/2+4); ctx.lineTo(-w/2+4,h/2-4); ctx.stroke();
  } else if (type==='stone') {
    ctx.strokeStyle='#757575'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(-w/4,-h/2); ctx.lineTo(-w/4,h/2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w/4,-h/2); ctx.lineTo(w/4,h/2); ctx.stroke();
  }
  ctx.restore();
}

function drawCracks(ctx,w,h,ratio) {
  ctx.save(); ctx.strokeStyle='rgba(0,0,0,0.48)'; ctx.lineWidth=1.5;
  const seed = w*h;
  for (let i=0;i<3;i++) {
    const cx=(((seed*i*7)%100)/100-0.5)*w*0.4;
    const cy=(((seed*i*13)%100)/100-0.5)*h*0.4;
    for (let j=0;j<3;j++) {
      const a=(j/3)*Math.PI*2+(i*1.1);
      const len=(w+h)*0.18*ratio;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*len,cy+Math.sin(a)*len); ctx.stroke();
    }
  }
  ctx.restore();
}

function drawPig(pig) {
  const pos=pig.body.position, r=pig.radius, dr=1-pig.hp/pig.maxHp;
  ctx.save(); ctx.translate(pos.x,pos.y);
  ctx.shadowColor='rgba(0,0,0,0.28)'; ctx.shadowBlur=5; ctx.shadowOffsetY=3;

  const pigCol = pig.hitTimer>0 ? '#A5D6A7' : (dr>0.5?'#388E3C':'#66BB6A');
  const g=ctx.createRadialGradient(-r*0.3,-r*0.3,r*0.08,0,0,r);
  g.addColorStop(0,lighten(pigCol,28)); g.addColorStop(1,pigCol);
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#2E7D32'; ctx.lineWidth=2.2; ctx.stroke();
  ctx.restore(); ctx.save(); ctx.translate(pos.x,pos.y);

  // Nariz
  ctx.fillStyle='#F48FB1'; ctx.beginPath(); ctx.ellipse(0,r*0.14,r*0.36,r*0.26,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#E91E63'; ctx.lineWidth=1; ctx.stroke();
  ctx.fillStyle='#C2185B';
  ctx.beginPath(); ctx.arc(-r*0.13,r*0.14,r*0.075,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(r*0.13,r*0.14,r*0.075,0,Math.PI*2); ctx.fill();

  // Orelhas
  ctx.fillStyle='#4CAF50';
  ctx.beginPath(); ctx.ellipse(-r*0.72,-r*0.52,r*0.2,r*0.3,-0.3,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(r*0.72,-r*0.52,r*0.2,r*0.3,0.3,0,Math.PI*2); ctx.fill();

  // Olhos
  const scared = pig.expression==='scared'||pig.expression==='hurt';
  [-1,1].forEach(side => {
    const ex=side*r*0.3, ey=-r*0.2;
    ctx.fillStyle='#FFF'; ctx.beginPath(); ctx.ellipse(ex,ey,r*0.22,r*(scared?0.28:0.24),0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#1A237E'; ctx.beginPath(); ctx.arc(ex,ey+r*0.04,r*0.13,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#FFF'; ctx.beginPath(); ctx.arc(ex+side*r*0.07,ey-r*0.07,r*0.055,0,Math.PI*2); ctx.fill();
    if (scared) {
      ctx.strokeStyle='#000'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(ex-r*0.12,ey-r*0.22); ctx.lineTo(ex+r*0.12,ey-r*0.22); ctx.stroke();
    }
  });

  // Capacete
  if (pig.type==='helmet') {
    ctx.fillStyle='#9E9E9E'; ctx.beginPath(); ctx.ellipse(0,-r*0.28,r*0.88,r*0.72,0,Math.PI,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#616161'; ctx.lineWidth=2; ctx.stroke();
    ctx.fillStyle='#BDBDBD'; ctx.beginPath(); ctx.ellipse(0,-r*0.28,r*0.72,r*0.52,0,Math.PI,Math.PI*2); ctx.fill();
  }

  // Coroa
  if (pig.type==='king') {
    ctx.fillStyle='#FDD835';
    ctx.beginPath(); ctx.moveTo(-r*0.72,-r*0.62); ctx.lineTo(-r*0.72,-r*1.12); ctx.lineTo(-r*0.36,-r*0.82); ctx.lineTo(0,-r*1.22); ctx.lineTo(r*0.36,-r*0.82); ctx.lineTo(r*0.72,-r*1.12); ctx.lineTo(r*0.72,-r*0.62); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='#F57F17'; ctx.lineWidth=2; ctx.stroke();
    ['#E53935','#4CAF50','#2196F3'].forEach((c,i)=>{ ctx.fillStyle=c; ctx.beginPath(); ctx.arc(-r*0.36+i*r*0.36,-r*0.88,r*0.1,0,Math.PI*2); ctx.fill(); });
  }

  // HP bar
  if (dr>0.08) {
    const bw=r*2, bh=5, bx=-r, by=r+5;
    ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.fillRect(bx,by,bw,bh);
    ctx.fillStyle=dr>0.6?'#F44336':'#4CAF50'; ctx.fillRect(bx,by,bw*(1-dr),bh);
  }
  ctx.restore();
}

function drawParticles() {
  particles.forEach(p => {
    ctx.save(); ctx.globalAlpha=p.alpha;
    if (p.isConfetti) {
      ctx.translate(p.x,p.y); ctx.rotate(p.rotation||0);
      ctx.fillStyle=p.color; ctx.fillRect(-p.size/2,-p.size/4,p.size,p.size/2);
    } else {
      ctx.fillStyle=p.color; ctx.beginPath(); ctx.arc(p.x,p.y,p.size/2,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
  });
}

function drawExplosions() {
  explosionEffects.forEach(e => {
    ctx.save(); ctx.globalAlpha=e.alpha*0.62;
    const g=ctx.createRadialGradient(e.x-cameraX,e.y,0,e.x-cameraX,e.y,e.radius);
    g.addColorStop(0,'#FFF'); g.addColorStop(0.28,'#FF9800'); g.addColorStop(0.65,'#FF5722'); g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(e.x-cameraX,e.y,e.radius,0,Math.PI*2); ctx.fill();
    ctx.restore();
  });
}

function drawScorePopups() {
  scorePopups.forEach(p => {
    ctx.save(); ctx.globalAlpha=p.alpha;
    ctx.font='bold 22px Arial'; ctx.textAlign='center';
    ctx.strokeStyle='#000'; ctx.lineWidth=3; ctx.strokeText(p.text,p.x,p.y);
    ctx.fillStyle='#FDD835'; ctx.fillText(p.text,p.x,p.y);
    ctx.restore();
  });
}

function drawHUD() {
  ctx.fillStyle='rgba(0,0,0,0.52)'; ctx.fillRect(0,0,CANVAS_W,52);
  ctx.fillStyle='#FDD835'; ctx.font='bold 26px Arial'; ctx.textAlign='left';
  ctx.fillText('Pontos: '+score.toLocaleString('pt-BR'), 18, 36);
  ctx.fillStyle='#FFF'; ctx.font='bold 18px Arial'; ctx.textAlign='center';
  const ep=EPISODES.find(e=>e.id===currentEpisode);
  ctx.fillText(`Ep.${currentEpisode} – ${ep?ep.name:''} | Fase ${currentLevelIndex+1}`, CANVAS_W/2, 34);
  drawButton(CANVAS_W-108,7,90,38,'⏸ Pausa','#546E7A','#263238',15);

  // Fila de pássaros
  ctx.fillStyle='rgba(0,0,0,0.42)'; rr(8,CANVAS_H-72,210,62,10); ctx.fill();
  const queueDisplay = [
    ...(activeBird && !launched ? [activeBird.type] : []),
    ...birdQueue
  ];
  queueDisplay.slice(0,7).forEach((t,i) => {
    const bx=36+i*30, by=CANVAS_H-40, r=i===0?14:10;
    drawBirdShape(ctx,bx,by,r,t);
  });
}

// ─── TELAS DE RESULTADO ──────────────────────────────────────
function drawLevelComplete() {
  ctx.fillStyle='rgba(0,0,0,0.48)'; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
  const pw=510,ph=390,px=CANVAS_W/2-pw/2,py=CANVAS_H/2-ph/2;
  ctx.save(); ctx.shadowColor='rgba(0,0,0,0.5)'; ctx.shadowBlur=22;
  const g=ctx.createLinearGradient(px,py,px,py+ph); g.addColorStop(0,'#1B5E20'); g.addColorStop(1,'#2E7D32');
  ctx.fillStyle=g; rr(px,py,pw,ph,22); ctx.fill();
  ctx.strokeStyle='#FDD835'; ctx.lineWidth=5; ctx.stroke(); ctx.restore();

  ctx.fillStyle='#FDD835'; ctx.font='bold 46px "Arial Black",Arial'; ctx.textAlign='center';
  ctx.fillText('NÍVEL COMPLETO!', CANVAS_W/2, py+66);

  for (let i=0;i<3;i++) {
    const sx=CANVAS_W/2-105+i*105, sy=py+138;
    const filled=i<stars_earned;
    const sc=filled?1.2+Math.sin(animFrame*0.1+i)*0.1:0.8;
    ctx.save(); ctx.translate(sx,sy); ctx.scale(sc,sc);
    drawStar(ctx,0,0,36,filled?'#FDD835':'rgba(255,255,255,0.18)',filled?'#F57F17':'#555');
    ctx.restore();
  }

  ctx.fillStyle='#FFF'; ctx.font='bold 26px Arial'; ctx.textAlign='center';
  ctx.fillText('Pontuação: '+score.toLocaleString('pt-BR'), CANVAS_W/2, py+228);
  const key=`${currentEpisode}_${currentLevelIndex}`;
  if (highScores[key]) {
    ctx.fillStyle='#A5D6A7'; ctx.font='19px Arial';
    ctx.fillText('Recorde: '+highScores[key].toLocaleString('pt-BR'), CANVAS_W/2, py+258);
  }
  drawButton(px+30,py+300,185,58,'↺ Repetir','#FF9800','#E65100',22);
  drawButton(px+295,py+300,185,58,'Próximo ▶','#4CAF50','#2E7D32',22);
}

function drawLevelFail() {
  ctx.fillStyle='rgba(0,0,0,0.55)'; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
  const pw=470,ph=305,px=CANVAS_W/2-pw/2,py=CANVAS_H/2-ph/2;
  ctx.save(); ctx.shadowColor='rgba(0,0,0,0.5)'; ctx.shadowBlur=22;
  const g=ctx.createLinearGradient(px,py,px,py+ph); g.addColorStop(0,'#B71C1C'); g.addColorStop(1,'#C62828');
  ctx.fillStyle=g; rr(px,py,pw,ph,22); ctx.fill();
  ctx.strokeStyle='#FF5722'; ctx.lineWidth=5; ctx.stroke(); ctx.restore();

  ctx.fillStyle='#FFF'; ctx.font='bold 52px "Arial Black",Arial'; ctx.textAlign='center';
  ctx.fillText('FALHOU!', CANVAS_W/2, py+80);
  ctx.fillStyle='#FFCDD2'; ctx.font='22px Arial';
  ctx.fillText('Os porcos sobreviveram...', CANVAS_W/2, py+130);
  ctx.fillText('Pontuação: '+score.toLocaleString('pt-BR'), CANVAS_W/2, py+165);
  drawButton(px+38,py+218,175,58,'↺ Tentar Novamente','#FF9800','#E65100',18);
  drawButton(px+258,py+218,175,58,'☰ Menu','#607D8B','#37474F',22);
}

function drawPauseOverlay() {
  ctx.fillStyle='rgba(0,0,0,0.58)'; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
  const pw=370,ph=290,px=CANVAS_W/2-pw/2,py=CANVAS_H/2-ph/2;
  ctx.fillStyle='#263238'; rr(px,py,pw,ph,16); ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.8)'; ctx.lineWidth=3; ctx.stroke();
  ctx.fillStyle='#FFF'; ctx.font='bold 40px Arial'; ctx.textAlign='center';
  ctx.fillText('PAUSADO', CANVAS_W/2, py+65);
  drawButton(px+42,py+100,286,52,'▶ Continuar','#4CAF50','#2E7D32',22);
  drawButton(px+42,py+165,286,52,'↺ Reiniciar','#FF9800','#E65100',22);
  drawButton(px+42,py+228,286,42,'☰ Menu Principal','#607D8B','#37474F',18);
}

// ─── UTILITÁRIOS DE DESENHO ──────────────────────────────────
function drawButton(x,y,w,h,text,col,dark,fs) {
  ctx.save(); ctx.shadowColor='rgba(0,0,0,0.38)'; ctx.shadowBlur=8; ctx.shadowOffsetY=3;
  const g=ctx.createLinearGradient(x,y,x,y+h); g.addColorStop(0,lighten(col,18)); g.addColorStop(1,col);
  ctx.fillStyle=g; rr(x,y,w,h,10); ctx.fill();
  ctx.strokeStyle=dark; ctx.lineWidth=3; ctx.stroke(); ctx.restore();
  ctx.fillStyle='#FFF'; ctx.font=`bold ${fs}px Arial`; ctx.textAlign='center';
  ctx.shadowColor='rgba(0,0,0,0.45)'; ctx.shadowBlur=4;
  ctx.fillText(text, x+w/2, y+h/2+fs*0.36);
  ctx.shadowBlur=0;
}

function drawStar(ctx,x,y,r,fill,stroke) {
  ctx.beginPath();
  for (let i=0;i<5;i++) {
    const oa=(i*4*Math.PI/5)-Math.PI/2, ia=oa+2*Math.PI/10;
    if(i===0) ctx.moveTo(x+r*Math.cos(oa),y+r*Math.sin(oa));
    else ctx.lineTo(x+r*Math.cos(oa),y+r*Math.sin(oa));
    ctx.lineTo(x+r*0.4*Math.cos(ia),y+r*0.4*Math.sin(ia));
  }
  ctx.closePath(); ctx.fillStyle=fill; ctx.fill(); ctx.strokeStyle=stroke; ctx.lineWidth=2; ctx.stroke();
}

function panel(x,y,w,h,r,col) {
  ctx.fillStyle=col; rr(x,y,w,h,r); ctx.fill();
}

function rr(x,y,w,h,r) {
  if (typeof ctx.roundRect === 'function') { ctx.beginPath(); ctx.roundRect(x,y,w,h,r); return; }
  if (w<2*r) r=w/2; if (h<2*r) r=h/2;
  ctx.beginPath(); ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
}

function lighten(hex, amt) {
  const n=parseInt(hex.replace('#',''),16);
  const r=Math.min(255,(n>>16)+amt), g=Math.min(255,((n>>8)&0xFF)+amt), b=Math.min(255,(n&0xFF)+amt);
  return `rgb(${r},${g},${b})`;
}

function blend(c1,c2,t) {
  const n1=parseInt(c1.replace('#',''),16), n2=parseInt(c2.replace('#',''),16);
  const r=Math.round(((n1>>16)*(1-t))+((n2>>16)*t));
  const g=Math.round((((n1>>8)&0xFF)*(1-t))+(((n2>>8)&0xFF)*t));
  const b=Math.round(((n1&0xFF)*(1-t))+((n2&0xFF)*t));
  return `rgb(${r},${g},${b})`;
}

function wrapText(ctx,text,x,y,maxW,lineH) {
  const words=text.split(' '); let line='';
  words.forEach(w => {
    const test=line+w+' ';
    if (ctx.measureText(test).width>maxW && line!=='') { ctx.fillText(line.trim(),x,y); line=w+' '; y+=lineH; }
    else line=test;
  });
  ctx.fillText(line.trim(),x,y);
}

// ─── CLIQUES NA UI ───────────────────────────────────────────
function handleUIClick(x,y) {
  if (gameState==='menu') {
    if (inR(x,y,CANVAS_W/2-130,390,260,65)) { initAudio(); gameState='episodeSelect'; }
    if (inR(x,y,CANVAS_W/2-100,472,200,48)) { soundEnabled=!soundEnabled; saveProgress(); }
  }
  else if (gameState==='episodeSelect') {
    if (inR(x,y,28,18,105,42)) { gameState='menu'; return; }
    EPISODES.forEach((ep,i) => {
      const col=i%3, row=Math.floor(i/3);
      const ex=170+col*320, ey=120+row*230;
      if (inR(x,y,ex,ey,270,190) && unlockedEpisodes.includes(ep.id)) { currentEpisode=ep.id; gameState='levelSelect'; }
    });
  }
  else if (gameState==='levelSelect') {
    if (inR(x,y,28,18,105,42)) { gameState='episodeSelect'; return; }
    const epLevels=getLevelsByEpisode(currentEpisode);
    epLevels.forEach((_,i) => {
      const col=i%5, row=Math.floor(i/5);
      const lx=118+col*215, ly=115+row*165;
      if (inR(x,y,lx,ly,170,130) && isLevelUnlocked(currentEpisode,i)) { initAudio(); loadLevel(currentEpisode,i); }
    });
  }
  else if (gameState==='playing') {
    if (inR(x,y,CANVAS_W-108,7,90,38)) gameState='paused';
  }
  else if (gameState==='levelComplete') {
    const pw=510,ph=390,px=CANVAS_W/2-pw/2,py=CANVAS_H/2-ph/2;
    if (inR(x,y,px+30,py+300,185,58)) loadLevel(currentEpisode,currentLevelIndex);
    if (inR(x,y,px+295,py+300,185,58)) nextLevel();
  }
  else if (gameState==='levelFail') {
    const pw=470,ph=305,px=CANVAS_W/2-pw/2,py=CANVAS_H/2-ph/2;
    if (inR(x,y,px+38,py+218,175,58)) loadLevel(currentEpisode,currentLevelIndex);
    if (inR(x,y,px+258,py+218,175,58)) gameState='episodeSelect';
  }
  else if (gameState==='paused') {
    const pw=370,ph=290,px=CANVAS_W/2-pw/2,py=CANVAS_H/2-ph/2;
    if (inR(x,y,px+42,py+100,286,52)) gameState='playing';
    if (inR(x,y,px+42,py+165,286,52)) loadLevel(currentEpisode,currentLevelIndex);
    if (inR(x,y,px+42,py+228,286,42)) gameState='episodeSelect';
  }
}

function inR(x,y,rx,ry,rw,rh) { return x>=rx&&x<=rx+rw&&y>=ry&&y<=ry+rh; }

function nextLevel() {
  const epLevels=getLevelsByEpisode(currentEpisode);
  const ni=currentLevelIndex+1;
  if (ni<epLevels.length) {
    if (!unlockedLevels[currentEpisode]) unlockedLevels[currentEpisode]=[0];
    if (!unlockedLevels[currentEpisode].includes(ni)) unlockedLevels[currentEpisode].push(ni);
    saveProgress(); loadLevel(currentEpisode,ni);
  } else {
    const ne=currentEpisode+1;
    if (ne<=EPISODES.length && !unlockedEpisodes.includes(ne)) {
      unlockedEpisodes.push(ne);
      if (!unlockedLevels[ne]) unlockedLevels[ne]=[0];
    }
    saveProgress(); gameState='episodeSelect';
  }
}

function isLevelUnlocked(epId,lvIdx) {
  if (lvIdx===0) return true;
  return unlockedLevels[epId] && unlockedLevels[epId].includes(lvIdx);
}

// ─── SAVE / LOAD ─────────────────────────────────────────────
function saveProgress() {
  try {
    localStorage.setItem('ab_stars',   JSON.stringify(starsData));
    localStorage.setItem('ab_hs',      JSON.stringify(highScores));
    localStorage.setItem('ab_ep',      JSON.stringify(unlockedEpisodes));
    localStorage.setItem('ab_lv',      JSON.stringify(unlockedLevels));
    localStorage.setItem('ab_snd',     soundEnabled?'1':'0');
  } catch(e) {}
}

function loadProgress() {
  try {
    const s=localStorage.getItem('ab_stars');  if(s) starsData=JSON.parse(s);
    const h=localStorage.getItem('ab_hs');     if(h) highScores=JSON.parse(h);
    const e=localStorage.getItem('ab_ep');     if(e) unlockedEpisodes=JSON.parse(e);
    const l=localStorage.getItem('ab_lv');     if(l) unlockedLevels=JSON.parse(l);
    const sn=localStorage.getItem('ab_snd');   if(sn!==null) soundEnabled=sn==='1';
  } catch(e) {}
}

// ─── INICIAR ─────────────────────────────────────────────────
window.addEventListener('load', init);
