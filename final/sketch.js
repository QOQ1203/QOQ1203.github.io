let bgImage;  // 背景图片变量
let buttonImg;  // 自定义按钮图片
let  buttonScale = 0.25;  // 定义按钮位置和缩放比例
let buttonX, buttonY;

let eyePositions = [];  // 用于存储所有眼睛的位置
let eyeWidth = 200;  // 眼睛的宽度
let eyeHeight = 100;  // 眼睛的高度
let pupilSize = 60;  // 瞳孔的大小

let eyeImage;  // 存储自定义的眼球图片
let eyeBackground;  // 存储自定义的眼白图片
let maskedEyeBackground;  // 遮罩后的眼白图片
let maskedPupil;  // 遮罩后的瞳孔图片
let eyeBackgroundScaleFactor = 1.5;  // 眼白部分插入图片的放大倍数
let pupilMovementScale = 0.3;  // 缩小瞳孔活动范围的缩放因子

let closingEye = null;  // 存储当前正在闭合的眼睛
let closeAnimationProgress = 0;  // 闭眼动画的进度
let cursorImg;  // 默认鼠标样式图片
let hoverCursorImg;  // 悬停时鼠标样式图片
let cursorScale = 0.3;  // 定义鼠标图片的缩放比例
let bgMusic;  // 背景音乐变量
let hoverSound;  // 悬停声音变量

