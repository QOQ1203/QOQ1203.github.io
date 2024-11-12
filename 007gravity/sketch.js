let xOffset = 0;
let eyePositions = [];  // 用于存储所有眼睛的位置
let eyeWidth = 150;  // 眼睛的宽度
let eyeHeight = 80;  // 眼睛的高度
let pupilSize = 50;  // 瞳孔的大小
let eyeImage;  // 存储自定义的眼球图片
let eyeBackground;  // 存储自定义的眼白图片
let maskedEyeBackground;  // 遮罩后的眼白图片
let maskedPupil;  // 遮罩后的瞳孔图片
let eyeBackgroundScaleFactor = 1.5;  // 眼白部分插入图片的放大倍数
let numEyes = 16;  // 眼睛的数量
let pupilMovementScale = 0.5;  // 缩小瞳孔活动范围的缩放因子
let previousMouseX, previousMouseY;  // 存储前一帧的鼠标位置


let pngImages = [];  // 存储png1到png12图片
let pngVisible = [];  // 控制png图片是否可见
let pngPositions = [];  // 存储每张图片的自定义位置
let pngSizes = [];      // 存储每张图片的大小
let pngScaleFactors = [];

let button;  // 定义按钮变量
let showButton = false;  // 初始情况下按钮不显示

let trail = [];
const MAX_TRAIL_LENGTH = 30
let isDragging = false;
let startX, scrollX = 0, targetScrollX = 0;
let canvasWidth;
let customFont;  // 用于存储加载的字体


let bgMusic;  // 背景音乐变量
let eyeSounds = [];  // 存储每个眼睛的音频
let eyeSoundPlayed = [];  // 跟踪每个音频是否已播放
let windowWidth = 1650
let windowHeight = 800
let canvas;
function preload() {
	// 加载自定义的眼球和眼白图片
	eyeImage = loadImage('13.png');  // 自定义眼球图片
	eyeBackground = loadImage('ada.png');  // 自定义眼白图片
    bgMusic = loadSound('11月1日(1).WAV');  // 替换为你的背景音频文件路径
     
  // 加载音频文件，每个音频文件对应不同的眼睛
  for (let i = 1; i <= 16; i++) {
    eyeSounds[i - 1] = loadSound(`eyeSound${i}.wav`, () => {
        console.log(`eyeSound${i}.wav loaded successfully`);
    });
    eyeSoundPlayed[i - 1] = false;
}
	 // 加载png1到png12图片
	 for (let i = 1; i <= 12; i++) {
        pngImages[i - 1] = loadImage(`png${i}.png`, () => {
            console.log(`png${i}.png loaded with size: ${pngImages[i-1].width}x${pngImages[i-1].height}`);
        });
        pngVisible[i - 1] = false;  // 初始化为不可见
    }
}

class Eye {
    constructor(name, position, pngIndex = null,soundIndex = null) {
        this.name = name;  // 眼睛名称
        this.position = position;  // 眼睛位置
        this.pngIndex = pngIndex;  // 如果为1-12，则会有相应的png图片
        this.soundIndex = soundIndex;
    }

    // 判断是否点击了该眼睛，使用 scrollX 进行偏移
    isClicked(mx, my) {
        let adjustedEyeX = this.position.x - scrollX; // 眼睛位置也受 scrollX 影响
        let distToMouse = dist(mx, my, adjustedEyeX, this.position.y); // 使用调整后的眼睛位置
        return distToMouse < eyeWidth / 2;
    }

    display() {
        let eyeX = this.position.x - scrollX; // 使用 scrollX 修正眼睛的位置
        let eyeY = this.position.y;
        let distToMouse = dist(mouseX + scrollX, mouseY, eyeX, eyeY);

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

        let dx = (mouseX + scrollX) - eyeX;
        let dy = mouseY - eyeY;
        let circleRadius = (eyeHeight / 2 - pupilSize / 2) * pupilMovementScale;
        let angle = atan2(dy, dx);
        let pupilX = eyeX + cos(angle) * min(circleRadius, dist(mouseX + scrollX, mouseY, eyeX, eyeY));
        let pupilY = eyeY + sin(angle) * min(circleRadius, dist(mouseX + scrollX, mouseY, eyeX, eyeY));

        image(maskedPupil, pupilX, pupilY, pupilSize, pupilSize);
    }
}

