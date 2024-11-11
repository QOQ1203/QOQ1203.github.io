let bgImage;  // 背景图片变量
let buttonImgs = [];  // 自定义按钮图片数组
let buttonScale = 0.25;  // 按钮缩放比例
let buttons = [];  // 按钮数组
let maskGraphics;  // 用于创建遮罩效果
let particles = [];  // 粒子数组
let numParticles = 500;  // 粒子数量
let bgX = 50;  // 背景图片的x坐标mouse
let bgY = 0;  // 背景图片的y坐标
// 变量用于实现画布拖动
let isDragging = false;
let startX, offsetX = 0;
let scrollX = 0;
let targetScrollX = 0;

let lightRadius = 20;  // 初始光圈半径
let maxLightRadius = 170;  // 手电筒放大后的最大半径
let showNewImage = false;  // 控制是否显示新的图片

let button3Shaking = true;  // 控制按钮3是否抖动

let strings = [];
const jointLength = 10;
const jointCount = 45;
const friction = 0.00001; // 调整摩擦力使效果更明显
const beanRadius = 5;
const F = 0.03;
let player;
const playerColor = [255, 0, 0, 0];
const playerRadius = 50;
const grassColor = [255, 0, 0];
const grassDistance = 15;
const gravity = 0.01; // 设置重力强度，可以根据需要调整
let time = 0; // 时间变量

let button6Activated = false; // 记录 button6 是否已被激活
let button5Activated = false; // 记录 button5 是否已被激活

let rectX 
let rectY 
let rectWidth = 100; // 矩形的宽度
let rectHeight = 50; // 矩形的高度
let fillAmount = 0; // 填充的高度
let isFilled = false; // 记录矩形是否已经填满

let finalImage; // 定义一个变量来存储最终的图片
let finalImageProps = {}; // 定义一个对象来存储最终图片的属性（位置和缩放）
// let showSlideHint = false;
// let slideHintStartTime = 0; // 记录滑动提示开始显示的时间

let textImage; // 定义一个变量来存储 textpng 图片
let button4Shaking = true; // 控制按钮4是否抖动
let showTextImage = false; // 控制是否显示 textpng 图片

let textImgX, textImgY; // textpng 图片的初始位置
let textImgWidth, textImgHeight; // textpng 图片的宽高
// 
let moveSpeed = 0.35; // 向上平移的速度
let finalTextImgY; // 最终 Y 位置
let rectVisible = false; // 用于控制矩形是否可见
let showRectangle = false; // 新增一个变量来控制矩形和文字的显示
let showRectangleAndButton = false; // 控制矩形和 button5 的显示

let n = 500;
let vents = [];

let eyeRadius = 0.2;
let eyeVariance = 0.05;
let distribution = 1.0;
let length = 0.1;
let lengthEvo = 1.3;
let speedFactor = 0.1;
let respawnFactor = 0.03;
let button8Visible = false; // 控制 button8 是否可见
let button7Shaking = true; // 控制按钮7是否抖动
let showAvapng2 = false; // 控制 avapng2 图片的显示
let avapng2Image; // 声明图片变量
let avapng2X, avapng2Y, avapng2Scale; // avapng2 的坐标和缩放
// 新增一个变量用于记录 png11 是否完全显示
let png11FullyVisible = false;
// 定义自定义矩形的属性
let rectX1 = 2900;        // 矩形左上角的 X 坐标
let rectY1 = 490;        // 矩形左上角的 Y 坐标
let rect1Width = 400;    // 矩形宽度
let rect1Height = 100;   // 矩形高度
let escapeButtonVisible = false; // 控制 ESCAPE 按钮是否显示
let escapeButtonX, escapeButtonY, escapeButtonWidth, escapeButtonHeight; // ESCAPE 按钮的坐标和尺寸
let lastClickTime = 0; // 上一次点击的时间

let bgMusic;  // 背景音乐变量
let button3Sound;
let png11Sound;
let button4Sound;
let button7Sound;
let audioCue;

class Vent {
  
  constructor () {
    this.initialize(); 
  }
  
