// ==== 自定义光晕鼠标 ====
let CURSOR_ENABLED   = true;
let CURSOR_COLOR     = [255, 180, 140, 180];
let CURSOR_CORE_SIZE = 0;
let CURSOR_GLOW_SIZE = 30;
let CURSOR_BLUR_PX   = 10;
let CURSOR_ADD_MODE  = true;
// 整体纵向偏移（负值=整体上移）
const SHIFT_Y = -51
// ==== 单张背景图 ====
const BG_PATH = "3_画板 1 副本 6.jpg";

let bgImg = null;            // 存储加载的图片
let section = null;          // 图片区域的 {img, x, y, w, h}

// ==== 视频（相对背景区域）====
// const VIDEO_PATH  = "11月15日 (2)(1).mp4";
const VIDEO_PATH  = "11月15日 (2)(1)(1).mp4"
let myVideo = null;
let isPlaying = false;
let hasPosterFrame = false;
let priming = false;

// ==== 视频进度条设置 ====
const PROGRESS_BAR_HEIGHT = 6; // 进度条高度
const PROGRESS_BAR_COLOR = [255, 180, 140, 200]; // 进度条颜色
const PROGRESS_BAR_BG_COLOR = [0, 0, 0, 100]; // 进度条背景颜色（透明深色底，适配白色背景图）
const PROGRESS_BAR_MARGIN_BOTTOM = 15; // 进度条距离视频底部的距离
const PROGRESS_THUMB_SIZE = 10; // 进度条小圆圈尺寸
const PROGRESS_THUMB_COLOR = [255, 180, 140, 255]; // 进度条小圆圈颜色

// 相对坐标（基于“背景按宽度等比缩放后的区域尺寸”）
let videoRelX = 0.03;
let videoRelY = 0.07;
let videoRelW = 0.54;
let videoRelH = 0.52;

function preload() {
  // 预加载背景图
  bgImg = loadImage(BG_PATH);
}

function setup() {
  // 创建占位画布，实际尺寸在layoutSection中决定
  createCanvas(windowWidth, 200);
  imageMode(CORNER);
  noCursor();
  noStroke();
  
  // 视频设置
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
  
  // 计算布局并调整画布高度
  layoutSection();
}

function draw() {
  background("#1F2020");

  // 绘制背景图（加入整体上移 SHIFT_Y）
  if (section && section.img) {
    image(section.img, section.x, section.y + SHIFT_Y, section.w, section.h);
  }

  // 绘制视频 / 播放按钮（同样加 SHIFT_Y）
  if (section) {
    const { vx, vy, vw, vh } = videoRectInSection(section); // 内部已考虑 SHIFT_Y
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
    
    // 绘制进度条
    if (hasPosterFrame) {
      drawProgressBar(vx, vy, vw, vh);
    }
  }

  // 绘制自定义光晕鼠标
  if (CURSOR_ENABLED) {
    drawGlowCursor();
  }
}

