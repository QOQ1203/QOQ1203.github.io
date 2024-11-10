let bgImage; // 背景图片
let images = []; // 初始8张图片
let secondImages = []; // 点击后出现的8张图片
let positions = []; // 初始图片的位置
let secondPositions = []; // 第二组图片的位置
let mmToPxWidth, mmToPxHeight; // 原始画布尺寸
let words = ["aesthetic", "voyeuristic desire", "sexual appetite", "love", "reproduction", "assistant", "vent fear", "vent anxiety", "thrill"]; // 词汇数组
let displayedWords = []; // 显示的词汇
let clearButton; // 按钮

let buttonX, buttonY, buttonWidth = 100, buttonHeight = 30; // 按钮的位置信息
let activeSecondImages = []; // 第二组图片显示状态

function preload() {
  // 预加载背景图片
  bgImage = loadImage('未标题-1-03.jpg'); // 替换成你的背景图片路径
  
  // 预加载8张初始图片
  for (let i = 0; i < 8; i++) {
    images[i] = loadImage(`image${i + 1}.jpg`); // 替换为你的图片路径
  }

  // 预加载8张第二组图片
  for (let i = 0; i < 8; i++) {
    secondImages[i] = loadImage(`secondImage${i + 1}.jpg`); // 替换为你的第二组图片路径
  }
}

function setup() {
  // 设置画布的尺寸为 1728mm x 1117mm
  mmToPxWidth = 1728 * 3.7795275591; // 将毫米转换为像素 (1mm ≈ 3.78px)
  mmToPxHeight = 1117 * 3.7795275591;

  createCanvas(mmToPxWidth, mmToPxHeight); // 创建画布
  pixelDensity(2); // 设置高像素密度，确保画面清晰
  noSmooth(); // 关闭抗锯齿，避免模糊
  imageMode(CENTER); // 使用图片中心作为绘制的参考点

  noCursor(); // 隐藏默认的鼠标指针

  // 创建按钮并设置其位置向左边移动
  clearButton = createButton('Clear Words');
  clearButton.size(buttonWidth, buttonHeight);
  clearButton.position(width - 200, 20); // 将按钮从右上角向左移动
  clearButton.mousePressed(clearWords); // 点击按钮时执行 clearWords 函数

  // 设置按钮的位置信息
  buttonX = width - 200;
  buttonY = 20;

  // 设置初始图片的显示位置
  positions = [
    { x: 860, y: 1667 },  // 第一张图片的位置
    { x: 820, y: 3573 },  // 第二张图片的位置
    { x: 3200, y: 4700 },  // 第三张图片的位置
    { x: 5700, y: 3400 }, // 第四张图片的位置
    { x: 5200, y: 900 },  // 第五张图片的位置
    { x: 6250, y: 2300 },  // 第六张图片的位置
    { x: 7000, y: 1900 },  // 第七张图片的位置
    { x: 7500, y: 3800 }  // 第八张图片的位置
  ];

  // 设置第二组图片的显示位置
  secondPositions = [
    { x: 860, y: 1167 },  // 第一张第二组图片的位置
    { x: 820, y: 3573 },  // 第二张第二组图片的位置
    { x: 3200, y: 4700 },  // 第三张第二组图片的位置
    { x: 5700, y: 3400 }, // 第四张第二组图片的位置
    { x: 5200, y: 900 },  // 第五张第二组图片的位置
    { x: 6250, y: 1900 },  // 第六张第二组图片的位置
    { x: 7000, y: 1900 },  // 第七张第二组图片的位置
    { x: 7500, y: 3800 }  // 第八张第二组图片的位置
  ];

  // 初始设置第二组图片为隐藏状态
  for (let i = 0; i < 8; i++) {
    activeSecondImages[i] = false;
  }
}

