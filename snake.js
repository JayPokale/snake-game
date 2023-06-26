const boxSize = 30;
const rows = 20;
const cols = 20;
const snakeParts = new Set();
const directions = [
  [-1, 0],
  [0, -1],
  [1, 0],
  [0, 1],
];
let curVelocity = 2;
let canKeyPress = true;
let head, tail, ctx, food;


// Double Linked List
class Node {
  constructor(x, y, next = null, prev = null) {
    this.pos = { x, y };
    this.next = next;
    this.prev = prev;

    ctx.fillStyle = "white";
    ctx.fillRect(x * boxSize, y * boxSize, boxSize, boxSize);
  }
}

// Generate Food
const generateFood = () => {
  const x = Math.floor(rows * Math.random());
  const y = Math.floor(cols * Math.random());
  if (snakeParts.has(`${x}#${y}`)) return generateFood();

  ctx.fillStyle = "red";
  ctx.fillRect(x * boxSize, y * boxSize, boxSize, boxSize);
  return [x, y];
};

// Key Press
window.addEventListener("keydown", (key) => {
  const val = key.keyCode - 37;
  const diff = Math.abs(Math.abs(val - curVelocity) - 1);
  if (canKeyPress && val >= 0 && val <= 3 && diff !== 1) {
    curVelocity = val;
    canKeyPress = false;
  }
});

// Update Frame
const update = () => {
  canKeyPress = true;

  head = new Node(
    head.pos.x + directions[curVelocity][0],
    head.pos.y + directions[curVelocity][1],
    head
  );
  const [X, Y] = [head.pos.x, head.pos.y];
  if (X >= cols || X < 0 || Y >= rows || Y < 0 || snakeParts.has(`${X}#${Y}`))
    return;
  snakeParts.add(`${head.pos.x}#${head.pos.y}`);
  head.next.prev = head;

  if (X === food[0] && Y === food[1]) {
    food = generateFood();
  } else {
    snakeParts.delete(`${tail.pos.x}#${tail.pos.y}`);

    ctx.fillStyle = "black";
    ctx.fillRect(tail.pos.x * boxSize, tail.pos.y * boxSize, boxSize, boxSize);

    tail = tail.prev;
    tail.next = null;
  }
  setTimeout(update, 150);
};

// Main
window.onload = () => {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.height = boxSize * rows;
  canvas.width = boxSize * cols;

  ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const center = { x: cols / 2, y: rows / 2 };
  tail = new Node(center.x - 2, center.y);
  head = tail;
  head.prev = new Node(center.x - 1, center.y, head);
  head = head.prev;
  head.prev = new Node(center.x, center.y, head);
  head = head.prev;

  snakeParts.add(`${center.x}#${center.y}`);
  snakeParts.add(`${center.x - 1}#${center.y}`);
  snakeParts.add(`${center.x - 2}#${center.y}`);

  food = generateFood();
  update();
};