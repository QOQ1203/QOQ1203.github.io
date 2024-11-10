let img1, img2;   // 三张背景图片
let buttonImg;  // 按钮图片
let buttonPosition;  // 按钮的位置信息，包含x, y和scale
let buttonVisible = true;  // 控制按钮是否显示

let newImages = [];  // 新的八张图片
let imgPositions = [];  // 存储八张图片的固定位置和缩放信息

let secondImages = [];  // 第二次点击后生成的八张图片
let secondImgPositions = [];  // 第二批图片的固定位置和缩放信息

let activeSecondImages = [];  // 控制第二批图片是否显示
let alphaValues = [];  // 存储每张图片的透明度值
let alphaStep = 6;  // 控制透明度的变化速度

let secondImgVisible = true;  // 控制第二张图的显示状态
let thirdImgVisible = false;  // 控制第三张图的显示状态


let secondImgCenters = [];  // 用于存储第二批图片的中心点
let canMoveSecondImages = false;  // 控制是否允许移动 secondImages
let draggingIndex = -1;  // 记录当前正在拖动的图片

let offsetX = 0;  // 记录鼠标点击时的X偏移
let offsetY = 0;  // 记录鼠标点击时的Y偏移
let newImagesVisible = true;  // 控制newImages是否可见
let newImagesShouldNotReappear = []; // 追踪每个 newimage 是否不应重新显示
let centerX = 1000;  // 将其改为你想要的X位置
let centerY = 500;  // 将其改为你想要的Y位置
let radius = 100;  // 你可以根据需要修改半径大小

let removeBoxVisible = false;  // 用于标记正方形是否已出现
let removeBoxImg;  // 声明一个变量来存储自定义图片

let buttonImg1, buttonImg2;

let showDragIndicator = false;  // 控制是否显示拖动标识
let dragIndicatorStartTime = 0;  // 记录标识显示的开始时间
let dragIndicatorDuration = 1000;  // 标识持续时间（毫秒）

let button1Visible = false;  // 控制 buttonImg1 是否显示
let button2Visible = false;  // 控制 buttonImg2 是否显示
let showText = true;  // 控制文字是否显示
let cursorImg;  // 默认鼠标样式图片
let hoverCursorImg;  // 悬停时鼠标样式图片
let cursorScale = 0.3;  // 定义鼠标图片的缩放比例
let secondImageHoverCursorImg;  // 悬停在 secondImages 上时的鼠标图片
let draggingCursorImg;  // 拖拽时的鼠标图片

let bgMusic;  // 背景音乐变量
let newMusic;  // 声明新音乐变量
let newClickSound;  // 声明新的点击声音变量

function preload() {
  // 预加载一张背景图片
  img1 = loadImage('background1.jpg');  // 第一张背景图片路径
  img2 = loadImage('11题-2-01.jpg');  // 预加载切换后的背景图片
  buttonImg = loadImage('11-12.png');  // 替换为你自己的按钮图片路径
  buttonImg1 = loadImage('pathtoyourbutton1.png');  // 替换为你的第一张按钮图片路径
  buttonImg2 = loadImage('pathtoyourbutton2.png');  // 替换为你的第二张按钮图片路径
  cursorImg = loadImage('cursor1.png');  // 替换为你的默认鼠标图片路径
  hoverCursorImg = loadImage('cursor2.png');  // 替换为你的悬停鼠标图片路径
  secondImageHoverCursorImg = loadImage('png3.png');
  draggingCursorImg = loadImage('png4.png');

  bgMusic = loadSound('mixkit-metal-industry-ambience-2509.wav');  // 替换为你的背景音频文件路径
  newMusic = loadSound('mixkit-single-book-paging-1101.wav');  // 替换为你新的音乐文件路径
  newClickSound = loadSound('mixkit-stiff-paper-book-paging-1103.wav'); 
  // 预加载新的八张图片
  for (let i = 0; i < 8; i++) {
    // 预加载图片点
    newImages[i] = loadImage(`image${i + 1}.png`);
    // 预加载实际图片
    secondImages[i] = loadImage(`secondImage${i + 1}.png`);
  }
  // 预加载存档图片
  removeBoxImg = loadImage('your_image_path.png');
}


