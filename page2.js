// ==== 自定义光晕鼠标参数 ====
let CURSOR_ENABLED = true;     // 开关
let CURSOR_COLOR = [255, 180, 140, 180]; // [r,g,b,a] 颜色（可改）
let CURSOR_CORE_SIZE = 0;      // 中心圆半径（像素）
let CURSOR_GLOW_SIZE = 40;     // 外发光直径（像素，越大越扩散）
let CURSOR_BLUR_PX = 10;       // 模糊半径（像素）
let CURSOR_ADD_MODE = true;    // 是否使用叠加混合让光更亮

// ==== 中间区域氛围感光晕参数（范围更小）====
let AMBIENT_GLOW_ENABLED = true; // 开关
let AMBIENT_GLOW_COUNT = 5;      // 减少光晕数量，缩小范围
let AMBIENT_GLOW_BASE_SIZE = 5;  // 基础尺寸
let AMBIENT_GLOW_MAX_SIZE = 15;  // 最大尺寸，比原效果小
let AMBIENT_GLOW_COLORS = [      // 光晕颜色集合 - 亮暖色调
  [255, 255, 220, 200],  // 亮黄白色
  [255, 240, 200, 180],  // 亮米黄色
  [255, 220, 180, 160]   // 亮橘黄色
];
let AMBIENT_GLOW_BLUR = 15;      // 模糊半径，比原效果小
let AMBIENT_GLOW_POSITIONS = []; // 存储每个光晕的位置和属性
let AMBIENT_GLOW_LIFESPANS = []; // 存储每个光晕的生命周期信息
let AMBIENT_GLOW_STATIC_FLAGS = []; // 标记哪些光晕是固定的
let AMBIENT_GLOW_OPACITY_SCALES = []; // 每个光晕的不透明度缩放值

// 性能优化参数
let AMBIENT_GLOW_UPDATE_INTERVAL = 3; // 每隔多少帧更新一次光晕位置
let ambientGlowFrameCounter = 0; // 帧计数器，用于控制更新频率
let glowOffscreenCanvas; // 离屏画布，用于批量处理模糊效果

// ==== 背景2图片 ====
let img2;
const IMG2_PATH = "微信图片_20250907202929_43_2.jpg";

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

// ==== 6个按钮热点（相对 img2 原图的比例 0~1）====
const OPEN_IN_NEW_TAB = false; // true=新标签打开；false=当前页跳转
const HOTSPOTS = [
  // rx, ry = 左上角相对坐标；rw, rh = 相对宽高；url = 跳转地址
  { rx:0.12, ry:0.28, rw:0.18, rh:0.06, url:'work1.html' },
  { rx:0.755, ry:0.28, rw:0.15, rh:0.06, url:'work2.html' },
  { rx:0.08,ry:0.435,rw:0.12, rh:0.06, url:'work3.html' },
  { rx:0.82, ry:0.44, rw:0.10, rh:0.06, url:'work4.html' },
  { rx:0.06, ry:0.58, rw:0.06, rh:0.06, url:'work5.html' },
  
];

// 缓存的计算结果
let cachedCover2 = null; // 图2的覆盖尺寸

function preload() {
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
  
  // 初始化离屏画布，用于批量处理光晕的模糊效果
  initGlowOffscreenCanvas();
  
  // 初始化中间区域的氛围感光晕
  initAmbientGlows();
}

// ==== 只更新缓存值 ====
function updateCachedValuesOnly() {
  if (!img2 || img2.width === 0 || img2.height === 0) return;
  
  cachedCover2 = fitCover(img2.width, img2.height, width, height);
  
  console.log("🔄 缓存值更新完成");
}

// ==== 初始化离屏画布 ====
function initGlowOffscreenCanvas() {
  // 计算需要的离屏画布尺寸，范围更小
  const canvasSize = Math.min(width, height) * 0.3; // 比原效果小一半左右
  glowOffscreenCanvas = createGraphics(canvasSize, canvasSize);
  glowOffscreenCanvas.imageMode(CENTER);
  glowOffscreenCanvas.noStroke();
}