  initialize() {
    let centerR = random(50, eyeVariance * width * 0.5); // 调整生成范围
    let centerA = random(0, TWO_PI);
    this.x = width / 1.37 + centerR * cos(centerA); // 改变位置偏移
    this.y = height / 2.7 + centerR * sin(centerA); // 改变位置偏移
    
    let radiusRow = eyeRadius * width * 0.5 + pow(random(0, pow((width - eyeRadius * width * 2.0), distribution)), 1.0 / distribution);
this.rx = radiusRow * random(0.2, 0.4);
this.ry = radiusRow * random(0.2, 0.4);

    
    this.a = random(0, TWO_PI);
    
    this.la = pow(length * width, lengthEvo) / radiusRow * random(0.8, 1.2);
    
    this.c = color(255, 0, 0);
    
    this.s = speedFactor * random(0.8, 1.2);
  }
  
  show() {
    noFill();
    stroke(this.c);
    strokeWeight(0.05); // 设置线的粗细为2
    arc(this.x, this.y, this.rx, this.ry, this.a, this.a + this.la);
  }
  
  move() {
    this.a += this.s;
    let r = random(0, 1);
    if (r < respawnFactor) {
      this.initialize();
    }
  }
}

class GrassString {
  constructor(x) {
    this.root = createVector(x, 0);
    this.joints = Array(jointCount).fill().map(() => {
      let alpha = random(256);
      let colour = color([...grassColor, alpha]);
      return { angle: 0, angularVel: 0, color: colour };
    });
  }

  collide() {
    let pos = this.root.copy();
    let totalAngle = PI / 2; // 草向下延展
  
    // 动态设置重力
    let dynamicGravity = 0 + 0.0001 * sin(time); // 重力在 -0.0001 到 0.0001 之间变化

  
    for (let i of this.joints) {
      if (pos.dist(player) < playerRadius) {
        let sampleL = pos.copy().add(createVector(jointLength, 0).rotate(totalAngle - F));
        let sampleR = pos.copy().add(createVector(jointLength, 0).rotate(totalAngle + F));
        let d = map(pos.dist(player), 0, 100, 1, 0.2);
        
        // 鼠标施加的水平力
        i.angle += F * d * (sampleL.dist(player) > sampleR.dist(player) ? -1 : 1);
      }
      
      // 应用变化的重力，使草的底部自然下垂
      i.angularVel += dynamicGravity; // 施加变化的重力，使草向下拉伸
      
      // 增加摩擦力，让草的摆动更加平缓
      i.angularVel *= 0.98;
      i.angle += i.angularVel;
      totalAngle += i.angle;
      pos.add(createVector(jointLength, 0).rotate(totalAngle));
    }
  }
  
  
  
  

  update() {
    let pos = this.root.copy();
    let totalAngle = PI / 2; // 改为 PI / 2，使草向下延展
    for (let i of this.joints) {
      i.angle += i.angularVel;
      totalAngle += i.angle;
      i.angularVel -= sin(i.angle) / 300; // 让草摆动更柔和
      i.angle *= friction;
      let old = pos.copy();
      pos.add(createVector(jointLength, 0).rotate(totalAngle));
      stroke(0);
      strokeWeight(0.1); // 设置线条的粗细（0.5是一个较细的值，你可以调整这个值）
      line(old.x, old.y, pos.x, pos.y);
      fill(i.color);
      noStroke();
      ellipse(pos.x, pos.y, beanRadius);
    }
  }
}  

function preload() {
  // 在这里加载你的背景图片和三个按钮图片，确保图片路径正确
  bgImage = loadImage('未标题-1-01.jpg');  // 替换为你的背景图片路径
  buttonImgs.push(loadImage('png11.png'));  // 按钮图片1
  buttonImgs.push(loadImage('png22.png'));  // 按钮图片2
  buttonImgs.push(loadImage('png33.png'));  // 按钮图片3
  buttonImgs.push(loadImage('png44.png'));  // 按钮图片4
  buttonImgs.push(loadImage('png55.png'));  // 按钮图片5
  buttonImgs.push(loadImage('png66.png'));  // 按钮图片6
  newImage = loadImage('newImage.png'); // 替换为你的新图片路径
  buttonImgs.push(loadImage('png77.png'));  // 按钮图片7
  buttonImgs.push(loadImage('png88.png')); // 加载 button8 图片
  buttonImgs.push(loadImage('button9.png')); // 加载 button9 图片，替换为你的图片路径

  finalImage = loadImage('finalpng.png'); // 替换为你的最终图片路径
  textImage = loadImage('textpng.png'); // 替换为你的 textpng 图片路径
  avatarImage = loadImage('avatar.png'); // 替换为你的头像图片路径
  avapng2Image = loadImage('avapng2.png'); // 替换为 avapng2 图片的路径

  bgMusic = loadSound('bg.mp3');  // 替换为你的背景音频文件路径
  button3Sound = loadSound('mixkit-home-standard-ding-dong-109.wav');
  png11Sound = loadSound('mixkit-distant-train-horn-1654.wav');
  button4Sound = loadSound('11月11日.WAV');
  button7Sound = loadSound('pl1.mp3');
  audioCue = loadSound('heart.wav');
}

