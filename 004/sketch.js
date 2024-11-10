let imgs = [];  // 定义图片数组
let SZE;
let clrHue, clrHueDevi, flipHueTxt;
let xmin, xmax, ymin, ymax;  // 矩形范围
let colors = ['#000000'];  // 自定义颜色数组
let buttonEffectVisible = false;  // 控制效果是否可见

let img1;  // 背景图片
let buttonImg2, buttonImgA, buttonImgB, png1, png2;  // 按钮 A、B 和 buttonImg2、png1、png2 图片
let png10;  // 定义 png10 变量
let buttonAPosition, buttonBPosition, button2Position;  // 按钮 A、B 和 buttonImg2 的位置信息
let buttonAClickCount = 0;  // 用于记录按钮 A 的点击次数
let buttonBVisible = false;  // 控制按钮 B 的显示
let buttonImg2Visible = false;  // 控制 buttonImg2 的显示
let png1Visible = false;  // 控制 png1 的显示
let png2Visible = false;  // 控制 png2 的显示
let png1Position = { x: 550, y: 70, scale: 0.28 };  // 定义 png1 的位置和缩放比例
let png2Position = { x: 550, y: 450, scale: 0.28 };  // 定义 png2 的位置和缩放比例
let png3Position = { x: 750, y: 80, scale: 0.28 };  // 自定义 png3 的位置和缩放比例
let png4Position = { x: 750, y: 420, scale: 0.28 };  // png4的位置
let png5Position = { x: 550, y: 600, scale: 0.28 };  // png5的位置
let png6Position = { x: 750, y: 600, scale: 0.28 };  // png6的位置
let png7Position = { x: 550, y: 210, scale: 0.28 };  // png7的位置
let png8Position = { x: 700, y: 220, scale: 0.28 };  // png8的位置

let png3;  // 添加 png3 和位置变量
let png3Visible = false;  // 控制 png3 的显示

let frameDelay = 6;  // 控制每隔几帧生成一个正方形
let shapesPerBatch = 8;  // 控制每次生成的正方形数量
let rectangles = [];  // 存储生成的正方形对象

let png4Visible = false;  // 控制 png4 的显示
let png5Visible = false;  // 控制 png5 的显示
let png6Visible = false;  // 控制 png6 的显示
let png7Visible = false;  // 控制 png7 的显示
let png8Visible = false;  // 控制 png8 的显示
let png9Visible = false;
let png10Visible = false;  // 控制 png10 的显示

let buttonBClickCount = 0;  // 记录按钮 B 的点击次数
let button2Visible = false;  // 控制 button2 的显示

let button2Img;  // button2 的图片
let effectStartTime = null;  // 记录生成正方形的开始时间
const effectDuration = 8000;  // 设置5秒后显示 png9 和 button2

let startTime;
let isRunning = true;
let buttonBClicked = false;  // 检查按钮 B 是否被点击

let animationImgs = [];  // 定义一个数组来存储动画图片
let customAnimations = [];  // 存储动画对象的数组
let animationRunning = true;  // 用于控制动画是否正在运行
let animationFrameDelay = 10;  // 控制动画生成的速度
let animationsPerBatch = 1;  // 每次生成多少个动画对象
let animationTimer = 0;  // 记录时间


let cursorImg;  // 默认鼠标样式图片
let hoverCursorImg;  // 悬停时鼠标样式图片
let cursorScale = 0.3;  // 定义鼠标图片的缩放比例

let bgMusic;  // 背景音乐变量
let hoverSound;  // 悬停声音变量
let animationMusic;  // 定义动画期间播放的音乐

class CustomAnimation {
  constructor(x, y, w, h, img) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = img;
  }

  display() {
    image(this.img, this.x, this.y, this.w, this.h);
  }
}
class Rectangle {
  constructor(x, y, w, h, color, img = null) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.img = img;
  }

  display() {
    if (this.img) {
      image(this.img, this.x, this.y, this.w, this.h);  // 绘制图片
    } else {
      fill(this.color);  // 使用颜色绘制
      rect(this.x, this.y, this.w, this.h);
    }
  }
}

