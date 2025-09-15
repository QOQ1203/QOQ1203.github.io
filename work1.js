// ==== 自定义光晕鼠标 ====
let CURSOR_ENABLED   = true;
let CURSOR_COLOR     = [255, 180, 140, 180];
let CURSOR_CORE_SIZE = 0;
let CURSOR_GLOW_SIZE = 30;
let CURSOR_BLUR_PX   = 10;
let CURSOR_ADD_MODE  = true;
// 整体纵向偏移（负值=整体上移）——你说“向上移动一点”
const SHIFT_Y = -42; // 自己调：-20、-40……想移多少就改多少

// ==== 三张背景图（依次垂直拼接）====
const BG1_PATH = "work1_画板 1 副本 2.jpg"; // 你的原背景1
const BG2_PATH = "w1_画板 1 副本 3.jpg";            // ← 替换为你的背景2文件
const BG3_PATH = "背景_画板 1 副本 4.jpg";

let bgImgs = [null, null, null];  // [p5.Image, ...]
let sections = [];                // 每段的 {img, x, y, w, h}

// ==== 视频（相对背景1区域）====
const VIDEO_PATH  = "8(1).mp4";
let myVideo = null;
let isPlaying = false;
let hasPosterFrame = false;
let priming = false;

// 相对坐标（基于“背景1按宽度等比缩放后的区域尺寸”）
let videoRelX = 0.55;
let videoRelY = 0.18;
let videoRelW = 0.23;
let videoRelH = 0.6;
// ==== 长图相关 ====
let longImg;
let scrollX = 0;       // 当前偏移
let scrollDir = 1;     // 滚动方向：1=向右，-1=向左
let scrollSpeed = 1;   // 每帧滚动速度（像素）
let currentSection = 0;  // 0=背景1，1=背景2，2=背景
let longImgH, longImgV;   // 背景3用的水平和垂直长图

// 滚动状态
let scrollX3 = 0, dirX3 = 1;
let scrollY3 = 0, dirY3 = 1;

function preload() {
  bgImgs[0] = loadImage(BG1_PATH);
  bgImgs[1] = loadImage(BG2_PATH);
  bgImgs[2] = loadImage(BG3_PATH);
  longImg = loadImage("滚动w1_画板 1 副本 5.png"); // 你的长图
  longImgH = loadImage("背景-07.png"); // 你的横向长图  
  longImgV = loadImage("背景_画板 1 副本 5.png");

}

function setup() {
  // 先创建个占位画布；真正尺寸在 layoutSections() 里决定
  createCanvas(windowWidth, 200);
  imageMode(CORNER);
  noCursor();
  noStroke();

  // 视频
  myVideo = createVideo(VIDEO_PATH, () => {
    myVideo.attribute('playsinline', '');
    myVideo.attribute('preload', 'auto');
    myVideo.elt.muted = true;
    myVideo.volume(0);
    myVideo.hide();
    autoPrimeFirstFrame();
  });

  myVideo.onended(() => {
    isPlaying = false;
    try { myVideo.time(0.01); } catch(e) {}
    myVideo.pause();
    hasPosterFrame = true;
  });

  layoutSections(); // 计算三段布局并调整画布高度
}