function setup() {
  // 创建一个画布，大小为窗口的宽度和高度
  createCanvas(windowWidth, windowHeight);
  noCursor();  // 隐藏默认鼠标指针
 // 播放背景音乐并设置音量
if (bgMusic) {
  bgMusic.loop();  // 循环播放背景音乐
  bgMusic.setVolume(0.5);  // 设置音量（可调整）
}

  // 手动设置按钮的坐标和缩放比例
  buttonPosition = { x: 650, y: 370, scale: 0.3 };
  button1Position = { x: 200, y: 650, scale: 0.23 };  // 自定义按钮1的位置和缩放比例
  button2Position = { x: 1050, y: 651, scale: 0.23 };  // 自定义按钮2的位置和缩放比例

  // 手动设置每张图片的坐标和缩放比例
  imgPositions = [
    { x: 250, y: 350, scale: 0.3 },  // 第一张图片的位置和缩放比例
    { x: 250, y: 470, scale: 0.3 },  // 第二张图片的位置和缩放比例
    { x: 390, y: 440, scale: 0.3 },  // 第三张图片的位置和缩放比例
    { x: 570, y: 380, scale: 0.3 },  // 第四张图片的位置和缩放比例
    { x: 750, y: 350, scale: 0.3 },  // 第五张图片的位置和缩放比例
    { x: 800, y: 200, scale: 0.3 },  // 第六张图片的位置和缩放比例
    { x: 620, y: 300, scale: 0.3 },  // 第七张图片的位置和缩放比例
    { x: 1350, y: 370, scale: 0.3 }  // 第八张图片的位置和缩放比例
  ];

  // 自定义第二批图片的位置和缩放
  secondImgPositions = [
    { x: 170, y: 150, scale: 0.3 },  // 第一张新图片的位置和缩放
    { x: 180, y: 400, scale: 0.3 },  // 第二张新图片
    { x: 350, y: 370, scale: 0.3 },  // 第三张新图片
    { x: 400, y: 400, scale: 0.3 },  // 第四张新图片
    { x: 700, y: 400, scale: 0.3 },  // 第五张新图片
    { x: 800, y: 200, scale: 0.3 },  // 第六张新图片
    { x: 600, y: 130, scale: 0.3 },  // 第七张新图片
    { x: 1050, y: 270, scale: 0.3 }  // 第八张新图片
  ];

  // 初始设置第二批图片隐藏，并设置每张图片的透明度
  for (let i = 0; i < 8; i++) {
    activeSecondImages[i] = false;
    alphaValues[i] = 255;  // 初始为不透明
  }

  // 初始化 newImagesShouldNotReappear 数组，默认每个 newimage 都可以显示
  for (let i = 0; i < newImages.length; i++) {
    newImagesShouldNotReappear[i] = false;
  }
}

