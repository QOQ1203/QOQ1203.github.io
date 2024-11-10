let card; // 卡片对象
let imgFront, imgBack; // 正面和背面的图像

function preload() {
  imgFront = loadImage('frontImage.jpg'); // 加载正面图像
  imgBack = loadImage('backImage.jpg'); // 加载背面图像
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  card = new Card();
}

function draw() {
  background(0);
  card.update(); // 更新卡片状态
  card.show(); // 显示卡片
}

function mousePressed() {
  card.flip(); // 触发翻转动画
}

class Card {
  constructor() {
    this.angle = 0; // 初始化角度
    this.size = 200; // 卡片的大小
    this.flipping = false; // 是否在翻转中
    this.flipSpeed = 0.1; // 翻转速度
  }

  update() {
    if (this.flipping) {
      this.angle += this.flipSpeed; // 持续增加角度
      // 根据当前角度判断翻转完成情况
      if (this.angle >= PI) {
        this.flipping = false; // 翻转完成
        this.angle = PI; // 设置角度为PI以保持在背面
      }
    }
  }

  flip() {
    if (!this.flipping) {
      this.flipping = true; // 开始翻转
      // 根据当前角度决定翻转的目标
      if (this.angle < PI) {
        this.angle = 0; // 从正面翻转到背面
      } else {
        this.angle = PI; // 从背面翻转到正面
      }
    }
  }

  show() {
    push();
    translate(0, 0, 0); // 设定位置
    rotateY(this.angle); // 旋转角度
    noStroke(); // 去掉描边
    // 根据当前角度显示正面或背面
    if (this.angle < PI / 2) {
      texture(imgFront); // 显示正面
    } else {
      texture(imgBack); // 显示背面
    }
    plane(this.size, this.size * 1.5); // 绘制卡片
    pop();
  }
}
