// ===============================
// 光圈常亮脉动 + 悬浮触发喷泉（p5.js）完整代码
// 说明：
// 1) 盘子光圈现在始终存在并缓慢脉动（不再只在 hover 时显示）
// 2) 鼠标悬浮在盘子上时，会在盘子位置持续触发“喷泉”粒子动效（向上喷+拖尾）
// 其余逻辑（滚动条、背景切换、热点等）保持与你的代码一致
// ===============================

// 全局变量部分
let img, img2; // 背景图1 和 背景图2
const IMG1_PATH = "背景_画板 1.jpg";
const IMG2_PATH = "微信图片_20250907202929_43_2.jpg"; // 请替换为你的第二张图片路径

// ==== 自定义光晕鼠标参数 ====
let CURSOR_ENABLED = true;     // 开关
let CURSOR_COLOR = [255, 180, 140, 180]; // [r,g,b,a] 颜色（可改）
let CURSOR_CORE_SIZE = 6;      // 中心圆直径（像素）
let CURSOR_GLOW_SIZE = 40;     // 外发光直径（像素，越大越扩散）
let CURSOR_BLUR_PX = 20;       // 模糊半径（像素）
let CURSOR_ADD_MODE = true;    // 是否使用叠加混合让光更亮

// ==== 中间区域氛围感光晕参数 ====
let AMBIENT_GLOW_ENABLED = true; // 开关
let AMBIENT_GLOW_COUNT = 12;     // 减少光晕数量，优化性能
let AMBIENT_GLOW_BASE_SIZE = 5; // 基础尺寸减小，形成小圆点
let AMBIENT_GLOW_MAX_SIZE = 20; // 最大尺寸
let AMBIENT_GLOW_COLORS = [     // 光晕颜色集合 - 更亮的暖色调
  [255, 255, 220, 200],  // 亮黄白色
  [255, 240, 200, 180],  // 亮米黄色
  [255, 220, 180, 160]   // 亮橘黄色
];
let AMBIENT_GLOW_BLUR = 13;     // 模糊半径
let AMBIENT_GLOW_POSITIONS = []; // 存储每个光晕的位置和属性
let AMBIENT_GLOW_LIFESPANS = []; // 存储每个光晕的生命周期信息
let AMBIENT_GLOW_STATIC_FLAGS = []; // 标记哪些光晕是固定的
let AMBIENT_GLOW_OPACITY_SCALES = []; // 每个光晕的不透明度缩放值

// 性能优化参数
let AMBIENT_GLOW_UPDATE_INTERVAL = 2; // 每隔多少帧更新一次光晕位置
let ambientGlowFrameCounter = 0; // 帧计数器
let glowOffscreenCanvas; // 离屏画布（氛围光）
let cursorGlowCanvas; // 离屏画布（鼠标光晕）
 
let started = false;
let startTime = 0; // 记录动画开始时间

// 粉色盘子区域 (相对比例)
let plateRelX = 0.305;
let plateRelY = 0.74;
let plateRelW = 0.04;
let plateRelH = 0.02;

// 缓存的计算结果
let cachedCover1 = null; // 图1的覆盖尺寸
let cachedCover2 = null; // 图2的覆盖尺寸
let cachedPlateX = 0;
let cachedPlateY = 0;
let cachedPlateW = 0;
let cachedPlateH = 0;

// ==== 侧边滚动字幕条 ====
const FONT_PATH = 'VLADIMIR.TTF';
const LEFT_TEXT = 'BLOSSOMS BEFORE ROOTS      QOQ PORTFOLIO      ';
const RIGHT_TEXT = 'CLICK THE CAT BOWL TO BEGIN EXPLORING          ';

let SIDE_FONT;
let SIDE_FONT_SIZE = 15;
let SIDE_TEXT_COLOR = [10, 10, 10, 255];
let SIDE_BAND_WIDTH = 30;
let LEFT_SPEED_PX_S = 40;
let RIGHT_SPEED_PX_S = -30;

