let bgImage;  // 背景图片变量
let particles = [];  // 粒子数组
let buttonImg;  // 自定义按钮图片
let buttonScale = 0.25;  // 定义按钮位置和缩放比例
let buttonXRatio = 0.4; // 相对于宽度的比例
let buttonYRatio = 0.37; // 相对于高度的比例
let bgXRatio = 0.5; // 背景图片相对于宽度的水平中心比例
let bgYRatio = 0.5; // 背景图片相对于高度的垂直中心比例
let bgScaleRatio = 0.13; // 背景图片缩放比例，例如 0.8 表示缩放到 80% 大小
let buttonOffsetX, buttonOffsetY; // 按钮相对于背景图片的偏移量
let particleOffsets = []; // 存储每个粒子相对于背景图的偏移量

const targetDamping = 0.72;
const targetChaseForce = 1.5;

let damping = targetDamping;
let chaseForce = targetChaseForce;
const distanceToDrawLine = 70;
const maxParticles = 600;

let cursorImg;  // 默认鼠标样式图片
let hoverCursorImg;  // 悬停时鼠标样式图片
let cursorScale = 0.3;  // 定义鼠标图片的缩放比例
let bgMusic;  // 背景音乐变量
let hoverSound;  // 悬停声音变量
function preload() {
  // 在这里加载你的背景图片和按钮图片，确保图片路径正确
  bgImage = loadImage('封面-01.jpg');  // 替换为你的背景图片路径
  buttonImg = loadImage('q-22.png');  // 替换为你的按钮图片路径
  cursorImg = loadImage('cursor1.png');  // 替换为你的默认鼠标图片路径
  hoverCursorImg = loadImage('cursor2.png');  // 替换为你的悬停鼠标图片路径
  bgMusic = loadSound('mixkit-electricity-buzz-910.wav');  // 替换为你的背景音频文件路径
  hoverSound = loadSound('mixkit-robotic-insect-buzz-332.wav');  // 替换为你的悬停音效文件路径
}

function setup() {
  // 创建一个画布，大小为窗口的宽度和高度
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  pixelDensity(2);
  colorMode(HSB, 360, 100, 100, 100);
  curveTightness(-0.2);
 // 计算缩放后的背景图片宽高
 let bgWidth = bgImage.width * bgScaleRatio;
 let bgHeight = bgImage.height * bgScaleRatio;

 // 背景图片的初始位置（居中）
 let bgX = (windowWidth - bgWidth) * bgXRatio;
 let bgY = (windowHeight - bgHeight) * bgYRatio;

 // 初始化粒子并计算相对于背景图片的偏移量
 particles = new Array(maxParticles).fill().map(() => {
   let px = random(width);
   let py = random(height);
   let velocityX = random(-1, 1);
   let velocityY = random(-1, 1);

   // 计算相对于背景图片中心的偏移量
   let offsetX = px - bgX;
   let offsetY = py - bgY;
   particleOffsets.push([offsetX, offsetY]);

   return [px, py, velocityX, velocityY];
 });

 // 初始化按钮的位置
 buttonX = windowWidth * buttonXRatio;
 buttonY = windowHeight * buttonYRatio;

 // 计算按钮相对于背景图片的偏移量
 buttonOffsetX = buttonX - bgX;
 buttonOffsetY = buttonY - bgY;


// 播放背景音乐并设置音量
if (bgMusic) {
  bgMusic.loop();  // 循环播放背景音乐
  bgMusic.setVolume(0.5);  // 设置音量（可调整）
}
  // 隐藏默认的鼠标指针
  noCursor();
}

