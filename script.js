const board = document.getElementById("board");
const movesLeftText = document.getElementById("movesLeft");
const heartsCollectedText = document.getElementById("heartsCollected");
const totalHeartsText = document.getElementById("totalHearts");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

const rows = 10;
const cols = 10;
const maxMoves = 45;

let playerRow = 0;
let playerCol = 0;
let movesLeft = maxMoves;
let heartsCollected = 0;
let gameOver = false;

const maze = [
  ["E", "", "W", "H", "", "", "W", "", "H", ""],
  ["", "", "W", "", "W", "", "", "", "W", ""],
  ["W", "", "", "", "W", "", "W", "", "", ""],
  ["H", "W", "W", "", "", "", "W", "H", "W", ""],
  ["", "", "", "W", "H", "", "", "", "W", ""],
  ["", "W", "", "", "W", "W", "", "W", "", ""],
  ["", "W", "H", "", "", "", "", "W", "", "W"],
  ["", "", "W", "W", "", "W", "", "", "H", ""],
  ["W", "", "", "", "", "W", "H", "W", "", ""],
  ["", "", "W", "H", "", "", "", "", "", "X"]
];

let totalHearts = countHearts();

function countHearts() {
  let total = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (maze[r][c] === "H") {
        total++;
      }
    }
  }

  return total;
}

function drawBoard() {
  board.innerHTML = "";

  for (let r = 0; r < rows; r++) {
    let rowDiv = document.createElement("div");
    rowDiv.className = "row";

    if (r % 2 === 1) {
      rowDiv.className = "row odd";
    }

    for (let c = 0; c < cols; c++) {
      let hex = document.createElement("div");
      hex.className = "hex";

      let cell = maze[r][c];

      if (cell === "W") {
        hex.classList.add("wall");
        hex.textContent = "🪨";
      }

      if (cell === "E") {
        hex.classList.add("entrance");
        hex.textContent = "IN";
      }

      if (cell === "X") {
        hex.classList.add("exit");
        hex.textContent = "OUT";
      }

      if (cell === "H") {
        hex.classList.add("heart");
        hex.textContent = "💖";
      }

      if (isNextToPlayer(r, c) && cell !== "W") {
        hex.classList.add("possible-move");
      }

      if (r === playerRow && c === playerCol) {
        hex.classList.add("player");
        hex.textContent = "👹";
      }

      hex.onclick = function () {
        moveMonster(r, c);
      };

      rowDiv.appendChild(hex);
    }

    board.appendChild(rowDiv);
  }

  updateInfo();
}

function moveMonster(r, c) {
  if (gameOver === true) {
    return;
  }

  if (maze[r][c] === "W") {
    message.textContent = "Wall blocked!";
    return;
  }

  if (isNextToPlayer(r, c) === false) {
    message.textContent = "You cant move there";
    return;
  }

  playerRow = r;
  playerCol = c;
  movesLeft--;

  if (maze[r][c] === "H") {
    heartsCollected++;
    maze[r][c] = "";
    message.textContent = "Heart collected!";
  } else {
    message.textContent = "Monster moved";
  }

  checkWinOrLose();
  drawBoard();
}

function isNextToPlayer(r, c) {
  let moves;

  if (playerRow % 2 === 0) {
    moves = [
      [-1, -1],
      [-1, 0],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0]
    ];
  } else {
    moves = [
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, 0],
      [1, 1]
    ];
  }

  for (let i = 0; i < moves.length; i++) {
    let newRow = playerRow + moves[i][0];
    let newCol = playerCol + moves[i][1];

    if (newRow === r && newCol === c) {
      return true;
    }
  }

  return false;
}

function checkWinOrLose() {
  if (maze[playerRow][playerCol] === "X") {
    if (heartsCollected === totalHearts) {
      message.textContent = "You got all hearts and escaped!";
      gameOver = true;
    } else {
      message.textContent = "Get all hearts before leaving";
    }
  }

  if (movesLeft <= 0 && gameOver === false) {
    message.textContent = "No moves left. Game over!";
    gameOver = true;
  }
}

function updateInfo() {
  movesLeftText.textContent = movesLeft;
  heartsCollectedText.textContent = heartsCollected;
  totalHeartsText.textContent = totalHearts;
}

restartBtn.onclick = function () {
  location.reload();
};

drawBoard();