function setup() {
  createCanvas(windowHeight * 4, windowHeight);
  frameRate(60);
  pixelDensity(2);
  noCursor();  // 隐藏默认的鼠标指针
  rescueFillAmount = 100; // 初始状态按钮完全填满
  maskGraphics = createGraphics(windowWidth * 4, windowHeight);
  rectX = width * 0.654; // 矩形的X坐标为画布中心
  rectY = height * 0.273; // 矩形的Y坐标为画布中心
  // 初始化 textImage 的位置和尺寸
  textImgWidth = textImage.width / 4;
  textImgHeight = textImage.height / 4;
  textImgX = width * 0.53;
  textImgY = height * 0.56;
  finalTextImgY = textImgY - 280; // 设定最终的 Y 坐标

  // 初始化 rescueButton 的位置和尺寸
  rescueButtonWidth = 150;
  rescueButtonHeight = 50;
  rescueButtonX = width / 1.09 - rescueButtonWidth / 2;
  rescueButtonY = height * 0.5; // 放置在画布底部附近
// ESCAPE 按钮的位置和尺寸
escapeButtonWidth = 100;
escapeButtonHeight = 50;
escapeButtonX = width - escapeButtonWidth - 20; // 画布右下角
escapeButtonY = height - escapeButtonHeight - 20;
// 播放背景音乐并设置音量
if (bgMusic) {
  bgMusic.loop();  // 循环播放背景音乐
  bgMusic.setVolume(0.5);  // 设置音量（可调整）
}

  // 初始化粒子数组
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      speedX: random(-2, 2),
      speedY: random(-2, 2),
      size: random(2, 5)
    });
  }

  // 初始化按钮位置和缩放比例
  buttons.push({ x: width * 0.296, y: height * 0.691, scale: 0.74 }); // 第一个按钮
  buttons.push({ x: width * 0.02, y: height * 0.033, scale: 0.25 }); // 第二个按钮
  buttons.push({ x: width * 0.02, y: height * 0.7, scale: 0.4 }); // 第三个按钮
  buttons.push({ x: width * 0.51, y: height * 0.58, scale: 0.26 }); // 第四个按钮
  buttons.push({ x: width * 0.64, y: height * 0.03, scale: 0.26 }); // 第五个按钮
  buttons.push({ x: width * 0.35, y: height * 0.4, scale: 0.26 }); // 第六个按钮
  buttons.push({ x: width * 0.89, y: height * 0.06, scale: 0.30 }); // 第七个按钮
  buttons.push({ x: width * 0.89, y: height * 0.06, scale: 0.3 }); // 第八个按钮
  buttons.push({ x: width * 0.8, y: height * 0.56, scale: 0.3 }); // 第9个按钮
  
   // 初始化 finalImage 的属性（位置和缩放比例）
   finalImageProps = {
    x: width * 0.73, // 设置X坐标为画布宽度的一半（可以调整）
    y: height * 0.47, // 设置Y坐标为画布高度的一半（可以调整）
    scale: 0.27 // 设置缩放比例（可以根据需要调整）
  };

  // 定义“草”的水平分布范围
  let startX = 1500; // 草的水平起始位置
  let endX = width - 1290; // 草的水平结束位置
  
  // 使用定义的范围初始化“草”
  for (let x = startX; x < endX; x += grassDistance) {
    strings.push(new GrassString(x, 0)); // 将草的根部设为页面顶部
  }
  for (let i = 0; i < n; i++) {
    vents.push(new Vent());
  }
}