// 存储所有眼睛的数组
let eyes = [];

function setup() {
    // 禁用鼠标滚动的默认行为
    document.addEventListener('wheel', preventDefaultScroll, { passive: false });
	frameRate(30);
    canvasWidth = windowWidth * 2; // 设置画布宽度为窗口的两倍
    canvas = createCanvas(canvasWidth, windowHeight);
	background(255);
     // 设置页面的 CSS 背景为黑色
     document.body.style.backgroundColor = "#000000";
       // 隐藏浏览器滚动条
    document.body.style.overflow = "hidden";
   // 播放背景音乐并设置音量
if (bgMusic) {
    bgMusic.loop();  // 循环播放背景音乐
    bgMusic.setVolume(0.5);  // 设置音量（可调整）
  }

 // 创建按钮并隐藏
 button = createButton('What is Desire');
 button.position(1300, windowHeight * 0.8);  // 自定义按钮位置
 button.size(200, 50);  // 自定义按钮大小
 button.style('background-color', '#ff0000'); // 背景颜色红色
 button.style('color', '#ffffff');            // 文字颜色白色
 button.style('border', 'none');              // 去除边框（可选）

button.style('border-radius', '5px');        // 设置圆角


 button.mousePressed(() => {
     window.location.href = '../important/index.html';  // 替换为你想跳转的网址
 });
 button.hide();  // 初始隐藏
 console.log("windowWidth:", windowWidth, "canvasWidth:", canvasWidth);

	// 初始化眼睛并赋予名称和对应图片索引
    let eyeData = [
        { name: 'eye1', position: { x: windowWidth * 0.1, y: windowHeight * 0.5 }, pngIndex: 0 , soundIndex: 0},
        { name: 'eye2', position: { x: windowWidth * 0.2, y: windowHeight * 0.8 }, pngIndex: 1, soundIndex: 1 },
        { name: 'eye3', position: { x: windowWidth * 0.28, y: windowHeight * 0.65 }, pngIndex: 2 , soundIndex: 2},
        { name: 'eye4', position: { x: windowWidth * 0.25, y: windowHeight * 0.75 }, pngIndex: 3 , soundIndex: 3},
        { name: 'eye5', position: { x: windowWidth * 0.87, y: windowHeight * 0.85 }, pngIndex: 4 , soundIndex: 4},
        { name: 'eye6', position: { x: windowWidth * 1.12, y: windowHeight * 0.14 }, pngIndex: 5 , soundIndex: 5},
        { name: 'eye7', position: { x: windowWidth * 1.05, y: windowHeight * 0.25 }, pngIndex: 6 , soundIndex: 6},
        { name: 'eye8', position: { x: windowWidth * 1.28, y: windowHeight * 0.15 }, pngIndex: 7 , soundIndex: 7},
        { name: 'eye9', position: { x: windowWidth * 1.52, y: windowHeight * 0.22 }, pngIndex: 8 , soundIndex: 8},
        { name: 'eye10', position: { x: windowWidth * 1.52, y: windowHeight * 0.9 }, pngIndex: 9 , soundIndex: 9},
        { name: 'eye11', position: { x: windowWidth * 1.82, y: windowHeight * 0.45 }, pngIndex: null , soundIndex: 10},
        { name: 'eye12', position: { x: windowWidth * 1.93, y: windowHeight * 0.55 }, pngIndex: null, soundIndex: 11 },
        { name: 'eye13', position: { x: windowWidth * 0.44, y: windowHeight * 0.14 }, pngIndex: null , soundIndex: 12},
        { name: 'eye14', position: { x: windowWidth * 0.52, y: windowHeight * 0.15 }, pngIndex: null , soundIndex: 13},
        { name: 'eye15', position: { x: windowWidth * 0.78, y: windowHeight * 0.9 }, pngIndex: null , soundIndex: 14},
        { name: 'eye16', position: { x: windowWidth * 1.1, y: windowHeight * 0.9 }, pngIndex: null , soundIndex: 15},
    ];

    // 创建 Eye 实例并推入数组
    for (let data of eyeData) {
        eyes.push(new Eye(data.name, data.position, data.pngIndex, data.soundIndex));
    }

	
	// 创建尖头的眼睛形状遮罩
	let maskGraphic = createGraphics(eyeWidth, eyeHeight);
	maskGraphic.beginShape();
	maskGraphic.vertex(eyeWidth / 2 - eyeWidth / 2, eyeHeight / 2);  // 左侧顶点
	maskGraphic.bezierVertex(eyeWidth / 4, 0, eyeWidth * 3 / 4, 0, eyeWidth, eyeHeight / 2);  // 上弧线
	maskGraphic.bezierVertex(eyeWidth * 3 / 4, eyeHeight, eyeWidth / 4, eyeHeight, eyeWidth / 2 - eyeWidth / 2, eyeHeight / 2);  // 下弧线
	maskGraphic.endShape(CLOSE);  // 封闭形状

	// 调整眼白图片大小并应用自定义遮罩
	eyeBackground.resize(eyeWidth * eyeBackgroundScaleFactor, 0);  // 放大眼白图片，保持比例
	maskedEyeBackground = eyeBackground.get();  // 获取眼白图片
	maskedEyeBackground.mask(maskGraphic);  // 将遮罩应用到眼白图片上

	// 创建瞳孔的遮罩
	eyeImage.resize(pupilSize, pupilSize);  // 调整瞳孔大小
	maskedPupil = eyeImage.get();  // 获取瞳孔图片
	let pupilMaskGraphic = createGraphics(pupilSize, pupilSize);
	pupilMaskGraphic.ellipse(pupilSize / 2, pupilSize / 2, pupilSize, pupilSize);  // 瞳孔遮罩
	maskedPupil.mask(pupilMaskGraphic);  // 应用遮罩到瞳孔图片

// 定义每张图片的位置
pngPositions = [
	{ x: windowWidth * 0.1, y: windowHeight * 0.5 },
	{ x: windowWidth * 0.2, y: windowHeight * 0.8 },
	{ x: windowWidth * 0.3, y: windowHeight * 0.4 },
	{ x: windowWidth * 0.53, y: windowHeight * 0.6 },
	{ x: windowWidth * 0.75, y: windowHeight * 0.35 },
	{ x: windowWidth * 1.1, y: windowHeight * 0.15 },
	{ x: windowWidth * 0.99, y: windowHeight * 0.55 },
	{ x: windowWidth * 1.25, y: windowHeight * 0.6 },
	{ x: windowWidth * 1.56, y: windowHeight * 0.35 },
	{ x: windowWidth * 1.8, y: windowHeight * 0.8 },
	{ x: windowWidth * 1.8, y: windowHeight * 0.45 },
	{ x: windowWidth * 1.9, y: windowHeight * 0.5 }
];
// 定义每张图片的缩放倍数
 pngScaleFactors = [
    0.2,  // 图片1缩放倍数
    0.2,  // 图片2缩放倍数
    0.25,  // 图片3缩放倍数
    0.25,  // 图片4缩放倍数
    0.25,  // 图片5缩放倍数
    0.25,  // 图片6缩放倍数
    0.25,  // 图片7缩放倍数
    0.25,  // 图片8缩放倍数
    0.25,  // 图片9缩放倍数
    0.25,  // 图片10缩放倍数
    0.3,  // 图片11缩放倍数
    0.3   // 图片12缩放倍数
];




	// 粒子效果相关参数
	originX = width / 2 * 0.09;
	originY = windowHeight / 2;
	tendrils = [new tendril(originX, originY, startingangle, startinglength)];
}