function preload() {
  bgMusic = loadSound('mixkit-metal-industry-ambience-2509.wav');  // 替换为你的背景音频文件路径
  hoverSound = loadSound('mixkit-tape-measure-extend-810.wav');  // 替换为你的悬停音效文件路径
  animationMusic = loadSound('mixkit-fast-signing-with-a-pen-2370.wav');  // 替换为你的新音乐文件路径
 // 预加载三张自定义图片
 animationImgs.push(loadImage('animationImg1.png'));
 animationImgs.push(loadImage('animationImg2.png'));
 animationImgs.push(loadImage('animationImg3.png'));

 
  // 预加载图片
  imgs.push(loadImage("image1.jpg"));
  imgs.push(loadImage("image2.jpg"));
  imgs.push(loadImage("image3.jpg"));
  imgs.push(loadImage("image4.jpg"));
  imgs.push(loadImage("image5.jpg"));


  // 预加载背景图片和按钮图片
  img1 = loadImage('bottomImage.jpg');  // 替换为你自己的背景图片路径
  buttonImg2 = loadImage('未标题-2-21.png');  // 替换为你的第二张按钮图片路径
  buttonImgA = loadImage('buttonA.png');  // 替换为你的按钮 A 图片路径
  buttonImgB = loadImage('buttonB.png');  // 替换为你的按钮 B 图片路径
  png1 = loadImage('png1.png');  // 替换为你的 png1 图片路径
  png2 = loadImage('png2.png');  // 替换为你的 png2 图片路径
  png3 = loadImage('png3.png');  // 替换为你的 png3 图片路径
  png4 = loadImage('png4.png');  // 替换为你的 png1 图片路径
  png5 = loadImage('png5.png');  // 替换为你的 png2 图片路径
  png6 = loadImage('png6.png');  // 替换为你的 png3 图片路径
  png7 = loadImage('png7.png');  // 替换为你的 png1 图片路径
  png8 = loadImage('png8.png');  // 替换为你的 png2 图片路径
  png9 = loadImage('png9.png');  // 替换为你的 png3 图片路径
  png10 = loadImage('png10.png');

  cursorImg = loadImage('cursor1.png');  // 替换为你的默认鼠标图片路径
  hoverCursorImg = loadImage('cursor2.png');  // 替换为你的悬停鼠标图片路径

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();  // 隐藏默认鼠标指针
  noStroke();  // 全局禁用描边

 // 播放背景音乐并设置音量
if (bgMusic) {
  bgMusic.loop();  // 循环播放背景音乐
  bgMusic.setVolume(0.5);  // 设置音量（可调整）
}

  // 手动设置按钮 A 和 B 的坐标和缩放比例
  buttonAPosition = { x: 630, y: 330, scale: 0.2 };  // 自定义按钮A的位置和缩放比例
  buttonBPosition = { x: 1095, y: 70, scale: 0.15 };  // 自定义按钮B的位置和缩放比例（默认不显示）
  button2Position = { x: 1060, y: 701, scale: 0.15 };  // 自定义 buttonImg2 的位置和缩放比例

  // 设置矩形范围的自定义位置和大小
  xmin = 550;
  xmax = 950;
  ymin = 50;
  ymax = 730;

}