function preload() {
  bgImage = loadImage('封面-01.png');  // 替换为你的背景图片路径
  buttonImg = loadImage('q-22.png');  // 替换为你的按钮图片路径
  eyeImage = loadImage('13.png');  // 自定义眼球图片
  eyeBackground = loadImage('ada.png');  // 自定义眼白图片
  cursorImg = loadImage('cursor1.png');  // 替换为你的默认鼠标图片路径
  hoverCursorImg = loadImage('cursor2.png');  // 替换为你的悬停鼠标图片路径
  bgMusic = loadSound('11月11日(1).WAV');  // 替换为你的背景音频文件路径
  hoverSound = loadSound('mixkit-robotic-insect-buzz-332.wav');  // 替换为你的悬停音效文件路径
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  pixelDensity(2);
  colorMode(RGB);
   // 初始化按钮相对位置
   buttonX = windowWidth * 0.1; // 屏幕宽度的50%
   buttonY = windowHeight * 0.77; // 屏幕高度的90%
// 播放背景音乐并设置音量
if (bgMusic) {
  bgMusic.loop();  // 循环播放背景音乐
  bgMusic.setVolume(0.5);  // 设置音量（可调整）
}
let eyeX = windowWidth * 0.502 ;  // 调整为相对于窗口宽度的50%位置
let eyeY = windowHeight * 0.69 ;  // 调整为相对于窗口高度的某个位置
eyePositions.push({ x: eyeX, y: eyeY });


  // 创建眼白遮罩和瞳孔遮罩
  let maskGraphic = createGraphics(eyeWidth, eyeHeight);
  maskGraphic.beginShape();
  maskGraphic.vertex(eyeWidth / 2 - eyeWidth / 2, eyeHeight / 2);
  maskGraphic.bezierVertex(eyeWidth / 4, 0, eyeWidth * 3 / 4, 0, eyeWidth, eyeHeight / 2);
  maskGraphic.bezierVertex(eyeWidth * 3 / 4, eyeHeight, eyeWidth / 4, eyeHeight, eyeWidth / 2 - eyeWidth / 2, eyeHeight / 2);
  maskGraphic.endShape(CLOSE);

  eyeBackground.resize(eyeWidth * eyeBackgroundScaleFactor, 0);
  maskedEyeBackground = eyeBackground.get();
  maskedEyeBackground.mask(maskGraphic);

  eyeImage.resize(pupilSize, pupilSize);
  maskedPupil = eyeImage.get();
  let pupilMaskGraphic = createGraphics(pupilSize, pupilSize);
  pupilMaskGraphic.ellipse(pupilSize / 2, pupilSize / 2, pupilSize, pupilSize);
  maskedPupil.mask(pupilMaskGraphic);

  noCursor();
}
function drawBackground() {
  let bgFixedWidth = 1920;  // 背景图片的固定宽度
  let bgFixedHeight = 1080;  // 背景图片的固定高度
  let xOffset = (windowWidth - bgFixedWidth) / 2;
  let yOffset = (windowHeight - bgFixedHeight) / 2;

  image(bgImage, xOffset, yOffset, bgFixedWidth, bgFixedHeight);
}
function draw() {
  background(255);

  // 绘制背景
  let imgAspect = bgImage.width / bgImage.height;
  let canvasAspect = width / height;
  let xOffset = 0;
  let yOffset = 0;

  if (canvasAspect > imgAspect) {
    let newWidth = height * imgAspect;
    image(bgImage, (width - newWidth) / 2 + xOffset, yOffset, newWidth, height);
  } else {
    let newHeight = width / imgAspect;
    image(bgImage, xOffset, (height - newHeight) / 2 + yOffset, width, newHeight);
  }

  // 绘制眼睛
  if (eyePositions.length > 0) {
    let eyeX = eyePositions[0].x;
    let eyeY = eyePositions[0].y;
    let distToMouse = dist(mouseX, mouseY, eyeX, eyeY);

    // 渐进式闭眼动画
    if (closingEye) {
      closeAnimationProgress += 0.003; // 控制闭合动画速度
      let closeHeight = lerp(eyeHeight, 0, closeAnimationProgress);

      // 绘制闭合的眼睛
      fill(255, 0, 0);
      noStroke();
      beginShape();
      vertex(eyeX - eyeWidth / 2, eyeY);
      bezierVertex(eyeX - eyeWidth / 4, eyeY - closeHeight / 2, eyeX + eyeWidth / 4, eyeY - closeHeight / 2, eyeX + eyeWidth / 2, eyeY);
      bezierVertex(eyeX + eyeWidth / 4, eyeY + closeHeight / 2, eyeX - eyeWidth / 4, eyeY + closeHeight / 2, eyeX - eyeWidth / 2, eyeY);
      endShape(CLOSE);

      if (closeAnimationProgress >= 1) {
        // 动画完成后移除眼睛
        eyePositions = eyePositions.filter(pos => pos !== closingEye);
        closingEye = null;
        closeAnimationProgress = 0;
      }
    } else {
      if (distToMouse < eyeWidth / 2) {
        fill(255, 0, 0);  
        noStroke();
        beginShape();
        vertex(eyeX - eyeWidth / 2, eyeY);
        bezierVertex(eyeX - eyeWidth / 4, eyeY - eyeHeight / 2, eyeX + eyeWidth / 4, eyeY - eyeHeight / 2, eyeX + eyeWidth / 2, eyeY);
        bezierVertex(eyeX + eyeWidth / 4, eyeY + eyeHeight / 2, eyeX - eyeWidth / 4, eyeY + eyeHeight / 2, eyeX - eyeWidth / 2, eyeY);
        endShape(CLOSE);
      } else {
        noStroke();
        imageMode(CENTER);
        image(maskedEyeBackground, eyeX, eyeY, eyeWidth, eyeHeight);
      }

      let dx = mouseX - eyeX;
      let dy = mouseY - eyeY;
      let circleRadius = (eyeHeight / 2 - pupilSize / 2) * pupilMovementScale;
      let angle = atan2(dy, dx);
      let pupilX = eyeX + cos(angle) * min(circleRadius, dist(mouseX, mouseY, eyeX, eyeY));
      let pupilY = eyeY + sin(angle) * min(circleRadius, dist(mouseX, mouseY, eyeX, eyeY));
      image(maskedPupil, pupilX, pupilY, pupilSize, pupilSize);
    }
  } else {
    // 如果眼睛被点击消失，绘制按钮
    drawButton();
  }

  drawCustomCursor();
}

function mousePressed() {
  let eye = eyePositions[0];
  let distToEye = dist(mouseX, mouseY, eye.x, eye.y);
  let distanceThreshold = 200;  // 设置点击影响范围

  if (distToEye < distanceThreshold && !closingEye) {
    closingEye = eye;  // 记录正在闭合的眼睛
    closeAnimationProgress = 0;  // 重置动画进度
    
  }
}

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
  hoverSound.stop();}}
  

  image(buttonImg, buttonX, buttonY, buttonWidth, buttonHeight);

  if (isHovered && mouseIsPressed) {
    window.location.href = "../final2/index.html";
  }

  buttonX = originalButtonX;
  buttonY = originalButtonY;
}
// 绘制自定义鼠标光标
function drawCustomCursor() {
	let isHovered = mouseX > buttonX && mouseX < buttonX + buttonImg.width * buttonScale &&
	  mouseY > buttonY && mouseY < buttonY + buttonImg.height * buttonScale;
  
	let cursorToDisplay = isHovered ? hoverCursorImg : cursorImg;
  
	imageMode(CENTER);  // 临时将光标中心作为绘制点
	image(cursorToDisplay, mouseX, mouseY, cursorToDisplay.width * cursorScale, cursorToDisplay.height * cursorScale);
	imageMode(CORNER);  // 恢复为默认模式
  }