// 内部状态
let _offsetLeft = 0;
let _offsetRight = 0;

// ==== 背景2：6个按钮热点（相对 img2 原图的比例 0~1）====
const OPEN_IN_NEW_TAB = false; // true=新标签打开；false=当前页跳转
const HOTSPOTS = [
  // rx, ry = 左上角相对坐标；rw, rh = 相对宽高；url = 跳转地址
  { rx:0.12, ry:0.22, rw:0.10, rh:0.06, url:'work1.html' },
  { rx:0.28, ry:0.22, rw:0.10, rh:0.06, url:'https://example.com/work-2' },
  { rx:0.44, ry:0.22, rw:0.10, rh:0.06, url:'https://example.com/work-3' },
  { rx:0.60, ry:0.22, rw:0.10, rh:0.06, url:'https://example.com/work-4' },
  { rx:0.76, ry:0.22, rw:0.10, rh:0.06, url:'https://example.com/work-5' },
  { rx:0.12, ry:0.34, rw:0.10, rh:0.06, url:'https://example.com/work-6' },
];

// ==== 盘子喷泉动效（替换原“烟花”） ====
let FIREWORKS = [];
let LAST_BURST_MS = 0;
const BURST_INTERVAL_MS = 80;        // 悬浮时更高的喷射频率（越小越连贯）
const FIREWORK_PARTICLES = 12;       // 单次粒子更少，线条更干净

class Firework {
  constructor(x, y) {
    this.particles = [];
    for (let i = 0; i < FIREWORK_PARTICLES; i++) {
      // 向上窄扇形喷射（以 -90° 为中心，±约12.6°）
      const spread = 0.22;
      const ang = -HALF_PI + random(-spread, spread);
      const spd = random(200, 320); // 初速更大，形成喷射感
      this.particles.push({
        x, y,
        vx: cos(ang) * spd,
        vy: sin(ang) * spd,
        prevX: x, prevY: y,         // 记录上一帧位置用于拖尾
        life: 2.0,
        age: 0,
     r: random(240, 255),
g: random(170, 210),
b: random(120, 160),
        a: 215,
        size: random(3, 6)
      });
    }
  }
  update(dt) {
    const g = 1080;      // 重力：上升后自然下落
    const drag = 1.05; // 空气阻力：横向扩散逐步收敛，形状像倒三角
    for (const p of this.particles) {
      p.age += dt;

      // 先保存上帧位置，用于拖尾
      p.prevX = p.x; 
      p.prevY = p.y;

      // 位置积分
      p.x  += p.vx * dt;
      p.y  += p.vy * dt;

      // 阻力 + 重力
      p.vx *= drag;
      p.vy = p.vy * drag + g * dt;

      // 渐隐 & 轻微变细
      const k = 1 - (p.age / p.life);
      p.a = 170 * max(0, k);
      p.size = max(0.6, p.size * 0.98);
    }
    // 只保留还活着的粒子
    this.particles = this.particles.filter(p => p.age < p.life);
    return this.particles.length > 0;
  }
  draw() {
    push();
    blendMode(ADD);
    for (const p of this.particles) {
      // 速度方向拖尾（线条）
      stroke(p.r, p.g, p.b, p.a * 0.8);
      strokeWeight(max(1, p.size * 0.6));
      line(p.prevX, p.prevY, p.x, p.y);
      // 头部亮点
      noStroke();
      fill(p.r, p.g, p.b, p.a);
      ellipse(p.x, p.y, p.size, p.size);
    }
    pop();
  }
}

