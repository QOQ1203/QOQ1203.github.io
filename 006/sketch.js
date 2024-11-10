var words = [];
words = ["aesthetic", "sexual appetite", "love", "assistant", "reproduction", "voyeuristic desire", "vent fear", "vent anxiety"];
var img;
var gabriolaFont;

function preload() {
  img = loadImage("3.jpg");  // 预加载图片
  gabriolaFont = loadFont('Gabriola.ttf');  // 确保Gabriola.ttf字体文件在同一目录中
}

function setup() {
  createCanvas(1792, 1280);
  imageMode(CENTER);

  // 保持图片长宽比
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
  
  img.resize(imgWidth, imgHeight);  // 根据比例调整图片大小

  background(255);  // 白色背景

  textFont(gabriolaFont);  // 使用预加载的Gabriola字体文件
}

function draw() {
  for (let i = 16; i <= 96; i++) {
    textSize(random(2, 25));  // 随机的文字大小
    NewWord();  // 调用新词生成函数
  }
}

function NewWord() {
  var xPick = random(width);  // 随机的x位置
  var yPick = random(height);  // 随机的y位置
  var wordPick = random(words);  // 从words数组中随机选择单词
  var tCol = img.get(xPick, yPick);  // 从图片中获取像素颜色
  
  fill(tCol);  // 使用该颜色作为文字颜色
  text(wordPick, xPick, yPick);  // 在随机位置绘制单词
}
