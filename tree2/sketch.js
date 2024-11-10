let nodes = [];
let links = [];

function setup() {
  createCanvas(600, 400);
  // 定义节点
  nodes = [
    {name: "A"},
    {name: "B"},
    {name: "C"},
    {name: "D"}
  ];

  // 定义链接，源节点和目标节点的索引，以及流量值
  links = [
    {source: 0, target: 1, value: 10},
    {source: 0, target: 2, value: 20},
    {source: 1, target: 3, value: 5},
    {source: 2, target: 3, value: 15}
  ];
}

function draw() {
  background(255);
  drawSankey();
}

function drawSankey() {
  let nodeWidth = 50;
  let nodeHeight = 20;

  // 计算节点的 x 位置
  let x = 100;
  for (let i = 0; i < nodes.length; i++) {
    fill(200);
    rect(x, height / 2 - nodeHeight / 2, nodeWidth, nodeHeight);
    x += 150; // 调整节点间距
  }

  // 绘制链接
  for (let link of links) {
    let sourceX = 100 + link.source * 150 + nodeWidth;
    let targetX = 100 + link.target * 150;
    let y = height / 2;

    fill(150);
    noStroke();
    beginShape();
    vertex(sourceX, y);
    bezierVertex(sourceX + 50, y - link.value, targetX - 50, y - link.value, targetX, y);
    vertex(targetX, y);
    endShape();
  }
}