function preload() {
  img = loadImage(
    IMG1_PATH,
    () => console.log("✅ Image 1 loaded"),
    () => console.error("❌ Failed to load image 1")
  );
  img2 = loadImage(
    IMG2_PATH,
    () => console.log("✅ Image 2 loaded"),
    () => console.error("❌ Failed to load image 2")
  );
  try {
    SIDE_FONT = loadFont(FONT_PATH);
  } catch(e) {
    console.warn('⚠️ 字体未加载，将使用系统默认字体');
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CORNER);
  rectMode(CORNER);
  noCursor();

  // 初始化缓存的尺寸和位置信息
  updateCachedValuesOnly();
  
  // 初始化离屏画布
  initGlowOffscreenCanvas();
  
  // 初始化中间区域的氛围感光晕
  initAmbientGlows();
}

// ==== 初始化离屏画布 ====
function initGlowOffscreenCanvas() {
  const canvasSize = Math.min(width, height) * 0.6; // 略大于光晕区域
  glowOffscreenCanvas = createGraphics(canvasSize, canvasSize);
  glowOffscreenCanvas.imageMode(CENTER);
  glowOffscreenCanvas.noStroke();
  
  // 光标光晕离屏画布
  cursorGlowCanvas = createGraphics(CURSOR_GLOW_SIZE * 2, CURSOR_GLOW_SIZE * 2);
  cursorGlowCanvas.imageMode(CENTER);
  cursorGlowCanvas.noStroke();
}

// ==== 只更新缓存值 ====
function updateCachedValuesOnly() {
  if (img && img.width > 0 && img.height > 0) {
    cachedCover1 = fitCover(img.width, img.height, width, height);
  } else {
    cachedCover1 = { w: width, h: height };
  }
  
  if(img2 && img2.width > 0 && img2.height > 0) {
    cachedCover2 = fitCover(img2.width, img2.height, width, height);
  } else if (img2) {
    cachedCover2 = { w: width, h: height };
  }
  
  // 重新计算盘子位置和尺寸
  cachedPlateX = (width - cachedCover1.w) / 2 + cachedCover1.w * plateRelX;
  cachedPlateY = (height - cachedCover1.h) / 2 + cachedCover1.h * plateRelY;
  cachedPlateW = cachedCover1.w * plateRelW;
  cachedPlateH = cachedCover1.h * plateRelH;
  
  console.log("🔄 缓存值更新完成");
}

// ==== 初始化氛围感光晕 ====
function initAmbientGlows() {
  AMBIENT_GLOW_POSITIONS = [];
  AMBIENT_GLOW_LIFESPANS = [];
  AMBIENT_GLOW_STATIC_FLAGS = [];
  AMBIENT_GLOW_OPACITY_SCALES = [];
  
  const centerX = width / 2;
  const centerY = height / 4;
  const centerRadius = Math.min(width, height) * 0.4;
  
  for (let i = 0; i < AMBIENT_GLOW_COUNT; i++) {
    const angle = random(TWO_PI);
    const radius = random(centerRadius * 0.3, centerRadius);
    const x = centerX + cos(angle) * radius;
    const y = centerY + sin(angle) * radius;
    
    const sizeVariation = random(0.9, 1.1);
    const opacityFactor = random(0.8, 1.2);
    const isStatic = random() < 0.3; // 30% 固定
    
    AMBIENT_GLOW_POSITIONS.push({
      x: x,
      y: y,
      colorIndex: i % AMBIENT_GLOW_COLORS.length,
      baseX: x,
      baseY: y
    });
    
    AMBIENT_GLOW_LIFESPANS.push({
      phase: random(1),
      speed: isStatic ? random(0.05, 0.1) : random(0.2, 0.4),
      sizeFactor: sizeVariation,
      opacityFactor: opacityFactor
    });
    
    AMBIENT_GLOW_STATIC_FLAGS.push(isStatic);
    AMBIENT_GLOW_OPACITY_SCALES.push(random() < 0.3 ? random(1.5, 2.5) : 1);
  }
}