// ==== 初始化氛围感光晕 ====
function initAmbientGlows() {
  AMBIENT_GLOW_POSITIONS = [];
  AMBIENT_GLOW_LIFESPANS = [];
  AMBIENT_GLOW_STATIC_FLAGS = [];
  AMBIENT_GLOW_OPACITY_SCALES = [];
  
  // 计算屏幕中心区域 - 范围更小
  const centerX = width / 2;
  const centerY = height / 3;
  const centerRadius = Math.min(width, height) * 0.2; // 比原效果小一半左右
  
  for (let i = 0; i < AMBIENT_GLOW_COUNT; i++) {
    // 随机生成中心区域内的位置（使用极坐标以确保在圆形区域内）
    const angle = random(TWO_PI);
    const radius = random(centerRadius * 0.3, centerRadius); // 偏向中心区域
    const x = centerX + cos(angle) * radius;
    const y = centerY + sin(angle) * radius;
    
    // 随机初始大小和透明度变化参数
    const sizeVariation = random(0.9, 1.1);
    const opacityFactor = random(0.8, 1.2);
    const isStatic = random() < 0.4; // 40% 的光晕是固定的，比原效果多
    
    AMBIENT_GLOW_POSITIONS.push({
      x: x,
      y: y,
      colorIndex: i % AMBIENT_GLOW_COLORS.length,
      baseX: x, // 保存基础位置，用于固定光晕的微小摆动
      baseY: y
    });
    
    // 生命周期信息，用于不规则闪烁效果
    AMBIENT_GLOW_LIFESPANS.push({
      phase: random(1), // 初始相位
      speed: isStatic ? random(0.05, 0.1) : random(0.2, 0.4), // 固定光晕变化更慢
      sizeFactor: sizeVariation,
      opacityFactor: opacityFactor
    });
    
    // 标记是否为固定光晕
    AMBIENT_GLOW_STATIC_FLAGS.push(isStatic);
    
    // 为每个光晕设置不透明度缩放值，部分光晕设置更高值以增强过曝感
    AMBIENT_GLOW_OPACITY_SCALES.push(random() < 0.4 ? random(1.5, 2.5) : 1);
  }
}