function draw() {
  clear();

  scrollX += (targetScrollX - scrollX) * 0.1;
  translate(-scrollX, 0);

  let scaleFactor = min(width / bgImage.width, height / bgImage.height) * 1;  
  let newWidth = bgImage.width * scaleFactor;
  let newHeight = bgImage.height * scaleFactor;

  // 绘制背景图片
  image(bgImage, bgX, bgY, newWidth, newHeight);
 
  drawParticles();
  drawFlashlight(); // 始终绘制手电筒，button1 也在这里处理显示
  drawButtons();  // 绘制其他按钮  
  drawNewImage(); // 显示新图片
 
  player = createVector(mouseX + scrollX, mouseY);

  fill(playerColor);
  noStroke();
  ellipse(player.x, player.y, playerRadius);
  
  // 更新 time 使 gravity 随时间变化
  time += 0.01; // 控制变化速度，可以根据需要调整
  
  strings.forEach((c) => {
    c.collide();
    c.update();
  });

  // // 显示滑动提示
  // if (button6Activated) {
  //   showSlideHint = true; // 激活后显示提示
  // }

  // if (showSlideHint) {
  //   drawSlideHint();
  // }

  // 检查鼠标是否悬停在 textImage 上
  let isHovered = mouseX + scrollX > textImgX && mouseX + scrollX < textImgX + textImgWidth &&
                  mouseY > textImgY && mouseY < textImgY + textImgHeight;

  // 如果悬停且未达到最终 Y 值，向上移动图片
  if (isHovered && textImgY > finalTextImgY) {
    textImgY -= moveSpeed;
  }

  // 显示 textImage 图片
  if (showTextImage) {
    image(textImage, textImgX, textImgY, textImgWidth, textImgHeight);
  }

  // 当 textImage 到达最终位置时，激活矩形和按钮的显示
  if (textImgY <= finalTextImgY) {
    showRectangleAndButton = true; // 激活显示矩形和 button5
  }

  // 确保矩形特效的逻辑更新，无论其是否可见
  let adjustedRectX = rectX - scrollX;
  if (showRectangleAndButton && !isFilled && mouseX > adjustedRectX && mouseX < adjustedRectX + rectWidth &&
      mouseY > rectY && mouseY < rectY + rectHeight) {
    fillAmount = min(fillAmount + 0.2, rectHeight); // 逐渐增加填充高度

    if (fillAmount === rectHeight) {
      isFilled = true; // 设置为已填充
    }
  }

  if (showRectangleAndButton && !isFilled) {
    // 设置绘制参数
    noFill();
    strokeWeight(2);
    stroke(255, 0, 0);

    // 扩大眼睛形状的宽度和高度
    let eyeWidth = rectWidth * 1.5; // 将宽度增大为原来的1.5倍
    let eyeHeight = rectHeight * 1.2; // 将高度增大为原来的1.2倍

    // 计算眼睛中心位置
    let eyeCenterX = rectX + eyeWidth / 2 -25;
    let eyeCenterY = rectY + eyeHeight / 2;

    // 绘制空心的眼睛轮廓
    beginShape();
    vertex(eyeCenterX - eyeWidth / 2, eyeCenterY); // 左尖端
    bezierVertex(
        eyeCenterX - eyeWidth / 4, eyeCenterY - eyeHeight / 2, // 左上弧
        eyeCenterX + eyeWidth / 4, eyeCenterY - eyeHeight / 2, // 右上弧
        eyeCenterX + eyeWidth / 2, eyeCenterY // 右尖端
    );
    bezierVertex(
        eyeCenterX + eyeWidth / 4, eyeCenterY + eyeHeight / 2, // 右下弧
        eyeCenterX - eyeWidth / 4, eyeCenterY + eyeHeight / 2, // 左下弧
        eyeCenterX - eyeWidth / 2, eyeCenterY // 回到左尖端
    );
    endShape(CLOSE);

    // 让填充更慢地增加
    fillAmount = min(fillAmount + 0.1, eyeHeight); // 将递增速度设为较小值，如0.5

    // 控制填充的高度，映射一个更大的范围以使填充更慢并覆盖整个眼睛
    let currentFillHeight = map(fillAmount, 0, eyeHeight, 0, eyeHeight);

    // 逐渐填充眼睛内的区域
    noStroke();
    fill(255, 0, 0);
    beginShape();
    vertex(eyeCenterX - eyeWidth / 2, eyeCenterY); // 左尖端
    bezierVertex(
        eyeCenterX - eyeWidth / 4, eyeCenterY - currentFillHeight / 2, // 左上弧，使用填充高度
        eyeCenterX + eyeWidth / 4, eyeCenterY - currentFillHeight / 2, // 右上弧，使用填充高度
        eyeCenterX + eyeWidth / 2, eyeCenterY // 右尖端
    );
    bezierVertex(
        eyeCenterX + eyeWidth / 4, eyeCenterY + currentFillHeight / 2, // 右下弧，使用填充高度
        eyeCenterX - eyeWidth / 4, eyeCenterY + currentFillHeight / 2, // 左下弧，使用填充高度
        eyeCenterX - eyeWidth / 2, eyeCenterY // 回到左尖端
    );
    endShape(CLOSE);

    // 绘制眼睛中心的文字
    fill(255, 0, 0);
    textSize(15);
    textAlign(CENTER, CENTER);
    text("", eyeCenterX, eyeCenterY);

    // 检查填充是否完成
    if (fillAmount >= eyeHeight) {
        isFilled = true; // 标记为已填满
    }

    // 显示 button5
    let button5 = buttons[4];
    let buttonWidth5 = buttonImgs[4].width * button5.scale;
    let buttonHeight5 = buttonImgs[4].height * button5.scale;
    image(buttonImgs[4], button5.x, button5.y, buttonWidth5, buttonHeight5);
  }

  // 如果矩形已填满，显示最终图片
  if (isFilled && showRectangleAndButton) {
    let imgWidth = finalImage.width * finalImageProps.scale;
    let imgHeight = finalImage.height * finalImageProps.scale;
    image(finalImage, finalImageProps.x - imgWidth / 2, finalImageProps.y - imgHeight / 2, imgWidth, imgHeight);
    // 显示 button7
    let button7 = buttons[6]; // 获取 button7 的数据
    let buttonWidth7 = buttonImgs[6].width * button7.scale;
    let buttonHeight7 = buttonImgs[6].height * button7.scale;
    image(buttonImgs[6], button7.x, button7.y, buttonWidth7, buttonHeight7);
    // 添加头像图片显示
    let avatarX = width * 0.85; // 头像的X坐标
    let avatarY = height * 0.5; // 头像的Y坐标
    let avatarScale = 0.8; // 头像的缩放比例
    image(avatarImage, avatarX, avatarY, avatarImage.width * avatarScale, avatarImage.height * avatarScale);

  }
// 在其他逻辑之后，确保 button8 也被绘制出来
if (button8Visible) {
  let button8 = buttons[7]; // 获取 button8 的数据
  let buttonWidth8 = buttonImgs[7].width * button8.scale;
  let buttonHeight8 = buttonImgs[7].height * button8.scale;
  image(buttonImgs[7], button8.x, button8.y, buttonWidth8, buttonHeight8);
}

  // 绘制 avapng2 图片
  if (showAvapng2) {
    let avapng2X = width * 0.95; // 设置 avapng2 的 X 坐标
    let avapng2Y = height * 0.4; // 设置 avapng2 的 Y 坐标
    let avapng2Scale = 0.8; // 设置 avapng2 的缩放比例
    image(avapng2Image, avapng2X, avapng2Y, avapng2Image.width * avapng2Scale, avapng2Image.height * avapng2Scale);
}

  // 确保 vent 和 finalImage 同时显示
  if (isFilled) {
    // 显示 vent
    for (let i = 0; i < n; i++) {
      vents[i].show();
      vents[i].move();
    }}
    drawEscapeButton();
  // 确保滑动提示、进度条和自定义鼠标光标在最后绘制，以保持它们在最上层
  drawProgressBar();
  
  drawCustomCursor(mouseX+scrollX, mouseY);
}