// ==== 更新氛围感光晕的状态 ====
function updateAmbientGlows() {
  ambientGlowFrameCounter++;
  if (ambientGlowFrameCounter < AMBIENT_GLOW_UPDATE_INTERVAL) return;
  ambientGlowFrameCounter = 0;
  
  const dt = deltaTime / 1000;
  
  const centerX = width / 2;
  const centerY = height / 2;
  const centerRadius = Math.min(width, height) * 0.4;
  
  for (let i = 0; i < AMBIENT_GLOW_LIFESPANS.length; i++) {
    const lifespan = AMBIENT_GLOW_LIFESPANS[i];
    lifespan.phase = (lifespan.phase + lifespan.speed * dt) % 1;
    
    const pos = AMBIENT_GLOW_POSITIONS[i];
    const isStatic = AMBIENT_GLOW_STATIC_FLAGS[i];
    
    if (isStatic) {
      pos.x = pos.baseX + sin(frameCount * 0.02 + i) * 2;
      pos.y = pos.baseY + cos(frameCount * 0.02 + i) * 2;
    } else {
      if (random() < 0.01) {
        const angle = random(TWO_PI);
        const radius = random(centerRadius * 0.3, centerRadius);
        pos.x = centerX + cos(angle) * radius;
        pos.y = centerY + sin(angle) * radius;
        pos.baseX = pos.x;
        pos.baseY = pos.y;
      } else {
        pos.x += random(-1, 1);
        pos.y += random(-1, 1);
        const dx = pos.x - centerX;
        const dy = pos.y - centerY;
        const distFromCenter = sqrt(dx*dx + dy*dy);
        if (distFromCenter > centerRadius) {
          pos.x = centerX + (dx / distFromCenter) * centerRadius;
          pos.y = centerY + (dy / distFromCenter) * centerRadius;
        }
      }
    }
  }
}

// ==== 绘制氛围感光晕 ====
function drawAmbientGlows() {
  if (!AMBIENT_GLOW_ENABLED || !glowOffscreenCanvas) return;
  
  const centerX = width / 2;
  const centerY = height / 3;
  const offscreenCenter = glowOffscreenCanvas.width / 2;
  
  glowOffscreenCanvas.clear();
  
  for (let i = 0; i < AMBIENT_GLOW_POSITIONS.length; i++) {
    const pos = AMBIENT_GLOW_POSITIONS[i];
    const lifespan = AMBIENT_GLOW_LIFESPANS[i];
    const color = AMBIENT_GLOW_COLORS[pos.colorIndex];
    const opacityScale = AMBIENT_GLOW_OPACITY_SCALES[i];
    
    const pulse = 0.7 + 0.3 * sin(lifespan.phase * TWO_PI + sin(lifespan.phase * PI * 2));
    const currentSize = AMBIENT_GLOW_BASE_SIZE + (AMBIENT_GLOW_MAX_SIZE - AMBIENT_GLOW_BASE_SIZE) * pulse * lifespan.sizeFactor;
    const currentAlpha = Math.min(255, color[3] * pulse * lifespan.opacityFactor * opacityScale);
    
    const offscreenX = offscreenCenter + (pos.x - centerX);
    const offscreenY = offscreenCenter + (pos.y - centerY);
    
    glowOffscreenCanvas.fill(color[0], color[1], color[2], currentAlpha);
    glowOffscreenCanvas.ellipse(offscreenX, offscreenY, currentSize, currentSize);
    
    if (opacityScale > 1.5) {
      const coreSize = currentSize * 0.6;
      glowOffscreenCanvas.fill(255, 255, 240, currentAlpha * 0.8);
      glowOffscreenCanvas.ellipse(offscreenX, offscreenY, coreSize, coreSize);
    }
  }
  
  push();
  blendMode(ADD);
  drawingContext.filter = `blur(${AMBIENT_GLOW_BLUR}px)`;
  image(
    glowOffscreenCanvas,
    centerX - offscreenCenter,
    centerY - offscreenCenter,
    glowOffscreenCanvas.width,
    glowOffscreenCanvas.height
  );
  drawingContext.filter = 'none';
  pop();
}

