let eyePositions = [];  // 用于存储所有眼睛的位置
let eyeWidth = 150;  // 眼睛的宽度
let eyeHeight = 80;  // 眼睛的高度
let pupilSize = 50;  // 瞳孔的大小
let eyeImage;  // 存储自定义的眼球图片
let eyeBackground;  // 存储自定义的眼白图片
let maskedEyeBackground;  // 遮罩后的眼白图片
let maskedPupil;  // 遮罩后的瞳孔图片
let eyeBackgroundScaleFactor = 1.5;  // 眼白部分插入图片的放大倍数
let numEyes = 6;  // 眼睛的数量
let pupilMovementScale = 0.5;  // 缩小瞳孔活动范围的缩放因子

function preload() {
  // 加载自定义的眼球和眼白图片
  eyeImage = loadImage('13.png');  // 自定义眼球图片
  eyeBackground = loadImage('ada.png');  // 自定义眼白图片
}

function setup() {
  createCanvas(1728, 1117);  // 设置画布大小（以像素为单位）

  // 随机生成6个眼睛的位置
  for (let i = 0; i < numEyes; i++) {
    let x = random(eyeWidth / 2, width - eyeWidth / 2);  // 确保眼睛不会超出画布边缘
    let y = random(eyeHeight / 2, height - eyeHeight / 2);
    eyePositions.push({ x: x, y: y });
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
}

function draw() {
  background(0);  // 黑色背景

  // 遍历所有眼睛
  for (let i = 0; i < eyePositions.length; i++) {
    let eyeX = eyePositions[i].x;
    let eyeY = eyePositions[i].y;

    // 检测鼠标是否悬停在眼白上
    let distToMouse = dist(mouseX, mouseY, eyeX, eyeY);
    
    // 当鼠标悬停时，改变眼白的颜色为红色，保持自定义的尖锐形状
    if (distToMouse < eyeWidth / 2) {
      fill(255, 0, 0);  // 红色填充
      noStroke();
      beginShape();
      vertex(eyeX - eyeWidth / 2, eyeY);  // 左侧顶点
      bezierVertex(eyeX - eyeWidth / 4, eyeY - eyeHeight / 2, eyeX + eyeWidth / 4, eyeY - eyeHeight / 2, eyeX + eyeWidth / 2, eyeY);  // 上弧线
      bezierVertex(eyeX + eyeWidth / 4, eyeY + eyeHeight / 2, eyeX - eyeWidth / 4, eyeY + eyeHeight / 2, eyeX - eyeWidth / 2, eyeY);  // 下弧线
      endShape(CLOSE);  // 绘制自定义形状
    } else {
      // 没有悬停时绘制眼白图片
      noStroke();  // 去掉描边
      imageMode(CENTER);
      image(maskedEyeBackground, eyeX, eyeY, eyeWidth, eyeHeight);  // 绘制眼白图片
    }

    // 计算瞳孔位置，确保瞳孔在内切圆内
    let dx = mouseX - eyeX;  // 鼠标相对于眼睛中心的水平距离
    let dy = mouseY - eyeY;  // 鼠标相对于眼睛中心的垂直距离

    // 计算缩小后的内切圆半径
    let circleRadius = (eyeHeight / 2 - pupilSize / 2) * pupilMovementScale;  // 缩小内切圆的活动范围

    // 根据内切圆半径，计算瞳孔的X和Y位置，确保不超出内切圆范围
    let angle = atan2(dy, dx);  // 计算鼠标与眼睛中心的角度
    let pupilX = eyeX + cos(angle) * min(circleRadius, dist(mouseX, mouseY, eyeX, eyeY));
    let pupilY = eyeY + sin(angle) * min(circleRadius, dist(mouseX, mouseY, eyeX, eyeY));

    // 绘制瞳孔，确保不会超出缩小的内切圆范围
    image(maskedPupil, pupilX, pupilY, pupilSize, pupilSize);  // 绘制瞳孔
  }

  // 隐藏系统默认光标
  noCursor();

  // 在鼠标位置绘制一个白色圆圈作为光标
  fill(255);  // 设置为白色
  noStroke();  // 无边框
  ellipse(mouseX, mouseY, 20, 20);  // 绘制一个直径为20的白色圆圈
}