function draw() {
  background("#1F2020");

  // 绘制三段背景（加入整体上移 SHIFT_Y）
  for (const s of sections) {
    if (s.img) image(s.img, s.x, s.y + SHIFT_Y, s.w, s.h);
  }
  


  // 在背景1里绘制视频 / 播放按钮（同样加 SHIFT_Y）
  const s1 = sections[0];
  if (s1) {
    const { vx, vy, vw, vh } = videoRectInSection(s1); // 内部已考虑 SHIFT_Y
    if (isPlaying || hasPosterFrame) {
      image(myVideo, vx, vy, vw, vh);
    }
    if (!isPlaying) {
      push();
      noStroke();
      const btnSize = Math.min(vw, vh) * 0.1;
      const cx = vx + vw/2, cy = vy + vh/2;
      fill(255,255,255,160);
      ellipse(cx, cy, btnSize * 1.2);
      fill(255,180,140,200);
      beginShape();
      vertex(cx - btnSize*0.25, cy - btnSize*0.4);
      vertex(cx - btnSize*0.25, cy + btnSize*0.4);
      vertex(cx + btnSize*0.45, cy);
      endShape(CLOSE);
      pop();
    }
  }
// ==== 在背景2右上角绘制选区 ====
const s2 = sections[1];
if (s2 && longImg) {
    const selW = s2.w * 0.65; // 选区宽度（相对背景2宽度的65%）
    const selH = s2.h * 0.7;  // 选区高度（相对背景2高度的70%）
    const selX = s2.x + s2.w - selW; // 完全相对位置，右对齐
    const selY = s2.y - 50;  // 上移50像素

    // --- 裁剪区域 ---
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(selX, selY, selW, selH);
    drawingContext.clip();

    // --- 缩放图片，保持比例 ---
    // 基于选区高度自适应缩放，稍微放大10%
    let scale = (selH / longImg.height) * 1.1;
    let dispW = longImg.width * scale;
    let dispH = longImg.height * scale;
let pauseZoneX1 = selX + selW * 0.25;
let pauseZoneX2 = selX + selW * 0.75;
let pauseZoneY1 = selY+selH*0.4;
let pauseZoneY2 = selY + selH*0.8;

let inZone = (mouseX > pauseZoneX1 && mouseX < pauseZoneX2 &&
              mouseY > pauseZoneY1 && mouseY < pauseZoneY2);
  // --- 绘制长图 ---
  image(longImg, selX - scrollX, selY, dispW, dispH);

  drawingContext.restore();



  if (!inZone) {   // 鼠标不在暂停区 → 自动滚动
  scrollX += scrollDir * scrollSpeed;

  // 到边缘时掉头
  if (scrollX <= 0) {
    scrollX = 0;
    scrollDir = 1;
  }
  if (scrollX >= dispW - selW) {
    scrollX = dispW - selW;
    scrollDir = -1;
  
  }}
}
const s3 = sections[2];
if (s3) {
  // === 横向滚动选区 ===
  const hSelW = s3.w * 0.7;  // 选区宽度（相对背景3宽度的70%）
  const hSelH = s3.h * 0.4;  // 选区高度（相对背景3高度的40%）
  const hSelX = s3.x + s3.w * 0.35;  // 相对位置（距离左侧35%宽度）
  const hSelY = s3.y + SHIFT_Y + s3.h * 0.2;  // 相对位置（距离顶部20%高度）

  drawScrollAreaH(longImgH, hSelX, hSelY, hSelW, hSelH);

  // === 纵向滚动选区 ===
  const vSelW = s3.w * 0.15;  // 选区宽度（相对背景3宽度的15%）
  const vSelH = s3.h * 0.5;   // 选区高度（相对背景3高度的50%）
  const vSelX = s3.x;  // 完全相对位置，左对齐
  const vSelY = s3.y + SHIFT_Y;

  drawScrollAreaV(longImgV, vSelX, vSelY, vSelW, vSelH);
}
  if (CURSOR_ENABLED) drawGlowCursor();
}


function mousePressed() {
  const s1 = sections[0];
  if (!s1) return;
  const { vx, vy, vw, vh } = videoRectInSection(s1);

  // 点在视频区域
  if (mouseX > vx && mouseX < vx + vw && mouseY > vy && mouseY < vy + vh) {
    if (!hasPosterFrame && !priming) {
      primeOnUserGesture(() => { isPlaying = false; });
      return;
    }
    if (!isPlaying) {
      myVideo.elt.muted = false;
      myVideo.volume(1);
      isPlaying = true;
      myVideo.play();
    } else {
      if (myVideo.elt.paused) { myVideo.play(); isPlaying = true; }
      else { myVideo.pause(); isPlaying = false; }
    }
  }
}

// 计算三段布局：每张图“按页面宽度等比缩放”，上下拼接
function layoutSections() {
  sections = [];
  let accY = 0;
  const cw = windowWidth;

  for (const img of bgImgs) {
    if (!img || img.width === 0 || img.height === 0) {
      const h = windowHeight;
      sections.push({ img:null, x:0, y:accY, w:cw, h:h });
      accY += h;
      continue;
    }
    const scale = cw / img.width;     // 等宽缩放
    // 关键：向上取整并加 1px 出血，避免右/下边缘漏底
    const w = Math.ceil(cw) + 1;
    const h = Math.ceil(img.height * scale) + 1;

    const x = 0;
    const y = accY;
    sections.push({ img, x, y, w, h });
    accY += h;
  }

  // 画布总高也要考虑上移后的可滚动空间（SHIFT_Y 可能是负数）
  const totalH = Math.max(1, Math.ceil(accY + Math.max(0, -SHIFT_Y)));
  resizeCanvas(cw, totalH, false);
}


// 计算“视频区域”的像素矩形（位于背景1 section 内）
function videoRectInSection(section) {
  const vx = section.x + section.w * videoRelX;
  const vy = section.y + section.h * videoRelY;
  const vw = section.w * videoRelW;
  const vh = section.h * videoRelH;
  return { vx, vy, vw, vh };
}