// 粒子效果的相关变量
let randomsizelow = 0.8;
let randomsizehigh = 1.3;
let randomanglebounds = Math.PI / 5 ;  // 设置生成方式 数值32是头发
let newtendrilchance = 3;
let tendrilcap = 10000;
let originX;
let originY;
let startingangle = 0;
let startinglength = 1;
let tendrils = [];

function tendril(startingX, startingY, angle, size) {
	this.x = startingX;
	this.y = startingY;
	this.tipx = startingX;
	this.tipy = startingY;

	this.size = size;
	this.angle = angle;

	this.segments = [];

	this.move = function() {
		this.size *= random(randomsizelow, randomsizehigh);
		this.angle += random(-randomanglebounds, randomanglebounds);

		this.x = this.tipx;
		this.y = this.tipy;

		this.tipx += this.size * cos(this.angle);
		this.tipy += this.size * sin(this.angle);

		// 新 tendril 在当前 tendril 的末端生成，但不能是太小的终端 tendril
		if (floor(random(0, newtendrilchance)) == 0 && this.size > 1 && tendrils.length < tendrilcap) {
			tendrils.splice(0, 0, new tendril(this.tipx, this.tipy, this.angle, this.size));
		}
	}

	this.drawsegments = function() {
		noFill();
		stroke(255, 0, 0);
		strokeWeight(0.3);
		line(this.x, this.y, this.tipx, this.tipy);
	}
}