function draw() {
  background(0);

  // 确保缓存值始终是最新的
  if (!cachedCover1 || width !== windowWidth || height !== windowHeight) {
    updateCachedValuesOnly();
  }

  if (!img || !cachedCover1) return;

  const img1X = (width - cachedCover1.w) / 2;
  const img1Y = (height - cachedCover1.h) / 2;
  let img2X = 0, img2Y = 0;
  if(cachedCover2) {
      img2X = (width - cachedCover2.w) / 2;
      img2Y = (height - cachedCover2.h) / 2;
  }

  const dt = deltaTime / 1000;

  if (!started) {
    // --- 未开始状态 (背景1) ---
    image(img, img1X, img1Y, cachedCover1.w, cachedCover1.h);
    
    // 中间区域氛围光
    updateAmbientGlows();
    drawAmbientGlows();

    // ========== 盘子光圈：常亮脉动 + 悬浮增强 ==========
    const hover = dist(mouseX, mouseY, cachedPlateX, cachedPlateY) < max(cachedPlateW, cachedPlateH) / 2;
    const basePulse = 0.6 + 0.4 * sin(frameCount * 0.06); // 柔和脉动

    // 基础光圈（总是显示）
    push();
    noStroke();
    const baseAlpha = 120 + 100 * basePulse; // 常亮透明度（可再加大）
    const baseW = cachedPlateW * (1.7 + 0.15 * basePulse);
    const baseH = cachedPlateH * (1.7 + 0.15 * basePulse);
    drawingContext.filter = 'blur(40px)';
    fill(255, 180, 140, baseAlpha);
    ellipse(cachedPlateX, cachedPlateY, baseW, baseH);
    drawingContext.filter = 'none';
    pop();

    // 悬浮时的高亮外圈（只在 hover 时附加）
    if (hover) {
      push();
      noStroke();
      const haloAlpha = 180 + 90 * sin(frameCount * 0.10);
      const glowW = cachedPlateW * 2.1;
      const glowH = cachedPlateH * 2.1;
      drawingContext.filter = 'blur(46px)';
      fill(255, 200, 150, haloAlpha);
      ellipse(cachedPlateX, cachedPlateY, glowW, glowH);
      drawingContext.filter = 'none';
      pop();
    }

    // ========== 悬浮触发喷泉 ==========
    if (hover) {
      const now = millis();
      if (now - LAST_BURST_MS > BURST_INTERVAL_MS) {
        LAST_BURST_MS = now;
        FIREWORKS.push(new Firework(cachedPlateX, cachedPlateY));
      }
    }

    // 更新 & 绘制喷泉
    if (FIREWORKS.length) {
      FIREWORKS = FIREWORKS.filter(fw => {
        const alive = fw.update(dt);
        fw.draw();
        return alive;
      });
    }

    // 侧边滚动字幕
    drawSideMarquee('left');
    drawSideMarquee('right');

  } else {
    // --- 动画已开始 (背景2) ---
    if(img2 && cachedCover2) {
        image(img2, img2X, img2Y, cachedCover2.w, cachedCover2.h);
    } else {
        fill(50);
        rect(0,0,width, height);
        fill(255);
        textAlign(CENTER, CENTER);
        text("Image 2 Loaded", width/2, height/2);
    }

    // 背景2：热点 hover 视觉反馈
    if (cachedCover2 && started) {
      let hovering = false;
      for (const hs of HOTSPOTS) {
        const r = hotspotToRect(hs);
        const isHover = mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h;
        if (isHover) {
          hovering = true;
          push();
          noFill();
          stroke(255, 200, 160, 200);
          strokeWeight(2);
          drawingContext.shadowColor = 'rgba(255,180,140,0.6)';
          drawingContext.shadowBlur = 14;
          rect(r.x, r.y, r.w, r.h, 6);
          pop();
        }
      }
      document.body.style.cursor = hovering ? 'pointer' : 'default';
    }

    // 侧边滚动字幕
    drawSideMarquee('left');
    drawSideMarquee('right');
  }
}