// ==== 更新氛围感光晕的状态 ====
function updateAmbientGlows() {
  // 只在特定帧更新光晕状态，减少计算量
  ambientGlowFrameCounter++;
  if (ambientGlowFrameCounter < AMBIENT_GLOW_UPDATE_INTERVAL) {
    return;
  }
  ambientGlowFrameCounter = 0;
  
  const dt = deltaTime / 1000;
  
  // 预先计算中心位置和半径，避免重复计算
  const centerX = width / 2;
  const centerY = height / 3;
  const centerRadius = Math.min(width, height) * 0.2; // 范围更小
  
  for (let i = 0; i < AMBIENT_GLOW_LIFESPANS.length; i++) {
    const lifespan = AMBIENT_GLOW_LIFESPANS[i];
    // 仅更新相位，所有光晕共用这个计算
    lifespan.phase = (lifespan.phase + lifespan.speed * dt) % 1;
    
    const pos = AMBIENT_GLOW_POSITIONS[i];
    const isStatic = AMBIENT_GLOW_STATIC_FLAGS[i];
    
    if (isStatic) {
      // 固定光晕：只进行微小的摆动，不改变整体位置
      pos.x = pos.baseX + sin(frameCount * 0.02 + i) * 1.5; // 摆动幅度更小
      pos.y = pos.baseY + cos(frameCount * 0.02 + i) * 1.5;
    } else {
      // 变化光晕：有更大的随机移动范围
      if (random() < 0.01) { // 低概率更新位置，使变化更自然
        const angle = random(TWO_PI);
        const radius = random(centerRadius * 0.3, centerRadius);
        pos.x = centerX + cos(angle) * radius;
        pos.y = centerY + sin(angle) * radius;
        pos.baseX = pos.x; // 更新基础位置
        pos.baseY = pos.y;
      } else {
        // 平时进行微小的随机移动
        pos.x += random(-0.8, 0.8); // 移动幅度更小
        pos.y += random(-0.8, 0.8);
        
        // 确保不超出中心区域
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
  
  // 计算光晕区域的中心点，用于离屏画布的定位
  const centerX = width / 2;
  const centerY = height / 3;
  const offscreenCenter = glowOffscreenCanvas.width / 2;
  
  // 清空离屏画布
  glowOffscreenCanvas.clear();
  
  // 先在离屏画布上绘制所有光晕，不使用模糊
  for (let i = 0; i < AMBIENT_GLOW_POSITIONS.length; i++) {
    const pos = AMBIENT_GLOW_POSITIONS[i];
    const lifespan = AMBIENT_GLOW_LIFESPANS[i];
    const color = AMBIENT_GLOW_COLORS[pos.colorIndex];
    const opacityScale = AMBIENT_GLOW_OPACITY_SCALES[i];
    
    // 使用更复杂的正弦函数组合创建更自然的不规则闪烁效果
    const pulse = 0.7 + 0.3 * sin(lifespan.phase * TWO_PI + sin(lifespan.phase * PI * 2));
    
    // 计算当前尺寸和透明度
    const currentSize = AMBIENT_GLOW_BASE_SIZE + (AMBIENT_GLOW_MAX_SIZE - AMBIENT_GLOW_BASE_SIZE) * pulse * lifespan.sizeFactor;
    
    // 增强过曝效果，使光晕中心更亮
    const currentAlpha = Math.min(255, color[3] * pulse * lifespan.opacityFactor * opacityScale);
    
    // 计算光晕在离屏画布上的位置
    const offscreenX = offscreenCenter + (pos.x - centerX);
    const offscreenY = offscreenCenter + (pos.y - centerY);
    
    // 在离屏画布上绘制光晕
    glowOffscreenCanvas.fill(color[0], color[1], color[2], currentAlpha);
    glowOffscreenCanvas.ellipse(offscreenX, offscreenY, currentSize, currentSize);
    
    // 对于高亮度的光晕，额外绘制一个更亮的中心点
    if (opacityScale > 1.5) {
      const coreSize = currentSize * 0.6;
      glowOffscreenCanvas.fill(255, 255, 240, currentAlpha * 0.8);
      glowOffscreenCanvas.ellipse(offscreenX, offscreenY, coreSize, coreSize);
    }
  }
  
  // 在主画布上绘制离屏画布，一次性应用模糊效果
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

  if (!img2 || !cachedCover2) return;

  const img2X = (width - cachedCover2.w) / 2;
  const img2Y = (height - cachedCover2.h) / 2;

  // 绘制背景图2
  image(img2, img2X, img2Y, cachedCover2.w, cachedCover2.h);
  
  // 更新和绘制中间区域氛围感光晕
  updateAmbientGlows();
  drawAmbientGlows();
  
  // 背景2：热点 hover（提供视觉反馈）
  let hovering = false;
  for (const hs of HOTSPOTS) {
    const r = hotspotToRect(hs);
    const isHover = mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h;
    if (isHover) {
      hovering = true;
      push();
      // 设置叠加混合模式
      blendMode(HARD_LIGHT);
      // 设置为填充模式
      noStroke();
      // 添加高斯模糊柔光效果
      drawingContext.filter = "blur(8px)";
      fill(255, 200, 160, 180); // 粉橘填充
      // 绘制扁椭圆（宽保持不变，高变为0.7倍）
      ellipse(r.x + r.w/2, r.y + r.h/2, r.w, r.h * 0.7);
      drawingContext.filter = 'none';
      pop();
    }
  }
  
  // hover 时把系统指针改成手型
  if (hovering) {
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'default';
  }
  
  // 绘制侧边滚动字幕
  drawSideMarquee('left');
  drawSideMarquee('right');
  
  // 绘制自定义光标
  if (CURSOR_ENABLED) drawGlowCursor();
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
}

function wrapOffset(v, cycleLen) {
  if (cycleLen <= 0) return 0;
  v = v % cycleLen;
  if (v > 0) v -= cycleLen;
  return v;
};


function drawGlowCursor() {
  push();
  // 可选：让光更亮（叠加混合）
  if (CURSOR_ADD_MODE) blendMode(ADD);

  // --- 先画外部发光（模糊圈） ---
  noStroke();
  drawingContext.filter = "blur(" + CURSOR_BLUR_PX + "px)";
  fill(CURSOR_COLOR[0], CURSOR_COLOR[1], CURSOR_COLOR[2], CURSOR_COLOR[3]);
  // 用椭圆画一个"发光圈"，尺寸稍大
  ellipse(mouseX, mouseY, CURSOR_GLOW_SIZE, CURSOR_GLOW_SIZE);

  // --- 再画中心实心点（不模糊，更锐利） ---
  drawingContext.filter = 'none';
  fill(CURSOR_COLOR[0], CURSOR_COLOR[1], CURSOR_COLOR[2], 255);
  ellipse(mouseX, mouseY, CURSOR_CORE_SIZE, CURSOR_CORE_SIZE);

  pop();
}

function mousePressed() {
  // 背景2：点击热点跳转
  if (cachedCover2) {
    for (const hs of HOTSPOTS) {
      const r = hotspotToRect(hs);
      if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
        if (OPEN_IN_NEW_TAB) {
          window.open(hs.url, '_blank', 'noopener'); // 新标签
        } else {
          window.location.href = hs.url;              // 当前页
        }
        return;
      }
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
  updateCachedValuesOnly(); // 这会自动更新缓存
  // 重新初始化离屏画布，确保在窗口大小变化时仍能正确显示
  initGlowOffscreenCanvas();
}