// // 绘制滑动提示的函数
// function drawSlideHint() {
//   fill(255, 0, 0); // 红色箭头
//   noStroke();

//   // 绘制向右的箭头
//   let arrowX = width * 0.40; // 箭头的X位置，可以调整
//   let arrowY = height * 0.4; // 箭头的Y位置，可以调整
//   triangle(arrowX, arrowY - 10, arrowX, arrowY + 10, arrowX + 20, arrowY);

//   // 绘制提示文字
//   textSize(14);
//   textAlign(CENTER, CENTER);
//   fill(255,0,0);
//   text("", arrowX - 40, arrowY);
// }
  
// 绘制跳动的红色小圆圈

function mousePressed() {
  startX = mouseX + scrollX;
  isDragging = true;

  // 调整后的鼠标坐标，考虑 scrollX 的影响
  let adjustedMouseX = mouseX + scrollX;
// 检查按钮 4 是否被点击
let button4 = buttons[3];  // 获取按钮 4 的数据
let buttonWidth4 = buttonImgs[3].width * button4.scale;
let buttonHeight4 = buttonImgs[3].height * button4.scale;

if (
    adjustedMouseX > button4.x &&
    adjustedMouseX < button4.x + buttonWidth4 &&
    mouseY > button4.y &&
    mouseY < button4.y + buttonHeight4
) {
    showTextImage = true;  // 显示 textpng 图片
    button4Shaking = false;  // 停止按钮4的抖动
    button4.hidden = true;  // 隐藏按钮4

    // 播放按钮4的音乐
    if (button4Sound && !button4Sound.isPlaying()) {
        button4Sound.play();
    }
}
  // 检查按钮 7 是否被点击
  let button7 = buttons[6]; // 获取按钮 7 的数据
  let buttonWidth7 = buttonImgs[6].width * button7.scale;
  let buttonHeight7 = buttonImgs[6].height * button7.scale;
  if (
    adjustedMouseX > button7.x &&
    adjustedMouseX < button7.x + buttonWidth7 &&
    mouseY > button7.y &&
    mouseY < button7.y + buttonHeight7
  ) {
    showAvapng2 = true; // 设置 avapng2 显示标志为 true
     // 播放 button7 的音频
     if (button7Sound && !button7Sound.isPlaying()) {
      button7Sound.play();
  }
  }

// 检查是否在矩形区域内双击
if (!escapeButtonVisible &&  // 禁用双击检测的条件
  adjustedMouseX > rectX1 &&
  adjustedMouseX < rectX1 + rect1Width &&
  mouseY > rectY1 &&
  mouseY < rectY1 + rect1Height) {
if (mouseButton === LEFT) {
  // 双击检测，时间间隔300ms
  if (millis() - lastClickTime < 300) {
    escapeButtonVisible = true; // 显示 ESCAPE 按钮
  }
  lastClickTime = millis(); // 更新上次点击时间
}
}

// 检查是否点击了 ESCAPE 按钮
if (escapeButtonVisible) {
if (adjustedMouseX > 3050 && adjustedMouseX < 3170 &&
    mouseY > 490 && mouseY < 510) {
  console.log("Escape button clicked, navigating...");
  window.open("../final/index.html", "_self");
}
}
}