function draw() {
  // 清除画布，确保不会有拖拽的痕迹
  background(255); // 这里可以根据你的需求设置背景颜色

  // 绘制背景图片
  drawBackgroundImage(img1);

  // 如果主按钮可见，绘制主按钮
  if (buttonVisible) {
    let buttonHovered = mouseX > buttonPosition.x && mouseX < buttonPosition.x + buttonImg.width * buttonPosition.scale &&
      mouseY > buttonPosition.y && mouseY < buttonPosition.y + buttonImg.height * buttonPosition.scale;

    let buttonScaleFactor = buttonHovered ? 1.01 : 1.0;

    // 绘制主按钮
    image(buttonImg, buttonPosition.x, buttonPosition.y, buttonImg.width * buttonPosition.scale * buttonScaleFactor, buttonImg.height * buttonPosition.scale * buttonScaleFactor);
  }

  // 绘制 buttonImg1
if (button1Visible) {
  let button1Hovered = mouseX > button1Position.x && mouseX < button1Position.x + buttonImg1.width * button1Position.scale &&
    mouseY > button1Position.y && mouseY < button1Position.y + buttonImg1.height * button1Position.scale;

  if (button1Hovered) {
    tint(255, 128); // 半透明
  } else {
    noTint(); // 不透明
  }

  image(buttonImg1, button1Position.x, button1Position.y, buttonImg1.width * button1Position.scale, buttonImg1.height * button1Position.scale);
}

// 绘制 buttonImg2
if (button2Visible) {
  let button2Hovered = mouseX > button2Position.x && mouseX < button2Position.x + buttonImg2.width * button2Position.scale &&
    mouseY > button2Position.y && mouseY < button2Position.y + buttonImg2.height * button2Position.scale;

  if (button2Hovered) {
    tint(255, 128); // 半透明
  } else {
    noTint(); // 不透明
  }

  image(buttonImg2, button2Position.x, button2Position.y, buttonImg2.width * button2Position.scale, buttonImg2.height * button2Position.scale);
}

  // 恢复默认的透明度，确保其他图像不受影响
  noTint();

  // 如果主按钮不可见，绘制八张新图片
  if (!buttonVisible) {
    drawNewImages();
    drawHairConnections();  // 绘制连接线
    drawSecondImages();
  }
// 如果拖动标识应该显示
if (showDragIndicator) {
  let elapsedTime = millis() - dragIndicatorStartTime;

  // 检查是否超过 5 秒
  if (elapsedTime > 5000) {  // 修改为 5 秒
    showDragIndicator = false;  // 5秒后停止显示标识
  } else {
    // 标识闪烁效果：每 0.5 秒切换一次显示
    let blink = floor(elapsedTime / 1) % 2 === 0;
    if (blink) {
      drawDragIndicator();  // 调用绘制标识的函数
    }
  }
}
  
  // 检查是否所有 secondImages 已显示并控制 removeBox 的显示
  if (activeSecondImages.every(image => image) && !removeBoxVisible) {
    removeBoxVisible = true;  // 显示 removeBox
  }

  // 持续绘制 removeBox
  if (removeBoxVisible) {
    drawRemoveBox();  // 持续绘制 removeBox
  }

  // 绘制自定义鼠标样式
  drawCustomCursor();
}



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

/**
 * 加载第一组图片
 */
function drawNewImages() {
  for (let i = 0; i < newImages.length; i++) {
    if (!newImagesShouldNotReappear[i] && !activeSecondImages[i]) {
      let imgPos = imgPositions[i];
      let imgWidth = newImages[i].width * imgPos.scale;
      let imgHeight = newImages[i].height * imgPos.scale;

      // 更新透明度值
      alphaValues[i] += alphaStep;

      // 限制 alphaValues[i] 在 50 和 255 之间
      if (alphaValues[i] >= 255) {
        alphaValues[i] = 255;  // 如果超过最大值，设置为最大值
        alphaStep = -Math.abs(alphaStep);  // 反转方向，确保 step 为负
      } else if (alphaValues[i] <= 50) {
        alphaValues[i] = 50;  // 如果低于最小值，设置为最小值
        alphaStep = Math.abs(alphaStep);  // 反转方向，确保 step 为正
      }

      // 设置图片的透明度
      tint(255, alphaValues[i]);
      image(newImages[i], imgPos.x, imgPos.y, imgWidth, imgHeight);
      noTint();
    }
  }
}



function drawSecondImages() {
  secondImgCenters = [];  // 每次重新计算图片位置
  let allImagesShown = true;  // 检查所有图片是否显示完毕

  for (let i = 0; i < secondImages.length; i++) {
    if (activeSecondImages[i]) {
      let secondPos = secondImgPositions[i];

      // 如果可以移动且当前图片正在被拖动，则允许移动图片
      if (canMoveSecondImages && draggingIndex === i) {
        secondPos.x = mouseX - offsetX;  // 使用偏移量
        secondPos.y = mouseY - offsetY;  // 使用偏移量
      }

      let secondImgWidth = secondImages[i].width * secondPos.scale;
      let secondImgHeight = secondImages[i].height * secondPos.scale;
      image(secondImages[i], secondPos.x, secondPos.y, secondImgWidth, secondImgHeight);

      // 存储每张图片的中心位置
      secondImgCenters.push({
        x: secondPos.x + secondImgWidth / 2,
        y: secondPos.y + secondImgHeight / 2
      });
    } else {
      allImagesShown = false;
    }
  }

  // 当所有图片显示完毕时，启用移动功能并显示拖动标识
  if (allImagesShown && !showDragIndicator) {
    canMoveSecondImages = true;
    showDragIndicator = true;  // 显示拖动标识
    dragIndicatorStartTime = millis();  // 记录标识开始时间
  }
}


/**
 * 绘制细线连接
 */
