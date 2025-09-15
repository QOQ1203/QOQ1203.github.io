// 全局变量部分
let img, img2; // 背景图1 和 背景图2
const IMG1_PATH = "背景_画板 1.jpg";
const IMG2_PATH = "微信图片_20250907202929_43_2.jpg"; // 请替换为你的第二张图片路径
// ==== 自定义光晕鼠标参数 ====
let CURSOR_ENABLED = true;     // 开关
let CURSOR_COLOR = [255, 180, 140, 180]; // [r,g,b,a] 颜色（可改）
let CURSOR_CORE_SIZE = 6;      // 中心圆半径（像素）
let CURSOR_GLOW_SIZE = 40;     // 外发光直径（像素，越大越扩散）
let CURSOR_BLUR_PX = 20;       // 模糊半径（像素）
let CURSOR_ADD_MODE = true;    // 是否使用叠加混合让光更亮
 
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
}

// ==== 只更新缓存值 ====
function updateCachedValuesOnly() {
  if (!img || img.width === 0 || img.height === 0) return;
  
  cachedCover1 = fitCover(img.width, img.height, width, height);
  if(img2 && img2.width > 0 && img2.height > 0) {
      cachedCover2 = fitCover(img2.width, img2.height, width, height);
  }
  cachedPlateX = (width - cachedCover1.w) / 2 + cachedCover1.w * plateRelX;
  cachedPlateY = (height - cachedCover1.h) / 2 + cachedCover1.h * plateRelY;
  cachedPlateW = cachedCover1.w * plateRelW;
  cachedPlateH = cachedCover1.h * plateRelH;
  
  console.log("🔄 缓存值更新完成");
}

function draw() {
  background(0);

  if (!img || !cachedCover1) return;

  const img1X = (width - cachedCover1.w) / 2;
  const img1Y = (height - cachedCover1.h) / 2;
  let img2X = 0, img2Y = 0;
  if(cachedCover2) {
      img2X = (width - cachedCover2.w) / 2;
      img2Y = (height - cachedCover2.h) / 2;
  }

  if (!started) {
    // --- 未开始状态 (背景1) ---
    
    // 1. 绘制清晰的背景图像
    image(img, img1X, img1Y, cachedCover1.w, cachedCover1.h);

    // --- 绘制前景 (盘子光环和侧边栏) ---
    // 绘制粉色盘子光环效果 (始终绘制)
    let hover = dist(mouseX, mouseY, cachedPlateX, cachedPlateY) < max(cachedPlateW, cachedPlateH) / 2;
    if (hover) {
      push();
      noStroke();
      let alpha = 120 + 80 * sin(frameCount * 0.06);
      let glowW = cachedPlateW * 2.0;
      let glowH = cachedPlateH * 2.0;
      drawingContext.filter = 'blur(40px)';
      fill(255, 180, 140, alpha); 
      ellipse(cachedPlateX, cachedPlateY, glowW, glowH);
      drawingContext.filter = 'none';
      pop();
    }
    
    // 绘制侧边滚动字幕 (始终绘制)
    drawSideMarquee('left');
    drawSideMarquee('right');
    
  } else {
    // --- 动画已开始 (背景2) ---
    // 直接绘制背景图2，不应用任何动态模糊
    if(img2 && cachedCover2) {
        image(img2, img2X, img2Y, cachedCover2.w, cachedCover2.h);
    } else {
        // 图2加载失败或未加载时的占位符
        fill(50);
        rect(0,0,width, height);
        fill(255);
        textAlign(CENTER, CENTER);
        text("Image 2 Loaded", width/2, height/2);
    }
    // 背景2：热点 hover（可删除这段，仅用于视觉反馈）
if (cachedCover2 && started) {
  let hovering = false;
  for (const hs of HOTSPOTS) {
    const r = hotspotToRect(hs);
    const isHover = mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h;
    if (isHover) {
      hovering = true;
      push();
      noFill();
      stroke(255, 200, 160, 200); // 粉橘描边
      strokeWeight(2);
      drawingContext.shadowColor = 'rgba(255,180,140,0.6)';
      drawingContext.shadowBlur = 14;
      rect(r.x, r.y, r.w, r.h, 6);
      pop();
    }
  }
  // 可选：hover 时把系统指针改成手型（不影响你自定义光标）
  if (hovering) {
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'default';
  }
}

    // 在显示图2时也绘制侧边滚动字幕
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
  // 可选：让光更亮（叠加混合）
  if (CURSOR_ADD_MODE) blendMode(ADD);

  // --- 先画外部发光（模糊圈） ---
  noStroke();
  drawingContext.filter = `blur(${CURSOR_BLUR_PX}px)`; // 模糊
  fill(CURSOR_COLOR[0], CURSOR_COLOR[1], CURSOR_COLOR[2], CURSOR_COLOR[3]);
  // 用椭圆画一个“发光圈”，尺寸稍大
  ellipse(mouseX, mouseY, CURSOR_GLOW_SIZE, CURSOR_GLOW_SIZE);

  // --- 再画中心实心点（不模糊，更锐利） ---
  drawingContext.filter = 'none';
  fill(CURSOR_COLOR[0], CURSOR_COLOR[1], CURSOR_COLOR[2], 255);
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
  updateCachedValuesOnly(); // 这会自动更新缓存
}