function processtendrils() {
	for (let index = 0; index < tendrils.length; index++) {
		tendrils[index].move();
		tendrils[index].drawsegments();
	}
}






// 禁用浏览器默认滚动
function preventDefaultScroll(event) {
    event.preventDefault();
}
function draw() {
    background(0,0,0,60)
    // 绘制 tendrils（粒子效果），不会被背景覆盖


    translate(-scrollX, 0);

    processtendrils();

    // 遍历所有剩余眼睛，重新绘制眼睛和瞳孔
    for (let i = 0; i < eyePositions.length; i++) {
        let eyeX = eyePositions[i].x;
        let eyeY = eyePositions[i].y;

        // 检测鼠标是否悬停在眼白上
        let distToMouse = dist(mouseX, mouseY, eyeX, eyeY);

        // 当鼠标悬停时，改变眼白的颜色为红色
        if (distToMouse < eyeWidth / 2) {
            fill(255, 0, 0);  // 红色填充
            noStroke();
            beginShape();
            vertex(eyeX - eyeWidth / 2, eyeY);
            bezierVertex(eyeX - eyeWidth / 4, eyeY - eyeHeight / 2, eyeX + eyeWidth / 4, eyeY - eyeHeight / 2, eyeX + eyeWidth / 2, eyeY);
            bezierVertex(eyeX + eyeWidth / 4, eyeY + eyeHeight / 2, eyeX - eyeWidth / 4, eyeY + eyeHeight / 2, eyeX - eyeWidth / 2, eyeY);
            endShape(CLOSE);  // 绘制自定义形状
        } else {
            // 没有悬停时绘制眼白图片
            noStroke();
            imageMode(CENTER);
            image(maskedEyeBackground, eyeX, eyeY, eyeWidth, eyeHeight);  // 绘制眼白图片
        }

        // 计算瞳孔位置，确保瞳孔在内切圆内
        let dx = mouseX - eyeX;
        let dy = mouseY - eyeY;

        // 计算缩小后的内切圆半径
        let circleRadius = (eyeHeight / 2 - pupilSize / 2) * pupilMovementScale;

        // 根据内切圆半径，计算瞳孔的位置，确保不超出内切圆范围
        let angle = atan2(dy, dx);
        let pupilX = eyeX + cos(angle) * min(circleRadius, dist(mouseX, mouseY, eyeX, eyeY));
        let pupilY = eyeY + sin(angle) * min(circleRadius, dist(mouseX, mouseY, eyeX, eyeY));

        // 绘制瞳孔，确保不会超出缩小的内切圆范围
        image(maskedPupil, pupilX, pupilY, pupilSize, pupilSize);
    }
// 遍历所有眼睛，重新绘制眼睛
for (let eye of eyes) {
    eye.display();
}
   // 显示PNG图片
for (let i = 0; i < 12; i++) {
    if (pngVisible[i]) {
        let img = pngImages[i];  // 获取当前图片
        let scaleFactor = pngScaleFactors[i];  // 获取图片的缩放倍数

        // 使用图片的原始宽度和高度，并应用缩放倍数
        let width = img.width * scaleFactor;  // 缩放后的宽度
        let height = img.height * scaleFactor;  // 缩放后的高度

        // 使用自定义的图片位置显示图片，并应用 scrollX 偏移
        let posX = pngPositions[i].x - scrollX;  // 加上 scrollX 偏移量
        let posY = pngPositions[i].y;

        // 显示图片，使用缩放后的宽度和高度
        image(img, posX, posY, width, height);
    }
}

    // 如果所有眼睛都消失，显示按钮
    if (eyes.length === 0 && !showButton) {
        showButton = true;
        button.show();
        button.position(windowWidth -200 , windowHeight * 0.5); // 动态调整按钮位置
    }
    
    drawProgressBar();
    // 隐藏系统默认光标
    noCursor();
  // 自定义鼠标光标位置，确保光标随画布平移而移动
  let adjustedMouseX = mouseX + scrollX;
  let adjustedMouseY = mouseY;
  // 绘制自定义红色光圈光标
  fill(255, 0, 0, 120); // 红色，半透明
  noStroke();
  ellipse(adjustedMouseX, adjustedMouseY, 10, 10); // 直径为10的光圈

  // 绘制红色模糊尾巴的效果
  stroke(255, 0, 0, 50);
  strokeWeight(3);
  for (let i = 0; i < 20; i++) {
      let alpha = map(i, 0, 20, 100, 0);
      stroke(255, 0, 0, alpha);

      let tailX = lerp(adjustedMouseX, pmouseX + scrollX, i / 20);
      let tailY = lerp(adjustedMouseY, pmouseY, i / 20);
      point(tailX, tailY);
  
    
  }
}