function drawHairConnections() {
  stroke(175, 0, 13);  // 设定线条颜色为红色
  strokeWeight(0.05);  // 设置线条更细
  noFill();

  let baseTime = millis() * 0.0005;  // 增加时间变化速率，增强动态感

  // 遍历每个图片中心，连接它们之间的线条
  for (let i = 0; i < secondImgCenters.length - 1; i++) {
    for (let j = i + 1; j < secondImgCenters.length; j++) {
      let p1 = secondImgCenters[i];
      let p2 = secondImgCenters[j];

      // 绘制多条曲折的乱线，增加密集度
      for (let k = 0; k < 80; k++) {  // 每两张图片之间生成多条乱线
        let numSegments = 8;  // 每条乱线由8段组成，使线条更平滑
        let prevX = p1.x;
        let prevY = p1.y;

        for (let seg = 0; seg < numSegments; seg++) {
          // 使用 noise() 来产生平滑的目标点
          let t = seg / numSegments;
          let noiseOffsetX = noise(t + baseTime + i * k * 0.1) * 30 - 15;  // 增大X方向的随机抖动范围
          let noiseOffsetY = noise(t + baseTime + j * k * 0.1) * 30 - 15;  // 增大Y方向的随机抖动范围

          let targetX = lerp(p1.x, p2.x, t) + noiseOffsetX;  // X方向的平滑抖动
          let targetY = lerp(p1.y, p2.y, t) + noiseOffsetY;  // Y方向的平滑抖动

          // 在每个点之间绘制线段
          line(prevX, prevY, targetX, targetY);

          // 更新为下一个起始点
          prevX = targetX;
          prevY = targetY;
        }

        // 最后一段连接到 p2
        line(prevX, prevY, p2.x, p2.y);
      }
    }
  }
}


function drawRemoveBox() {
  let boxX = width - 600;  // 正方形左上角X坐标，距离窗口右边150px
  let boxY = 50;  // 正方形左上角Y坐标，距离窗口上边50px
  let boxSize = 85;  // 正方形边长

  // 检查是否所有 secondImages 已消失
  let allSecondImagesGone = activeSecondImages.every(image => !image);  // 检查所有图片是否都已隐藏

  // 如果 secondImages 全部消失，则停止颤抖
  if (!allSecondImagesGone) {
    // 添加随机颤抖效果，范围在 -2 到 2 之间
    let shakeOffsetX = random(-2, 2);
    let shakeOffsetY = random(-2, 2);
  
    // 更新 boxX 和 boxY，使正方形颤抖
    boxX += shakeOffsetX;
    boxY += shakeOffsetY;
  }

  noFill();  // 设置正方形为透明
  noStroke();
  rect(boxX, boxY, boxSize, boxSize);  // 绘制正方形
  image(removeBoxImg, boxX, boxY, boxSize, boxSize);  // 绘制自定义图片

  // 添加文字
  if (showText) {
  fill(0);  // 设置文字颜色
  textSize(13);  // 设置文字大小
  textAlign(CENTER, CENTER);  // 设置文字居中
  textStyle(BOLD);
  text("", boxX + boxSize / 2, boxY + 80);  // 在正方形上方显示文字
  }
}



function drawDragIndicator() {
  push();  // 保存当前绘图状态
  noStroke();  // 不需要描边
  fill(255, 0, 0);  // 设置标识为红色

  // 绘制一个闪烁的圆形标识，位置可以根据需要调整
  let indicatorX = width - 600;  // 标识的X位置
  let indicatorY = 68;  // 标识的Y位置
  let indicatorSize = 0;  // 标识的大小

  ellipse(indicatorX, indicatorY, indicatorSize, indicatorSize);  // 画一个圆形标识
  pop();  // 恢复绘图状态
}