function draw() {
  // 每帧都需要重新绘制背景以避免鼠标残影问题
  clear(); // 清除之前的绘制内容
  
  // 背景图片的 cover 填充模式，保持比例，超出的部分裁剪掉
  let imgAspect = bgImage.width / bgImage.height;
  let canvasAspect = width / height;

  let newWidth, newHeight, xOffset = 0, yOffset = 0;

  if (canvasAspect > imgAspect) {
    // 背景图片按高度缩放
    newHeight = height;
    newWidth = imgAspect * height;
    xOffset = (width - newWidth) / 2;
  } else {
    // 背景图片按宽度缩放
    newWidth = width;
    newHeight = width / imgAspect;
    yOffset = (height - newHeight) / 2;
  }

  image(bgImage, width / 2, height / 2, newWidth, newHeight); // 绘制背景图片

  // 绘制初始8张图片
  for (let i = 0; i < images.length; i++) {
    if (!activeSecondImages[i]) {  // 如果第二组图片显示时，隐藏第一组
      let img = images[i];
      let pos = positions[i];

      // 计算图片的新宽度和高度，保持原始比例缩放
      let imgNewWidth = img.width * (newWidth / bgImage.width);
      let imgNewHeight = img.height * (newHeight / bgImage.height);
      let newX = pos.x * (newWidth / bgImage.width) + xOffset;
      let newY = pos.y * (newHeight / bgImage.height) + yOffset;

      // 检查鼠标是否悬停在图片上，悬停时放大
      let isHovered = mouseX > newX && mouseX < newX + imgNewWidth && mouseY > newY && mouseY < newY + imgNewHeight;
      let scaleFactor = isHovered ? 1.1 : 1.0;

      // 绘制初始图片
      image(img, newX + imgNewWidth / 2, newY + imgNewHeight / 2, imgNewWidth * scaleFactor, imgNewHeight * scaleFactor);
    }
  }

  // 绘制第二组图片
  for (let i = 0; i < secondImages.length; i++) {
    if (activeSecondImages[i]) {
      let img = secondImages[i];
      let pos = secondPositions[i];

      // 计算图片的新宽度和高度，保持原始比例缩放
      let imgNewWidth = img.width * (newWidth / bgImage.width);
      let imgNewHeight = img.height * (newHeight / bgImage.height);
      let newX = pos.x * (newWidth / bgImage.width) + xOffset;
      let newY = pos.y * (newHeight / bgImage.height) + yOffset;

      // 绘制第二组图片
      image(img, newX + imgNewWidth / 2, newY + imgNewHeight / 2, imgNewWidth, imgNewHeight);
    }
  }

  // 绘制所有显示过的词汇
  for (let i = 0; i < displayedWords.length; i++) {
    let wordData = displayedWords[i];
    fill('#AF000D'); // 设置字体颜色
    noStroke(); // 取消描边
    textSize(wordData.size); // 设置字体大小
    textFont('Gabriola'); // 使用Gabriola字体
    text(wordData.word, wordData.x, wordData.y); // 显示词汇
  }

  // 绘制自定义鼠标光标
  drawCustomCursor();
}

// 清除所有已显示的词汇
function clearWords() {
  displayedWords = []; // 清空显示过的词汇数组
}

// 当鼠标点击时选择随机词汇或切换图片
function mousePressed() {
  // 检查鼠标是否点击了按钮区域，防止在点击按钮时生成文字
  if (mouseX > buttonX && mouseX < buttonX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight) {
    return; // 鼠标点击在按钮上时不生成文字
  }

  // 检查是否点击了第二组图片，先处理第二组图片的点击逻辑
  for (let i = 0; i < secondImages.length; i++) {
    if (activeSecondImages[i]) {
      let pos = secondPositions[i];
      let imgNewWidth = secondImages[i].width * (width / bgImage.width);
      let imgNewHeight = secondImages[i].height * (height / bgImage.height);
      let newX = pos.x * (width / bgImage.width);
      let newY = pos.y * (height / bgImage.height);

      // 如果点击了第二组图片，隐藏该图片
      if (mouseX > newX && mouseX < newX + imgNewWidth && mouseY > newY && mouseY < newY + imgNewHeight) {
        activeSecondImages[i] = false; // 隐藏图片
        return; // 停止执行，避免冲突
      }
    }
  }

  // 检查是否点击了初始图片，切换显示第二组图片
  for (let i = 0; i < positions.length; i++) {
    let pos = positions[i];
    let imgNewWidth = images[i].width * (width / bgImage.width);
    let imgNewHeight = images[i].height * (height / bgImage.height);
    let newX = pos.x * (width / bgImage.width);
    let newY = pos.y * (height / bgImage.height);

    // 如果点击了初始图片，显示相应的第二组图片
    if (mouseX > newX && mouseX < newX + imgNewWidth && mouseY > newY && mouseY < newY + imgNewHeight) {
      activeSecondImages[i] = true; // 显示相应的第二组图片
    }
  }

  // 点击时生成随机词汇
  let randomIndex = Math.floor(Math.random() * words.length); // 随机选择一个词汇
  let newWord = {
    word: words[randomIndex], // 获取随机的词汇
    x: mouseX, // 词汇的 X 位置
    y: mouseY, // 词汇的 Y 位置
    size: 30 // 字体大小为 30
  };
  displayedWords.push(newWord); // 将词汇及其位置和大小信息存储在数组中
}

// 绘制自定义鼠标光标
function drawCustomCursor() {
  const cursorSize = 30;
  const crossSize = cursorSize / 2;

  // 检查鼠标是否在背景图片范围内，只有在背景图片范围内才绘制光标
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (mouseIsPressed) {
      fill(0);  // 点击时光标填充变为黑色
    } else {
      fill(255);  // 未点击时光标填充为白色
    }
    
    // 绘制正方形光标的边框
    stroke(255, 0, 0);  // 红色描边
    strokeWeight(2);
    rect(mouseX - cursorSize / 2, mouseY - cursorSize / 2, cursorSize, cursorSize); // 正方形光标
    
    // 绘制红色十字
    stroke(255, 0, 0); // 红色
    strokeWeight(3);
    line(mouseX - crossSize / 2, mouseY, mouseX + crossSize / 2, mouseY); // 横线
    line(mouseX, mouseY - crossSize / 2, mouseX, mouseY + crossSize / 2); // 纵线
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);  // 当窗口大小改变时，调整画布大小
  buttonX = width - 200; // 更新按钮的 X 坐标
  clearButton.position(buttonX, 20); // 确保按钮随窗口大小调整位置
}