function drawEscapeButton() {
  // 确保 escapeButtonVisible 的状态输出到控制台进行检查
  console.log("Escape Button Visible Status:", escapeButtonVisible);
  if (escapeButtonVisible) {
    let cornerRadius = 3; // 圆角半径
    let additionalWidth = 20; // 增加的宽度
    let escapeButtonXAdjusted = 3050; // X坐标
    let escapeButtonWidthAdjusted = 120; // 加宽后的按钮宽度
    let escapeButtonYAdjusted = 500; // 修改后的Y坐标

    fill(255, 0, 0);
    rect(escapeButtonXAdjusted, escapeButtonYAdjusted, escapeButtonWidthAdjusted, escapeButtonHeight, cornerRadius);

    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("ESCAPE", escapeButtonXAdjusted + escapeButtonWidthAdjusted / 2, escapeButtonYAdjusted + escapeButtonHeight / 2);
  }
}



// 鼠标释放时停止拖拽
function mouseReleased() {
  isDragging = false;
  
}

function mouseDragged() {
  if (isDragging && button6Activated) {
    // 只有在 button6 被激活后，才允许滑动
    targetScrollX = startX - mouseX;

    // 限制滑动范围，防止超出边界
    targetScrollX = constrain(targetScrollX, 0, width - windowWidth);
  }
}




function drawParticles() {
  noStroke();
  fill(255, 255, 255, 150);

  for (let particle of particles) {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < 0 || particle.x > width) {
      particle.speedX *= -1;
    }
    if (particle.y < 0 || particle.y > height) {
      particle.speedY *= -1;
    }

    ellipse(particle.x, particle.y, particle.size, particle.size);
  }
}