function mousePressed() {
  let buttonWidth = buttonImg.width * buttonPosition.scale;
  let buttonHeight = buttonImg.height * buttonPosition.scale;

    // 检查是否点击了按钮并显示 newImages
    if (buttonVisible && mouseX > buttonPosition.x && mouseX < buttonPosition.x + buttonWidth && 
      mouseY > buttonPosition.y && mouseY < buttonPosition.y + buttonHeight) {
    buttonVisible = false;  // 隐藏按钮
    newImagesVisible = true;  // 使 newImages 可见
  } 

  // 仅当按钮隐藏且 newImages 可见时，才允许点击 newImages
  else if (!buttonVisible && newImagesVisible) {
    for (let i = 0; i < newImages.length; i++) {
      // 如果 newImagesShouldNotReappear 为 true，跳过该图片，防止点击触发 secondImages
      if (newImagesShouldNotReappear[i]) continue;

      let imgPos = imgPositions[i];
      let imgWidth = newImages[i].width * imgPos.scale;
      let imgHeight = newImages[i].height * imgPos.scale;

      // 如果鼠标点击在 newimage 上，生成 secondimage
      if (mouseX > imgPos.x && mouseX < imgPos.x + imgWidth && mouseY > imgPos.y && mouseY < imgPos.y + imgHeight) {
        activeSecondImages[i] = true;  // 显示 secondimage
      }
    }
  }

  // 检查是否可以拖动 secondImages
  if (canMoveSecondImages) {
    for (let i = 0; i < secondImages.length; i++) {
      let secondPos = secondImgPositions[i];
      let secondImgWidth = secondImages[i].width * secondPos.scale;
      let secondImgHeight = secondImages[i].height * secondPos.scale;

      if (mouseX > secondPos.x && mouseX < secondPos.x + secondImgWidth && mouseY > secondPos.y && mouseY < secondPos.y + secondImgHeight) {
        draggingIndex = i;  // 开始拖动 secondimage
        offsetX = mouseX - secondPos.x;
        offsetY = mouseY - secondPos.y;
      }
    }
  }

  // 检查是否点击了 buttonImg1
  let button1Width = buttonImg1.width * button1Position.scale;
  let button1Height = buttonImg1.height * button1Position.scale;

  if (mouseX > button1Position.x && mouseX < button1Position.x + button1Width &&
    mouseY > button1Position.y && mouseY < button1Position.y + button1Height) {
    // 跳转到 important 文件夹同级的另一个 p5.js 项目页面
    window.location.href = "../001/index.html";  // 使用相对路径跳转
    return;  // 防止其他逻辑被触发
  }

  // 添加按钮点击逻辑
  let button2Width = buttonImg2.width * button2Position.scale;
  let button2Height = buttonImg2.height * button2Position.scale;

  if (mouseX > button2Position.x && mouseX < button2Position.x + button2Width &&
    mouseY > button2Position.y && mouseY < button2Position.y + button2Height) {
    // 跳转到另一个 p5.js 项目的页面
    window.location.href = "../009/index.html";  // 替换为另一个 p5.js 项目的地址
    return;
  }
  // 计算 removeBox 位置和大小
  let boxX = width - 600;
  let boxY = 68;
  let boxSize = 100;

  // 检查是否所有 secondImages 已消失
  let allSecondImagesGone = activeSecondImages.every(image => !image);  // 检查所有图片是否都已隐藏

  // 只有当所有 secondImages 消失后，才允许点击 removeBox
  if (allSecondImagesGone && mouseX > boxX && mouseX < boxX + boxSize && mouseY > boxY && mouseY < boxY + boxSize) {
    img1 = img2;  // 直接切换到预加载好的 img2，没有延迟
     // 显示两个按钮
  button2Visible = true;
  showText = false;  // 点击后隐藏文字
  // 播放新点击声音
  if (newClickSound && !newClickSound.isPlaying()) {
    newClickSound.play();
}
  }
  
}

function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
  return !(x1 + w1 < x2 || x1 > x2 + w2 || y1 + h1 < y2 || y1 > y2 + h2);
}

function mouseReleased() {
  if (draggingIndex !== -1) {
    let secondPos = secondImgPositions[draggingIndex];
    let secondImgWidth = secondImages[draggingIndex].width * secondPos.scale;
    let secondImgHeight = secondImages[draggingIndex].height * secondPos.scale;

    let boxX = width - 600;  // removeBox 的 X 坐标
    let boxY = 68;  // removeBox 的 Y 坐标
    let boxSize = 100;  // removeBox 的大小

    let bufferSize = 50;  // 扩展区域的缓冲区大小

    // 计算图片的中心点
    let imgCenterX = secondPos.x + secondImgWidth / 2;
    let imgCenterY = secondPos.y + secondImgHeight / 2;

    // 检查图片中心点是否在 removeBox 的正方形范围内（包括缓冲区）
    if (
      imgCenterX > boxX - bufferSize && 
      imgCenterX < boxX + boxSize + bufferSize && 
      imgCenterY > boxY - bufferSize && 
      imgCenterY < boxY + boxSize + bufferSize
    ) {
      activeSecondImages[draggingIndex] = false;  // 隐藏图片
      newImagesShouldNotReappear[draggingIndex] = true;  // 标记图片为不可点击
    }
     // 播放新音乐
     if (newMusic && !newMusic.isPlaying()) {
      newMusic.play();
  }
  }
  draggingIndex = -1;  // 停止拖动
  
}