// 自动 prime 首帧：loadedmetadata → seek(0.01) → seeked → pause
let primingOnce = false;
function autoPrimeFirstFrame() {
  if (!myVideo || primingOnce) return;
  primingOnce = true;

  const v = myVideo.elt;
  const onSeeked = () => {
    v.removeEventListener('seeked', onSeeked);
    myVideo.pause();
    hasPosterFrame = true;
    priming = false;
  };
  const onMeta = () => {
    v.removeEventListener('loadedmetadata', onMeta);
    priming = true;
    const p = myVideo.play();
    const doSeek = () => {
      try { myVideo.time(0.01); } catch(e) {}
      v.addEventListener('seeked', onSeeked, { once:true });
    };
    if (p && typeof p.then === 'function') p.then(() => { doSeek(); myVideo.pause(); })
                                            .catch(() => { doSeek(); myVideo.pause(); });
    else { doSeek(); myVideo.pause(); }
  };

  if (v.readyState >= 1) onMeta(); else v.addEventListener('loadedmetadata', onMeta, { once:true });
}
function mouseWheel(event) {
  if (event.deltaY > 0) {
    // 向下滚
    if (currentSection < sections.length - 1) {
      currentSection++;
      jumpToSection(currentSection);
    }
  } else {
    // 向上滚
    if (currentSection > 0) {
      currentSection--;
      jumpToSection(currentSection);
    }
  }
  return false; // 阻止默认滚动
}

// 跳到指定 section
function jumpToSection(index) {
  if (index >= 0 && index < sections.length) {
    const targetY = sections[index].y + SHIFT_Y; // 该段的顶部 Y 坐标
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'  // 平滑滚动
    });
  }
}
// 用户手势 prime（iOS 等严格环境的兜底）
function primeOnUserGesture(cb) {
  if (!myVideo) return;
  priming = true;
  const v = myVideo.elt;
  const done = () => { priming = false; hasPosterFrame = true; if (cb) cb(); };
  const p = myVideo.play();
  const doSeek = () => {
    try { myVideo.time(0.01); } catch(e) {}
    v.addEventListener('seeked', () => { myVideo.pause(); done(); }, { once:true });
  };
  if (p && typeof p.then === 'function') p.then(() => { doSeek(); }).catch(() => { doSeek(); });
  else { doSeek(); }
}
function drawScrollAreaH(img, x, y, w, h) {
  if (!img) return;

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(x, y, w, h);
  drawingContext.clip();

  // 计算显示大小（缩放因子）
  let scale = h / img.height;   // 高度适应选区
  let dispW = img.width * scale;
  let dispH = img.height * scale;

  image(img, x - scrollX3, y, dispW, dispH);

  drawingContext.restore();

  // 鼠标检测
  let inZone = (mouseX > x && mouseX < x + w &&
                mouseY > y && mouseY < y + h);

  if (!inZone) {
    scrollX3 += dirX3 * 1.5;   // 速度 1.5
    if (scrollX3 <= 0) { scrollX3 = 0; dirX3 = 1; }
    if (scrollX3 >= dispW - w) { scrollX3 = dispW - w; dirX3 = -1; }
  }
}
function drawScrollAreaV(img, x, y, w, h) {
  if (!img) return;

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(x, y, w, h);
  drawingContext.clip();

  // 让宽度适应选区
  let scale = w / img.width;
  let dispW = img.width * scale;
  let dispH = img.height * scale;

  // --- 核心改动：绘制两份，循环衔接 ---
  let offset = scrollY3 % dispH;  // 始终保持在 [0, dispH) 范围

  image(img, x, y - offset, dispW, dispH);        // 第一张
  image(img, x, y - offset + dispH, dispW, dispH); // 第二张接在后面

  drawingContext.restore();

  // 鼠标检测：鼠标在区域内时暂停
  let inZone = (mouseX > x && mouseX < x + w &&
                mouseY > y && mouseY < y + h);

  if (!inZone) {
    scrollY3 += 5;   // 设置速度，正值=往下滚，负值=往上滚
  }
}

// 发光鼠标
function drawGlowCursor() {
  push();
  if (CURSOR_ADD_MODE) blendMode(ADD); else blendMode(BLEND);
  drawingContext.filter = `blur(${CURSOR_BLUR_PX}px)`;
  fill(CURSOR_COLOR[0], CURSOR_COLOR[1], CURSOR_COLOR[2], CURSOR_COLOR[3]);
  ellipse(mouseX, mouseY, CURSOR_GLOW_SIZE, CURSOR_GLOW_SIZE);
  drawingContext.filter = 'none';
  fill(CURSOR_COLOR[0], CURSOR_COLOR[1], CURSOR_COLOR[2], 255);
  ellipse(mouseX, mouseY, CURSOR_CORE_SIZE, CURSOR_CORE_SIZE);
  pop();
}

function windowResized() {
  layoutSections(); // 宽度变化时，三段重新等宽排布并更新总高度
}
