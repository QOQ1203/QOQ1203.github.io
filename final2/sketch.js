let bgImage; // 背景图片变量 
let buttonImg; // 自定义按钮图片
let frontImage1, backImage1; // 第一组图片
let frontImage2, backImage2; // 第二组图片
let buttonX = 520, buttonY = 710, buttonScale = 0.25; // 按钮位置和缩放比例
let showNewImages = false; // 控制是否显示两组图片
let isFront1 = true, isFront2 = true; // 两组图片是否显示正面

// 控制两组图片显示的大小和位置
let imageScale1 = 0.5; // 第一组图片的缩放比例
let imageScale2 = 0.175; // 第二组图片的缩放比例

let newImageX1, newImageY1; // 第一组图片的位置
let newImageX2, newImageY2; // 第二组图片的位置
let cursorImg; // 默认鼠标样式图片
let hoverCursorImg; // 悬停时鼠标样式图片
let cursorScale = 0.3; // 定义鼠标图片的缩放比例
let showBackground = true; // 控制背景图片显示的变量
let bgMusic; // 背景音乐变量
let hoverSound; // 悬停声音变量
let flipSound; // 翻转声音变量

let showButton = true; // 控制按钮显示的变量
let endButtonX; // "End" 按钮的 X 位置
let endButtonY; // "End" 按钮的 Y 位置
let showOverlay = false; // 控制遮罩显示的变量
let showEndButton = false;
let closeEffect = false; // 新增变量控制闭合效果
let closeScale = 1; // 新增变量控制缩放比例