function draw() {

  const fadeSpeed = 0.01;

  // 清除整个画布
  clear();
// 计算缩放后的背景图片宽高
let bgWidth = bgImage.width * bgScaleRatio;
let bgHeight = bgImage.height * bgScaleRatio;

// 背景图片的位置（居中）
let bgX = width * bgXRatio - bgWidth / 2;
let bgY = height * bgYRatio - bgHeight / 2;

// 绘制背景图片
image(bgImage, bgX, bgY, bgWidth, bgHeight);

// 使用偏移量计算按钮的位置
buttonX = bgX + buttonOffsetX;
buttonY = bgY + buttonOffsetY;


// 绘制缩放后的背景图片
image(bgImage, bgX, bgY, bgWidth, bgHeight);
  // 先绘制按钮，让它位于粒子下方
  drawButton();  // 按钮先绘制
 // 绘制并更新粒子
 particles = particles.map(([x, y, velocityX, velocityY], i) => {
  // 更新粒子位置
  let nextX = x + velocityX;
  let nextY = y + velocityY;

  // 保持粒子在画布内
  if (nextX < 0 || nextX > width) velocityX *= -1;
  if (nextY < 0 || nextY > height) velocityY *= -1;

  // 绘制粒子
  stroke(0, 100, 100);
  point(nextX, nextY);

  return [nextX, nextY, velocityX, velocityY];
});

  // 鼠标按下时，线条逐渐消失
  if (mouseIsPressed) {
    damping = lerp(damping, 1.0, fadeSpeed);
    chaseForce = lerp(chaseForce, 0.0, fadeSpeed);
  } else {
    damping = lerp(damping, targetDamping, fadeSpeed);
    chaseForce = lerp(chaseForce, targetChaseForce, fadeSpeed);
  }

  let curves = [];
  let curvePoints;

  particles = particles.map(([x, y, velocityX, velocityY], i, _particles) => {
    let nextX = x;
    let nextY = y;
    let nextVelocityX = velocityX * damping;
    let nextVelocityY = velocityY * damping;
    let forceX = 0;
    let forceY = 0;

    const [chaseeX, chaseeY] = _particles[(i + 1) % _particles.length];
    const distanceX = chaseeX - x;
    const distanceY = chaseeY - y;
    const distance = sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance > 0) {
      forceX += (distanceX / distance) * chaseForce;
      forceY += (distanceY / distance) * chaseForce;
    }

    // 绘制红色细线并收集曲线数据
    if (distance < distanceToDrawLine) {
      if (!curvePoints) {
        curvePoints = [[x, y]];
      }
      curvePoints.push([chaseeX, chaseeY]);
    } else {
      if (curvePoints) {
        curves.push(curvePoints);
        curvePoints = undefined;
      }
      strokeWeight(0.3);  // 设置更细的线条
      stroke(0, 100, 100);  // 红色
      point(x, y);  // 绘制红色点
    }

    // 保持粒子在画布内
    if (x < 0) {
      nextX = 0;
      nextVelocityX = max(nextVelocityX, -nextVelocityX);
    } else if (x > width) {
      nextX = width;
      nextVelocityX = min(nextVelocityX, -nextVelocityX);
    }
    if (y < 0) {
      nextY = 0;
      nextVelocityY = max(nextVelocityY, -nextVelocityY);
    } else if (y > height) {
      nextY = height;
      nextVelocityY = min(nextVelocityY, -nextVelocityY);
    }

    // 应用速度和力
    return [nextX + velocityX, nextY + velocityY, nextVelocityX + forceX, nextVelocityY + forceY];
  });

  // 添加未完成的曲线
  if (curvePoints) {
    curves.push(curvePoints);
    curvePoints = undefined;
  }

  // 绘制曲线
  noFill();
  stroke(0, 100, 100);  // 设置线条为红色
  strokeWeight(0.3);  // 线条更细

  if (curves.length === 1 && curves[0].length - 1 === particles.length) {
    curvePoints = curves[0];
    curvePoints.pop();
    const len = curvePoints.length;
    beginShape();
    for (let i = 0; i < len + 3; i++) {
      const [x, y] = curvePoints[i % len];
      curveVertex(x, y);
    }
    endShape();
  } else {
    curves.forEach((curvePoints) => {
      beginShape();
      curvePoints.forEach(([x, y]) => curveVertex(x, y));
      endShape();
    });
  }

  // 绘制自定义鼠标光标
  drawCustomCursor();
}


// 绘制按钮并添加悬停颤抖效果
function drawButton() {
  let hoverShake = 2; // 将颤抖范围减小
  let buttonWidth = buttonImg.width * buttonScale;
  let buttonHeight = buttonImg.height * buttonScale;

  // 保存初始按钮位置
  let originalButtonX = buttonX;
  let originalButtonY = buttonY;

  // 检查鼠标是否悬停在按钮上
  let isHovered = mouseX > buttonX && mouseX < buttonX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight;

  // 如果悬停，颤抖效果
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

  // 绘制按钮
  image(buttonImg, buttonX, buttonY, buttonWidth, buttonHeight);

  // 如果点击了按钮区域，直接跳转到新页面
  if (isHovered && mouseIsPressed) {
    window.location.href = "../008/index.html";  // 直接跳转，不显示加载动画
  }
  // 在每次绘制后将按钮位置恢复到初始值，避免累积偏移
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // 重新计算背景图片的位置
  let bgWidth = bgImage.width * bgScaleRatio;
  let bgHeight = bgImage.height * bgScaleRatio;
  let bgX = (windowWidth - bgWidth) * bgXRatio;
  let bgY = (windowHeight - bgHeight) * bgYRatio;

  // 根据偏移量重新设置按钮的位置
  buttonX = bgX + buttonOffsetX;
  buttonY = bgY + buttonOffsetY;

  // 更新粒子位置使其相对于背景图片位置不变
  particles = particles.map(([_, __, velocityX, velocityY], i) => {
    let [offsetX, offsetY] = particleOffsets[i];
    let x = bgX + offsetX;
    let y = bgY + offsetY;

    return [x, y, velocityX, velocityY];
  });
}