function drawCustomCursor() {
  let cursorToDisplay = cursorImg;  // 默认鼠标样式
  let isHovered = false;

  // 如果正在拖拽，则直接使用拖拽的鼠标样式
  if (draggingIndex !== -1) {
    cursorToDisplay = draggingCursorImg;  // 切换到 png4
    isHovered = true;
  } else {
    // 判断鼠标是否悬停在主按钮上，并且该按钮可见
    if (buttonVisible) {
      let buttonWidth = buttonImg.width * buttonPosition.scale;
      let buttonHeight = buttonImg.height * buttonPosition.scale;
      if (mouseX > buttonPosition.x && mouseX < buttonPosition.x + buttonWidth &&
          mouseY > buttonPosition.y && mouseY < buttonPosition.y + buttonHeight) {
        cursorToDisplay = hoverCursorImg;
        isHovered = true;
      }
    }

    // 判断鼠标是否悬停在 newImages 上，且 newImagesVisible 为 true
    if (!buttonVisible && newImagesVisible && !isHovered) {
      for (let i = 0; i < newImages.length; i++) {
        let imgPos = imgPositions[i];
        let imgWidth = newImages[i].width * imgPos.scale;
        let imgHeight = newImages[i].height * imgPos.scale;

        if (mouseX > imgPos.x && mouseX < imgPos.x + imgWidth &&
            mouseY > imgPos.y && mouseY < imgPos.y + imgHeight) {
          cursorToDisplay = hoverCursorImg;
          isHovered = true;
          break;
        }
      }
    }

    // 判断鼠标是否悬停在 secondImages 上，且 secondImages 可见并且对应的图片为可见状态
    if (!isHovered && canMoveSecondImages) {
      for (let i = 0; i < secondImages.length; i++) {
        if (activeSecondImages[i]) {  // 仅当 secondImages[i] 可见时
          let secondPos = secondImgPositions[i];
          let secondImgWidth = secondImages[i].width * secondPos.scale;
          let secondImgHeight = secondImages[i].height * secondPos.scale;

          if (mouseX > secondPos.x && mouseX < secondPos.x + secondImgWidth &&
              mouseY > secondPos.y && mouseY < secondPos.y + secondImgHeight) {
            cursorToDisplay = secondImageHoverCursorImg;  // 切换到 png3
            isHovered = true;
            break;
          }
        }
      }
    }

    // 判断鼠标是否悬停在其他按钮上，并且按钮可见
    if (!isHovered && button1Visible) {
      let button1Width = buttonImg1.width * button1Position.scale;
      let button1Height = buttonImg1.height * button1Position.scale;
      if (mouseX > button1Position.x && mouseX < button1Position.x + button1Width &&
          mouseY > button1Position.y && mouseY < button1Position.y + button1Height) {
        cursorToDisplay = hoverCursorImg;
        isHovered = true;
      }
    }

    if (!isHovered && button2Visible) {
      let button2Width = buttonImg2.width * button2Position.scale;
      let button2Height = buttonImg2.height * button2Position.scale;
      if (mouseX > button2Position.x && mouseX < button2Position.x + button2Width &&
          mouseY > button2Position.y && mouseY < button2Position.y + button2Height) {
        cursorToDisplay = hoverCursorImg;
        isHovered = true;
      }
    }
  }

  // 使用选择的鼠标样式
  imageMode(CENTER);
  image(cursorToDisplay, mouseX, mouseY, cursorToDisplay.width * cursorScale, cursorToDisplay.height * cursorScale);
  imageMode(CORNER);
}




// 当窗口大小变化时，调整画布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
