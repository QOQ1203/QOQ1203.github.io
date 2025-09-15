// 单个烟花 (p5.js Web Editor 可直接运行)

let tabl = [];
let g = 0.030;   // 重力
let vsh = 40;    // 初速度系数
let t = 0, dt = 0.05;
let nblaunched = 0;
let nc = 500;    // 粒子数量（调小减少烟花点数）
let hu = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  background(20);
  frameRate(60);
}

function draw() {
  // 每一帧发射新的粒子，直到数量达到上限
  if (nblaunched < nc) {
    tabl.push(new Ball(width/2, height - 100, random(-0.4*PI, -0.6*PI), random(1, 3.5), 1, t));
    nblaunched++;
  }

  // 更新所有粒子
  for (let i = 0; i < tabl.length; i++) {
    tabl[i].update();
  }

  t += dt;
  hu++;
}

// 烟花粒子类
class Ball {
  constructor(x, y, alpha, vsh, visible, t0) {
    this.x = x;
    this.y = y;
    this.alpha = alpha;
    this.vsh = vsh;
    this.visible = visible;
    this.t0 = t0;
  }

  update() {
    // 抛物线运动
    this.x = this.x + this.vsh * cos(this.alpha) * (t - this.t0);
    this.y = this.y + this.vsh * sin(this.alpha) + 0.5 * g * pow(t - this.t0, 2);

    if (this.y > height) {
      this.visible = 0;
    }

    if (this.visible == 1) {
      stroke(hu % 255, 200, 255);
      fill((hu + 60) % 255, 255, 255);
      circle(this.x, this.y, 6);
    }
  }
}