function draw() {
  // 清除画布，确保不会有残留图像
  background(255);

  // 绘制背景图片
  drawBackgroundImage(img1);
// 生成动画（控制速度和数量）
if (animationRunning && frameCount % animationFrameDelay === 0) {
  for (let i = 0; i < animationsPerBatch; i++) {
    let x = random(500, 850);
    let y = random(200, 400);
    let w = random(150, 160);
    let h = random(190, 200);
    let img = random(animationImgs);  // 随机选择一张自定义图片

    customAnimations.push(new CustomAnimation(x, y, w, h, img));
  }
}

// 显示所有生成的动画
for (let anim of customAnimations) {
  anim.display();
}
  // 绘制按钮 A
  drawButton(buttonImgA, buttonAPosition);

  // 如果点击了按钮 A 后显示 png1 到 png8
  if (png1Visible) {
    image(png1, png1Position.x, png1Position.y, png1.width * png1Position.scale, png1.height * png1Position.scale);  // 显示 png1
  }
  if (png2Visible) {
    image(png2, png2Position.x, png2Position.y, png2.width * png2Position.scale, png2.height * png2Position.scale);  // 显示 png2
  }
  if (png3Visible) {
    image(png3, png3Position.x, png3Position.y, png3.width * png3Position.scale, png3.height * png3Position.scale);  // 显示 png3
  }
  if (png4Visible) {
    image(png4, png4Position.x, png4Position.y, png4.width * png4Position.scale, png4.height * png4Position.scale);  // 显示 png4
  }
  if (png5Visible) {
    image(png5, png5Position.x, png5Position.y, png5.width * png5Position.scale, png5.height * png5Position.scale);  // 显示 png5
  }
  if (png6Visible) {
    image(png6, png6Position.x, png6Position.y, png6.width * png6Position.scale, png6.height * png6Position.scale);  // 显示 png6
  }
  if (png7Visible) {
    image(png7, png7Position.x, png7Position.y, png7.width * png7Position.scale, png7.height * png7Position.scale);  // 显示 png7
  }
  if (png8Visible) {
    image(png8, png8Position.x, png8Position.y, png8.width * png8Position.scale, png8.height * png8Position.scale);  // 显示 png8
  }

  // 如果按钮 A 被点击第9次后，显示按钮 B
  if (buttonBVisible) {
    drawButton(buttonImgB, buttonBPosition);
  }

  // 其他逻辑保持不变...

// 播放动画期间的音乐
if (animationRunning) {
  if (!animationMusic.isPlaying()) {
    animationMusic.loop();  // 循环播放新的音乐
    animationMusic.setVolume(0.5);  // 设置音量（可调整）
  }
} else {
  if (animationMusic.isPlaying()) {
    animationMusic.stop();  // 停止播放新音乐
  }
}

  // **持续绘制已生成的正方形或图片**
  for (let rect of rectangles) {
    rect.display();
  }

  // 检查是否继续生成新的正方形
  if (isRunning && millis() - startTime < 8000) {
    // 控制正方形生成速度
    if (buttonEffectVisible && frameCount % frameDelay === 0) {
      for (let i = 0; i < shapesPerBatch; i++) {
        const x = random(xmin, xmax);
        const y = random(ymin, ymax);
        const w = ~~abs(random(30, 50));
        const h = ~~abs(random(30, 50));

        let imgChance = random();
        if (imgChance < 0.5) {
          let chosenColor = random(colors);
          rectangles.push(new Rectangle(x, y, w, h, chosenColor));
        } else {
          let chosenImg = random(imgs);
          rectangles.push(new Rectangle(x, y, w, h, null, chosenImg));
        }
      }
    }
  }

  if (png9Visible) {
    image(png9, 670, 200, png9.width * 0.15, png9.height * 0.15);  // 调整为你的 png9 的位置和缩放比例
  }
  
  if (button2Visible) {
    drawButton(buttonImg2, button2Position);  // 绘制 button2
  }
  if (png10Visible) {
    image(png10, 1040, 170, png10.width * 0.22, png10.height * 0.22);  // 调整为你需要的 png10 位置和缩放比例
  }
  
    
  

  // 绘制自定义鼠标样式
  drawCustomCursor();
}

// 通用的绘制按钮函数，仅添加抖动效果和悬停状态检测
function drawButton(buttonImg, buttonPosition) {
  let buttonHovered = mouseX > buttonPosition.x+20 && mouseX < buttonPosition.x + buttonImg.width * buttonPosition.scale-20 &&
                      mouseY > buttonPosition.y+20 && mouseY < buttonPosition.y + buttonImg.height * buttonPosition.scale+10;

                      if (buttonHovered) {
                        isHovered = true;  // 设置悬停状态为真
                      
                        // 抖动效果
                        let shakeAmount = 2;
                        let shakeX = random(-shakeAmount, shakeAmount);
                        let shakeY = random(-shakeAmount, shakeAmount);
                      
                        // 绘制抖动后的按钮
                        image(buttonImg, buttonPosition.x + shakeX, buttonPosition.y + shakeY, 
                              buttonImg.width * buttonPosition.scale, buttonImg.height * buttonPosition.scale);
                      
                        // 播放悬停音效
                        if (!hoverSound.isPlaying()) {
                          hoverSound.play();
                        }
                      } else {
                        isHovered = false;  // 悬停状态为假
                      
                        // 绘制正常的按钮
                        image(buttonImg, buttonPosition.x, buttonPosition.y, 
                              buttonImg.width * buttonPosition.scale, buttonImg.height * buttonPosition.scale);
                      
                        // 停止播放悬停音效
                        if (hoverSound.isPlaying()) {
                          hoverSound.stop();
                        }
                      }}
                      