function drawFlashlight() {
    
  maskGraphics.clear();
    maskGraphics.background(0);

    // 使用当前光圈半径绘制光圈
    maskGraphics.erase();
    maskGraphics.ellipse(mouseX + scrollX, mouseY, lightRadius * 2, lightRadius * 2);
    maskGraphics.noErase();
 // 如果 isFilled 为 true，添加红色半透明层
 if (isFilled) {
  maskGraphics.fill(255, 0, 0, 150); // 半透明红色 (RGBA)
  maskGraphics.ellipse(mouseX + scrollX, mouseY, lightRadius * 2, lightRadius * 2);
}

    image(maskGraphics, 0, 0);

    // 检查光圈是否完全覆盖 button1
    let button1 = buttons[0];
    let buttonWidth = buttonImgs[0].width * button1.scale;
    let buttonHeight = buttonImgs[0].height * button1.scale;
    let buttonCenterX = button1.x + buttonWidth / 2;
    let buttonCenterY = button1.y + buttonHeight / 2;

    // 计算按钮中心到光圈中心的距离
    let distToLightCenter = dist(mouseX + scrollX, mouseY, buttonCenterX, buttonCenterY);

    // 如果按钮的所有边都在光圈范围内，则显示 button1 并激活 button4 的发光效果
    if (distToLightCenter + buttonWidth / 2 <= lightRadius && distToLightCenter + buttonHeight / 2 <= lightRadius) {
        // 绘制 button1
        image(buttonImgs[0], button1.x, button1.y, buttonWidth, buttonHeight);
        button6Activated = true; // 激活 button6
        }
        // 显示 button6（如果已经被激活，不再依赖光圈）
    if (button6Activated) {
      let button6 = buttons[5];
      let buttonWidth6 = buttonImgs[5].width * button6.scale;
      let buttonHeight6 = buttonImgs[5].height * button6.scale;
      image(buttonImgs[5], button6.x, button6.y, buttonWidth6, buttonHeight6);
  }
 // 检查 png11 是否在光圈内并完全显示
 if (distToLightCenter + buttonWidth / 2 <= lightRadius && distToLightCenter + buttonHeight / 2 <= lightRadius) {
  image(buttonImgs[0], button1.x, button1.y, buttonWidth, buttonHeight);
  png11FullyVisible = true; // 设置 png11 完全显示

        // 播放音乐，如果 png11 被照亮并完全显示
        if (png11FullyVisible && png11Sound && !png11Sound.isPlaying()) {
            png11Sound.play();
        }
    } else {
        png11FullyVisible = false;
    }}


let button7Visible = false; // 控制按钮7是否可见

function drawButtons() {
  let hoverShake = 2; // 抖动范围

  // 使用 for 循环确保在移除按钮时不会导致数组遍历错误
  for (let index = 0; index < buttons.length; index++) {
      // 跳过不需要处理的按钮
      if (index === 0 || index === 4 || index === 5|| index === 8) continue;

      let button = buttons[index];
      let buttonImg = buttonImgs[index]; // 获取对应的按钮图片
      let buttonWidth = buttonImg.width * button.scale; // 使用每个按钮的缩放比例
      let buttonHeight = buttonImg.height * button.scale; // 使用每个按钮的缩放比例

      let originalButtonX = button.x;
      let originalButtonY = button.y;

      let isHovered = mouseX + scrollX > button.x && mouseX + scrollX < button.x + buttonWidth && mouseY > button.y && mouseY < button.y + buttonHeight;

      // 如果是第三个按钮或第四个按钮并且它们还在抖动状态
      if ((index === 2 && button3Shaking) || (index === 3 && button4Shaking)) {
          button.x += random(-hoverShake, hoverShake);
          button.y += random(-hoverShake, hoverShake);
      }

      // 当鼠标悬停在按钮上时抖动
      if (isHovered) {
          button.x += random(-hoverShake, hoverShake);
          button.y += random(-hoverShake, hoverShake);

          // 如果点击了第三个按钮
          if (mouseIsPressed && index === 2) {
              lightRadius = maxLightRadius; // 将光圈增大到最大值
              showNewImage = true; // 显示新的图片
              button3Shaking = false; // 停止按钮3的抖动
                // 播放 button3 的音乐
                if (button3Sound && !button3Sound.isPlaying()) {
                  button3Sound.play();}
          }

          // 如果点击了第四个按钮
          if (mouseIsPressed && index === 3) {
              showTextImage = true; // 显示 textpng 图片
              button4Shaking = false; // 停止按钮4的抖动

              // 不立即移除按钮，而是隐藏它
              button.hidden = true; // 添加一个属性来标记按钮已隐藏
          }
           // 如果点击了第七个按钮，显示第八个按钮
           if (mouseIsPressed && index === 6) {
            button8Visible = true; // 使 button8 可见
        }
      }

      // 检查按钮7的可见性
      if (index === 6) { // index 6 对应按钮7
          if (!button7Visible) {
              continue; // 如果按钮7不可见，则跳过绘制
          }
          if (isHovered) {
              // 设置透明度为 150（减少原来的透明度）
              tint(255, 200); // 将透明度设置为 200（略微减少）
          } else {
              // 恢复为完全不透明
              noTint();
          }
      }

        // 绘制按钮，如果按钮未隐藏或可见
        if (!button.hidden && (index !== 7 || button7Visible) ) {
          image(buttonImg, button.x, button.y, buttonWidth, buttonHeight);
      }

      // 恢复按钮位置
      button.x = originalButtonX;
      button.y = originalButtonY;
  }

  // 重置透明度为不透明，确保后面的图片不受影响
  noTint();
}