function hotspotToRect(hs) {
  if (!cachedCover2) return {x:0,y:0,w:0,h:0};
  const x = (width - cachedCover2.w) / 2 + hs.rx * cachedCover2.w;
  const y = (height - cachedCover2.h) / 2 + hs.ry * cachedCover2.h;
  const w = hs.rw * cachedCover2.w;
  const h = hs.rh * cachedCover2.h;
  return { x, y, w, h };
}

// 侧边滚动条渲染
function drawSideMarquee(side) {
  const dt = deltaTime / 1000;
  const bandW = SIDE_BAND_WIDTH;
  let x = (side === 'left') ? 0 : (width - bandW);
  if (side === 'left')  _offsetLeft  = wrapOffset(_offsetLeft  + LEFT_SPEED_PX_S  * dt, height);
  if (side === 'right') _offsetRight = wrapOffset(_offsetRight + RIGHT_SPEED_PX_S * dt, height);

  push();
  translate(x + bandW / 2, height / 2);
  if (side === 'left') {
    rotate(-HALF_PI);
  } else {
    rotate(HALF_PI);
  }
  textFont(SIDE_FONT || 'sans-serif');
  textSize(SIDE_FONT_SIZE);
  fill(...SIDE_TEXT_COLOR);
  textAlign(LEFT, CENTER);
  const content = (side === 'left') ? LEFT_TEXT : RIGHT_TEXT;
  const tw = textWidth(content);
  let off = (side === 'left') ? _offsetLeft : _offsetRight;
  let startX = -height / 2 + off;
  for (let pos = startX; pos < height / 2 + tw; pos += tw) {
    text(content, pos, 0);
  }
  pop();

  if (CURSOR_ENABLED) drawGlowCursor();
}

function wrapOffset(v, cycleLen) {
  if (cycleLen <= 0) return 0;
  v = v % cycleLen;
  if (v > 0) v -= cycleLen;
  return v;
}

function drawGlowCursor() {
  push();
  if (CURSOR_ADD_MODE) blendMode(ADD);
  noStroke();
  drawingContext.filter = `blur(${CURSOR_BLUR_PX}px)`; // 外部发光
  fill(CURSOR_COLOR[0], CURSOR_COLOR[1], CURSOR_COLOR[2], CURSOR_COLOR[3]);
  ellipse(mouseX, mouseY, CURSOR_GLOW_SIZE, CURSOR_GLOW_SIZE);
  drawingContext.filter = 'none';
  fill(CURSOR_COLOR[0], CURSOR_COLOR[1], CURSOR_COLOR[2], 255); // 中心点
  ellipse(mouseX, mouseY, CURSOR_CORE_SIZE, CURSOR_CORE_SIZE);
  pop();
}

function mousePressed() {
  if (!started) {
    // 点击检测应基于视觉上固定的位置 (原始盘子位置)
    let inside = dist(mouseX, mouseY, cachedPlateX, cachedPlateY) < max(cachedPlateW, cachedPlateH) / 2;
    if (inside) {
      console.log("🖱️ 点击盘子，跳转到背景2和按钮页面");
      window.location.href = "page2.html"; // 跳转到新页面
    }
  }
}

function fitCover(iw, ih, cw, ch) {
  const ir = iw / ih;
  const cr = cw / ch;
  let w, h;
  if (ir > cr) {
    h = ch;
    w = h * ir;
  } else {
    w = cw;
    h = w / ir;
  }
  return { w, h };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cachedCover1 = null; // 重置缓存
  cachedCover2 = null;
  updateCachedValuesOnly();
  initGlowOffscreenCanvas();
}