// 保持背景图片按比例缩放
function drawBackgroundImage(img) {
  let imgAspect = img.width / img.height;
  let canvasAspect = width / height;

  let imgWidth, imgHeight;

  if (canvasAspect > imgAspect) {
    imgHeight = height;
    imgWidth = imgAspect * imgHeight;
  } else {
    imgWidth = width;
    imgHeight = imgWidth / imgAspect;
  }

  image(img, (width - imgWidth) / 2, (height - imgHeight) / 2, imgWidth, imgHeight);
}

function drawRectImage(x, y, w, h) {
  push();
  noStroke();  // 确保禁用描边
  let imgChance = random();

  if (imgChance < 0.1) {
    let chosenColor = random(colors);
    fill(chosenColor);
    rect(x, y, w, h);  // 绘制矩形
  } else {
    let chosenImg = random(imgs);
    image(chosenImg, x, y, w, h);  // 绘制图片
  }
  pop();
}



// 自定义鼠标样式，悬停在按钮上时切换样式
function drawCustomCursor() {
  let cursorToDisplay = isHovered ? hoverCursorImg : cursorImg;

  imageMode(CENTER);  // 将光标中心设置为定位点
  image(cursorToDisplay, mouseX, mouseY, cursorToDisplay.width * cursorScale, cursorToDisplay.height * cursorScale);
  imageMode(CORNER);  // 恢复默认模式
}


function mousePressed() {
  let buttonAWidth = buttonImgA.width * buttonAPosition.scale;
  let buttonAHeight = buttonImgA.height * buttonAPosition.scale;

  // 检查是否点击了按钮 A
  if (mouseX > buttonAPosition.x && mouseX < buttonAPosition.x + buttonAWidth &&
    mouseY > buttonAPosition.y && mouseY < buttonAPosition.y + buttonAHeight) {

    // 停止动画
    animationRunning = false;
    customAnimations = [];  // 清空已生成的动画对象

    
  }
  if (mouseX > buttonAPosition.x && mouseX < buttonAPosition.x + buttonAWidth &&
    mouseY > buttonAPosition.y && mouseY < buttonAPosition.y + buttonAHeight) {
    buttonAClickCount++;

    // 根据点击次数显示不同的 png
    if (buttonAClickCount === 1) {
      png1Visible = true;  // 显示 png1
    } else if (buttonAClickCount === 2) {
      png2Visible = true;  // 显示 png2
    } else if (buttonAClickCount === 3) {
      png3Visible = true;  // 显示 png3
    } else if (buttonAClickCount === 4) {
      png4Visible = true;  // 显示 png4
    } else if (buttonAClickCount === 5) {
      png5Visible = true;  // 显示 png5
    } else if (buttonAClickCount === 6) {
      png6Visible = true;  // 显示 png6
    } else if (buttonAClickCount === 7) {
      png7Visible = true;  // 显示 png7
    } else if (buttonAClickCount === 8) {
      png8Visible = true;  // 显示 png8
    } else if (buttonAClickCount === 9) {
      buttonBVisible = true;  // 显示按钮 B
    }

    return;  // 防止其他逻辑被触发
  }

  // 如果按钮 B 可见，检查是否点击了按钮 B
  if (buttonBVisible) {
    let buttonBWidth = buttonImgB.width * buttonBPosition.scale;
    let buttonBHeight = buttonImgB.height * buttonBPosition.scale;

    if (mouseX > buttonBPosition.x && mouseX < buttonBPosition.x + buttonBWidth &&
      mouseY > buttonBPosition.y && mouseY < buttonBPosition.y + buttonBHeight) {

      buttonBClickCount++;  // 增加点击次数

      if (buttonBClickCount === 1) {
        // 第一次点击显示随机正方形
        buttonEffectVisible = true;
        isRunning = true;  // 开始运行
        startTime = millis();  // 记录开始时间
      } else if (buttonBClickCount === 2) {
        // 第二次点击显示 png9 和 button2
        png9Visible = true;
        button2Visible = true;  // 显示 button2
        // 显示 png10
  png10Visible = true;

        
      }


      return;
    }
    // 检查是否点击了 button2
if (button2Visible) {
  let button2Width = buttonImg2.width * button2Position.scale;
  let button2Height = buttonImg2.height * button2Position.scale;

  if (mouseX > button2Position.x && mouseX < button2Position.x + button2Width &&
    mouseY > button2Position.y && mouseY < button2Position.y + button2Height) {

    // 点击后跳转到指定网址
    window.location.href = '../007gravity/index.html';  // 替换为你想跳转的目标网址
  }
}
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