function drawProgressBar() {
    const progressBarHeight = 10;
    const progressBarY = height - progressBarHeight - 20;
    const progressBarWidth = width * 0.5;
    const progressBarX = (width - progressBarWidth) / 2-400;
  
    // 计算进度百分比，使用 canvasWidth 而不是 width
    let progress = scrollX / 900;
  
    // 绘制进度条背景
    fill(200);
    rect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
  
    // 绘制进度条进度
    fill(255, 0, 0);
    rect(progressBarX, progressBarY, progressBarWidth * progress, progressBarHeight);
}

function mousePressed() {
    let adjustedMouseX = mouseX + scrollX; // 考虑 scrollX 偏移的实际点击位置

    // 检查每个眼睛是否被点击
    for (let i = 0; i < eyes.length; i++) {
        if (eyes[i].isClicked(adjustedMouseX, mouseY)) { // 使用调整后的鼠标坐标
            if (eyes[i].pngIndex !== null) {
                pngVisible[eyes[i].pngIndex] = true;  // 确保滑动后仍能触发 png 显示
            }
      // 检查是否播放过对应的音频
      let soundIndex = eyes[i].soundIndex;  // 获取当前眼睛的音频索引
      if (eyeSounds[soundIndex] && !eyeSoundPlayed[soundIndex]) {
          eyeSounds[soundIndex].play();
          eyeSoundPlayed[soundIndex] = true;  // 标记该音频已播放
      }
            eyes.splice(i, 1);  // 删除被点击的眼睛
            break;
        }
    }

    startX = adjustedMouseX;  // 在滑动开始时记录实际位置
    isDragging = true;
}

function mouseDragged() {
    if (isDragging) {
        scrollX = startX - mouseX;
        scrollX = constrain(scrollX, 0, 900);
    }
}

function centerCanvas() {
    // 计算画布位置，使其居中于屏幕
    let x = (window.innerWidth - windowWidth) / 2;
    let y = (window.innerHeight - windowHeight) / 2;
    canvas.position(x, y);
  }
function mouseReleased() {
    isDragging = false;
}
function windowResized() {
    resizeCanvas(windowWidth * 2, windowHeight);
    centerCanvas();  // 重新居中画布
    
    canvasWidth = windowWidth * 2; // 更新画布宽度
}