// ==== 自定义光晕鼠标 ====
let CURSOR_ENABLED   = true;
let CURSOR_COLOR     = [255, 180, 140, 180];
let CURSOR_CORE_SIZE = 0;
let CURSOR_GLOW_SIZE = 30;
let CURSOR_BLUR_PX   = 10;
let CURSOR_ADD_MODE  = true;
// 整体纵向偏移（负值=整体上移）
const SHIFT_Y = 6;

// ==== 剩余背景图（依次垂直拼接）====
const BG_PATHS = [
  "PDF_page-0001.jpg", // 背景图1
  "PDF_page-0005.jpg", //图5 - 请替换为实际文件名
  "PDF_page-0006.jpg", //图6 - 请替换为实际文件名
  "PDF_page-0007.jpg", //图7 - 请替换为实际文件名
];

let bgImgs = [];            // 存储加载的图片
let sections = [];          // 每段的 {img, x, y, w, h}
let currentSection = 0;     // 当前显示的背景图索引
let loadedImages = 0;       // 已加载图片计数
let allImagesLoaded = false; // 所有图片加载完成标志

function preload() {
  // 预加载前3张图片（当前和相邻图片）
  for (let i = 0; i < Math.min(3, BG_PATHS.length); i++) {
    bgImgs[i] = loadImage(BG_PATHS[i], () => {
      loadedImages++;
      if (loadedImages === BG_PATHS.length) {
        allImagesLoaded = true;
      }
    });
  }
}

function setup() {
  // 创建占位画布，实际尺寸在layoutSections中决定
  createCanvas(windowWidth, 200);
  imageMode(CORNER);
  noCursor();
  noStroke();
  
  // 计算布局并调整画布高度
  layoutSections();
}

function draw() {
  background("#1F2020");

  // 只绘制当前可见区域的图片（优化性能）
  const visibleStart = Math.max(0, currentSection - 1);
  const visibleEnd = Math.min(sections.length - 1, currentSection + 1);
  
  for (let i = visibleStart; i <= visibleEnd; i++) {
    const s = sections[i];
    if (s && s.img) {
      image(s.img, s.x, s.y + SHIFT_Y, s.w, s.h);
    }
  }

  // 绘制自定义光晕鼠标
  if (CURSOR_ENABLED) {
    drawGlowCursor();
  }
  
  // 延迟加载非可见区域的图片
  if (!allImagesLoaded) {
    loadNextImages();
  }
}

// 延迟加载剩余图片
function loadNextImages() {
  for (let i = 3; i < BG_PATHS.length; i++) {
    if (!bgImgs[i]) {
      bgImgs[i] = loadImage(BG_PATHS[i], () => {
        loadedImages++;
        if (loadedImages === BG_PATHS.length) {
          allImagesLoaded = true;
          layoutSections(); // 所有图片加载完成后重新计算布局
        }
      });
    }
  }
}

function mouseWheel(event) {
  // 滚轮向下滚动
  if (event.deltaY > 0) {
    if (currentSection < sections.length - 1) {
      currentSection++;
      jumpToSection(currentSection);
    }
  } 
  // 滚轮向上滚动
  else {
    if (currentSection > 0) {
      currentSection--;
      jumpToSection(currentSection);
    }
  }
  return false; // 阻止默认滚动行为
}

// 跳转到指定背景图
function jumpToSection(index) {
  if (index >= 0 && index < sections.length) {
    const targetY = sections[index].y + SHIFT_Y;
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'  // 平滑滚动
    });
  }
}

// 计算所有背景图的布局
function layoutSections() {
  sections = [];
  let accY = 0;
  const cw = windowWidth;

  for (let i = 0; i < bgImgs.length; i++) {
    const img = bgImgs[i];
    
    if (!img || img.width === 0 || img.height === 0) {
      // 如果图片未加载或加载失败，使用默认高度
      const h = windowHeight;
      sections.push({ img: null, x: 0, y: accY, w: cw, h: h });
      accY += h;
      continue;
    }
    
    // 等宽缩放图片
    const scale = cw / img.width;
    // 向上取整并加1px出血，避免边缘漏底
    const w = Math.ceil(cw) + 1;
    const h = Math.ceil(img.height * scale) + 1;

    sections.push({ 
      img, 
      x: 0, 
      y: accY, 
      w, 
      h 
    });
    accY += h;
  }

  // 计算画布总高度（考虑上移后的可滚动空间）
  const totalH = Math.max(1, Math.ceil(accY + Math.max(0, -SHIFT_Y)));
  resizeCanvas(cw, totalH, false);
}

// 绘制发光鼠标
function drawGlowCursor() {
  push();
  if (CURSOR_ADD_MODE) {
    blendMode(MULTIPLY)
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
  layoutSections();
}
