// ==== 自定义光晕鼠标参数 ====
let CURSOR_ENABLED = true;     // 开关
let CURSOR_COLOR = [255, 180, 140, 180]; // [r,g,b,a] 颜色（可改）
let CURSOR_CORE_SIZE = 0;      // 中心圆半径（像素）
let CURSOR_GLOW_SIZE = 40;     // 外发光直径（像素，越大越扩散）
let CURSOR_BLUR_PX = 10;       // 模糊半径（像素）
let CURSOR_ADD_MODE = true;    // 是否使用叠加混合让光更亮

// ==== 背景2图片 ====
let img2;
const IMG2_PATH = "微信图片_20250907202929_43_2.jpg";

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
  if (!img2 || img2.width === 0 || img2.height === 0) return;
  
  cachedCover2 = fitCover(img2.width, img2.height, width, height);
  
  console.log("🔄 缓存值更新完成");
}

function draw() {
  background(0);

  if (!img2 || !cachedCover2) return;

  const img2X = (width - cachedCover2.w) / 2;
  const img2Y = (height - cachedCover2.h) / 2;

  // 绘制背景图2
  image(img2, img2X, img2Y, cachedCover2.w, cachedCover2.h);
  
  // 背景2：热点 hover（提供视觉反馈）
  let hovering = false;
  for (const hs of HOTSPOTS) {
    const r = hotspotToRect(hs);
    const isHover = mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h;
    if (isHover) {
      hovering = true;
      push();
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
}