// 在其他地方的代码中，根据条件激活按钮7，例如：
if (某个条件满足) {
    button7Visible = true; // 使按钮7可见
}



  
  function drawNewImage() {
    if (showNewImage) {
      let imgX = width * 0.0488; // 新图片的X位置，可以根据需要调整
      let imgY = height * 0.825; // 新图片的Y位置，可以根据需要调整
      let imgScale = 0.29; // 缩放比例
  
      let imgWidth = newImage.width * imgScale;
      let imgHeight = newImage.height * imgScale;
  
      image(newImage, imgX - imgWidth / 2, imgY - imgHeight / 2, imgWidth, imgHeight);
    }
  }
  

  // function drawRescueButton() {
    

  //   // 固定救援按钮的位置，不受滚动影响
  //   fill(255, 0, 0);
  //   rect(rescueButtonX, rescueButtonY, rescueButtonWidth * (rescueFillAmount / maxRescueFillAmount), rescueButtonHeight);

  //   fill(255);
  //   noStroke();
  //   textSize(20);
  //   textAlign(CENTER, CENTER);
  //   text("Rescue", rescueButtonX + rescueButtonWidth / 2, rescueButtonY - 30);

  //   drawClickAlert();}




function drawClickAlert() {
  push();
  translate(rescueButtonX + rescueButtonWidth + 40, rescueButtonY + rescueButtonHeight / 2);
  noStroke();
  fill(255, 0, 0);  // 红色圆点
  let dotY = sin(frameCount * 0.2) * 5; // 圆点垂直运动
  ellipse(0, dotY, 10, 10);  // 绘制圆点
  fill(255);  // 白色文字
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Click", 0, -30);  // 显示“Click”文字
  pop();
}



function drawProgressBar() {
  const progressBarHeight = 10;
  const progressBarY = height - progressBarHeight - 20;
  const progressBarWidth = width * 0.5;
  const progressBarX = (width - progressBarWidth) / 2;

  // 计算进度百分比
  let progress = scrollX / (width - windowWidth);

  // 绘制进度条背景
  fill(200);
  rect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

  // 绘制进度条进度
  fill(255, 0, 0);
  rect(progressBarX, progressBarY, progressBarWidth * progress, progressBarHeight);
}
function drawPulsatingRedRing(x, y) {
  // 定义周期和阶段，控制节奏
  let cycleDuration = 120; // 每个周期的总帧数
  let phase = frameCount % cycleDuration;

  // 控制快速收缩膨胀两次后的停顿
  let pulseRadius;
  if (phase < 30 || (phase >= 60 && phase < 90)) {
    // 第一段快速收缩膨胀 (0-29) 和第二段 (60-89)
    pulseRadius = 10 + 5 * sin(phase * 0.5);
  } else {
    // 停顿阶段，不脉动
    pulseRadius = 10;
  }

  noFill();
  stroke(255, 0, 0); // 红色边框
  strokeWeight(2); // 圆环的边框粗细
  ellipse(x, y, pulseRadius * 2, pulseRadius * 2); // 绘制脉动的圆环
}


function drawCustomCursor(x, y) {
  // 检查鼠标是否在矩形1范围内
  if (x > rectX1 && x < rectX1 + rect1Width && y > rectY1 && y < rectY1 + rect1Height) {
    drawPulsatingRedRing(x, y); // 在矩形范围内显示脉动的红色圆环
    
    // 播放音频提示
    if (audioCue && !audioCue.isPlaying()) {
      audioCue.setVolume(1); 
      audioCue.play();
    }
  } else {
    // 停止音频播放（如果需要）
    if (audioCue && audioCue.isPlaying()) {
      audioCue.stop();
    }

    // 其他光标样式逻辑
    if (png11FullyVisible) {
      fill(255, 0, 0);
      noStroke();
      triangle(x - 5, y - 8, x - 5, y + 8, x + 8, y); // 向右箭头
    } else {
      const crossSize = 10;
      const offset = crossSize / Math.sqrt(2);

      if (mouseIsPressed) {
        stroke(0);  // 点击时为黑色
      } else {
        stroke(255, 0, 0);  // 默认红色
      }

      strokeWeight(1.5);
      line(x - offset, y - offset, x + offset, y + offset);
      line(x - offset, y + offset, x + offset, y - offset);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth * 4, windowHeight);
}