function preload() {
  bgImage = loadImage('封面-01.png'); // 替换为你的背景图片路径
  buttonImg = loadImage('q-22.png'); // 替换为你的按钮图片路径
  frontImage1 = loadImage('frontImage1.jpg'); // 第一组正面图片路径
  backImage1 = loadImage('backImage1.jpg'); // 第一组反面图片路径
  frontImage2 = loadImage('q.jpg'); // 第二组正面图片路径
  backImage2 = loadImage('p.jpg'); // 第二组反面图片路径
  cursorImg = loadImage('cursor1.png'); // 替换为你的默认鼠标图片路径
  hoverCursorImg = loadImage('cursor2.png'); // 替换为你的悬停鼠标图片路径
  bgMusic = loadSound('11月2日.WAV'); // 替换为你的背景音频文件路径
  hoverSound = loadSound('mixkit-robotic-insect-buzz-332.wav'); // 替换为你的悬停音效文件路径
  flipSound = loadSound('435539277598499.mp3'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  pixelDensity(2);
  colorMode(RGB); // 设置 RGB 颜色模式
  noCursor(); // 隐藏默认光标
  endButtonX = width - 170; // 设置 "End" 按钮的 X 位置
  endButtonY = height - 120; // 设置 "End" 按钮的 Y 位置
  // 播放背景音乐并设置音量
  if (bgMusic) {
    bgMusic.loop(); // 循环播放背景音乐
    bgMusic.setVolume(0.5); // 设置音量（可调整）
  }

  // 设置两组图片显示位置
  newImageX1 = width * 0.3;
  newImageY1 = height * 0.48;
  newImageX2 = width * 0.7; // 向右移动第二组图片
  newImageY2 = height * 0.48;
}

function draw() {
  background(255); // 设置背景

  if (showBackground) {
    // 显示背景图片
    let imgAspect = bgImage.width / bgImage.height;
    let canvasAspect = width / height;
    let xOffset = -20;
    let yOffset = -30;

    if (canvasAspect > imgAspect) {
      let newWidth = height * imgAspect;
      image(bgImage, (width - newWidth) / 2 + xOffset, yOffset, newWidth, height);
    } else {
      let newHeight = width / imgAspect;
      image(bgImage, xOffset, (height - newHeight) / 2 + yOffset, width, newHeight);
    }
  }

  if (showButton) {
    // 绘制按钮
    drawButton();
  }

  if (showNewImages) {
    drawStaticImage(newImageX1, newImageY1, frontImage1, backImage1, isFront1, imageScale1);
    drawStaticImage(newImageX2, newImageY2, frontImage2, backImage2, isFront2, imageScale2);
  }

 // 绘制 "End" 按钮
 if (showEndButton) {
  drawEndButton();
}

// 绘制遮罩
if (showOverlay) {
  drawOverlay();
}

  // 绘制自定义光标
  drawCustomCursor();
}
// 绘制 "End" 按钮
function drawEndButton() {
  fill(0); // 黑色底
  rect(endButtonX, endButtonY, 80, 40, 4); // 倒角4的矩形
  fill(255); // 白色字体
  textAlign(CENTER, CENTER);
  textSize(20);
  text("End", endButtonX + 40, endButtonY + 20); // 在按钮上绘制文本
}

// 绘制直接切换的图片
function drawStaticImage(x, y, frontImg, backImg, isFront, scale) {
  let imageWidth = frontImg.width * scale;
  let imageHeight = frontImg.height * scale;

  image(isFront ? frontImg : backImg, x - imageWidth / 2, y - imageHeight / 2, imageWidth, imageHeight);
}

// 按钮的绘制和交互逻辑
function drawButton() {
  let hoverShake = 2;
  let buttonWidth = buttonImg.width * buttonScale;
  let buttonHeight = buttonImg.height * buttonScale;

  let originalButtonX = buttonX;
  let originalButtonY = buttonY;

  let isHovered = mouseX > buttonX && mouseX < buttonX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight;

  if (isHovered) {
    buttonX += random(-hoverShake, hoverShake);
    buttonY += random(-hoverShake, hoverShake);
    
    // 播放悬停音效
    if (!hoverSound.isPlaying()) {
      hoverSound.play();
    }
  } else {
    // 停止播放悬停音效
    if (hoverSound.isPlaying()) {
      hoverSound.stop();
    }
  }
  
  image(buttonImg, buttonX, buttonY, buttonWidth, buttonHeight);

  // 点击按钮时显示图片
  if (isHovered && mouseIsPressed) {
    showNewImages = true;
    showBackground = false; // 隐藏背景图片
    showButton = false; // 隐藏按钮
    showEndButton = true; // 显示 "End" 按钮
  }

  buttonX = originalButtonX;
  buttonY = originalButtonY;
}

function drawCustomCursor() {
  let isHoveredButton = mouseX > buttonX && mouseX < buttonX + buttonImg.width * buttonScale &&
                        mouseY > buttonY && mouseY < buttonY + buttonImg.height * buttonScale;
  
  let isHoveredEndButton = mouseX > endButtonX && mouseX < endButtonX + 80 &&
                           mouseY > endButtonY && mouseY < endButtonY + 40;

  let cursorToDisplay = isHoveredButton || isHoveredEndButton ? hoverCursorImg : cursorImg;

  imageMode(CENTER); // 临时将光标中心作为绘制点
  image(cursorToDisplay, mouseX, mouseY, cursorToDisplay.width * cursorScale, cursorToDisplay.height * cursorScale);
  imageMode(CORNER); // 恢复为默认模式
}


function mousePressed() {
  // 点击切换逻辑...
  if (showNewImages) {
    let imageWidth1 = frontImage1.width * imageScale1;
    let imageHeight1 = frontImage1.height * imageScale1;
    let imageWidth2 = frontImage2.width * imageScale2;
    let imageHeight2 = frontImage2.height * imageScale2;

    if (mouseX > newImageX1 - imageWidth1 / 2 && mouseX < newImageX1 + imageWidth1 / 2 &&
        mouseY > newImageY1 - imageHeight1 / 2 && mouseY < newImageY1 + imageHeight1 / 2) {
      isFront1 = !isFront1;
      flipSound.play(); // 只在翻转第一组图片时播放声音
    }
    
    if (mouseX > newImageX2 - imageWidth2 / 2 && mouseX < newImageX2 + imageWidth2 / 2 &&
        mouseY > newImageY2 - imageHeight2 / 2 && mouseY < newImageY2 + imageHeight2 / 2) {
      isFront2 = !isFront2; // 切换第二组图片的显示状态
      // 不播放翻转音效
    }
  }
  // 点击 "End" 按钮
  if (mouseX > endButtonX && mouseX < endButtonX + 80 && mouseY > endButtonY && mouseY < endButtonY + 40) {
    showOverlay = true; // 显示遮罩
  }
}
// 绘制遮罩的函数
function drawOverlay() {
  fill(0, 255); // 半透明黑色
  rect(0, 0, width, height); // 绘制全屏矩形

  // 添加文字
  fill(255); // 设置文字颜色为白色
  textAlign(CENTER, CENTER); // 文字居中对齐
  textSize(32); // 设置文字大小
  text("I hope she's a free spirit now", width / 2, height / 2); // 在屏幕中心显示文字
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