function mousePressed() {
  if (!section) return;
  const { vx, vy, vw, vh } = videoRectInSection(section);

  // 检查是否点击了进度条
  if (hasPosterFrame) {
    const barY = vy + vh + PROGRESS_BAR_MARGIN_BOTTOM;
    // 进度条点击区域稍微扩大，提高可点击性
    const clickAreaHeight = PROGRESS_BAR_HEIGHT + 20;
    const clickAreaTop = barY - 10;
    if (mouseX > vx && mouseX < vx + vw && mouseY > clickAreaTop && mouseY < clickAreaTop + clickAreaHeight) {
      if (myVideo && myVideo.duration() > 0) {
        const progress = (mouseX - vx) / vw;
        const seekTime = progress * myVideo.duration();
        try {
          myVideo.time(seekTime);
          hasPosterFrame = true;
          
          // 如果视频未播放，则开始播放
          if (!isPlaying && myVideo.elt.paused) {
            myVideo.elt.muted = false;
            myVideo.volume(1);
            isPlaying = true;
            myVideo.play();
          }
        } catch(e) {
          console.log("Seek error:", e);
        }
      }
      return; // 点击进度条后不再处理视频区域的点击
    }
  }

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

function mouseWheel(event) {
  // 这里保留鼠标滚轮功能，但因为只有一张图，所以不做页面切换
  return false; // 阻止默认滚动行为
}

// 计算视频区域的像素矩形（位于背景section内）
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

// 用户手势 prime（iOS 等严格环境的兜底）
function primeOnUserGesture(cb) {
  if (!myVideo || priming) return;
  priming = true;
  const v = myVideo.elt;
  const doSeek = () => {
    try { myVideo.time(0.01); } catch(e) {}
    myVideo.pause();
    hasPosterFrame = true;
    priming = false;
    if (typeof cb === 'function') cb();
  };
  const p = myVideo.play();
  if (p && typeof p.then === 'function') p.then(() => { doSeek(); })
                                          .catch(() => { doSeek(); });
  else { doSeek(); }
}

// 计算背景图的布局
function layoutSection() {
  let accY = 0;
  const cw = windowWidth;

  if (!bgImg || bgImg.width === 0 || bgImg.height === 0) {
    // 如果图片未加载或加载失败，使用默认高度
    const h = windowHeight;
    section = { img: null, x: 0, y: accY, w: cw, h: h };
  } else {
    // 等宽缩放图片
    const scale = cw / bgImg.width;
    // 向上取整并加1px出血，避免边缘漏底
    const w = Math.ceil(cw) + 1;
    const h = Math.ceil(bgImg.height * scale) + 1;

    section = {
      img: bgImg,
      x: 0,
      y: accY,
      w,
      h
    };
  }

  // 计算画布总高度（考虑上移后的可滚动空间）
  const totalH = Math.max(1, Math.ceil(section.h + Math.max(0, -SHIFT_Y)));
  resizeCanvas(cw, totalH, false);
}

// 绘制发光鼠标
function drawProgressBar(vx, vy, vw, vh) {
  push();
  noStroke();
  
  // 进度条位置和尺寸
  const barX = vx;
  const barY = vy + vh + PROGRESS_BAR_MARGIN_BOTTOM;
  const barWidth = vw;
  
  // 绘制透明浅色底背景
  fill(PROGRESS_BAR_BG_COLOR[0], PROGRESS_BAR_BG_COLOR[1], PROGRESS_BAR_BG_COLOR[2], PROGRESS_BAR_BG_COLOR[3]);
  rect(barX, barY, barWidth, PROGRESS_BAR_HEIGHT, PROGRESS_BAR_HEIGHT / 2);
  
  // 计算进度
  let progress = 0;
  if (myVideo && !isNaN(myVideo.time()) && myVideo.duration() > 0) {
    progress = myVideo.time() / myVideo.duration();
  }
  
  // 绘制进度条填充
  fill(PROGRESS_BAR_COLOR[0], PROGRESS_BAR_COLOR[1], PROGRESS_BAR_COLOR[2], PROGRESS_BAR_COLOR[3]);
  rect(barX, barY, barWidth * progress, PROGRESS_BAR_HEIGHT, PROGRESS_BAR_HEIGHT / 2);
  
  // 绘制随进度移动的小圆圈
  const thumbX = barX + barWidth * progress;
  const thumbY = barY + PROGRESS_BAR_HEIGHT / 2;
  fill(PROGRESS_THUMB_COLOR[0], PROGRESS_THUMB_COLOR[1], PROGRESS_THUMB_COLOR[2], PROGRESS_THUMB_COLOR[3]);
  ellipse(thumbX, thumbY, PROGRESS_THUMB_SIZE, PROGRESS_THUMB_SIZE);
  
  pop();
}

function drawGlowCursor() {
  push();
  if (CURSOR_ADD_MODE) {
    blendMode(MULTIPLY);
  } else {
    blendMode(BLEND);
  }
  
  // 应用模糊效果
  drawingContext.filter = `blur(${CURSOR_BLUR_PX}px)`;
  fill(CURSOR_COLOR[0], CURSOR_COLOR[1], CURSOR_COLOR[2], CURSOR_COLOR[3]);
  ellipse(mouseX, mouseY, CURSOR_GLOW_SIZE, CURSOR_GLOW_SIZE);
  
  // 重置滤镜并绘制核心
  drawingContext.filter = 'none';
  fill(CURSOR_COLOR[0], CURSOR_COLOR[1], CURSOR_COLOR[2], 255);
  ellipse(mouseX, mouseY, CURSOR_CORE_SIZE, CURSOR_CORE_SIZE);
  pop();
}

// 窗口大小改变时重新计算布局
function windowResized() {
  layoutSection();
}