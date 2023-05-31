var root = document.getElementsByClassName("root")[0];

var table = [];

var startMenu = document.getElementsByClassName("startMenu")[0];

var endMenu = document.getElementsByClassName("endMenu")[0];

var scoreElement = document.getElementsByClassName("score")[0];

var score = 0;

var moveVector = { x: 1, y: 0 };

var positionBerry = null;

var snake = {
  elsements: [
    {
      position: { x: 0, y: 0 },
      lastPosition: { x: 0, y: 0 },
    },
  ],
};


window.addEventListener("keydown", ControlSnake);

GenerateGameField();



var interval;



SpawnBerry();

function GenerateGameField() {
  let line = [];
  for (let i = 0; i < 400; i++) {
    let cell = document.createElement("div");
    cell.className = "cell";
    root.append(cell);

    console.log(cell);
    line.push({
      snake: false,
      berry: false,
      element: cell,
    });
    

    if (line.length == 20) {
      table.push(line);
      line = [];
      console.log(line);
    }
  }

  console.log(table);
}

function SpawnBerry() {

  let x = getRandomInt(0, table[0].length);
  let y = getRandomInt(0, table.length);

  if (table[x][y].snake) {
    SpawnBerry();
  } else {
    positionBerry = { x, y };
    SetBerry(x, y);
  }

  console.log(table);
}

function SpawnSnake() {
  SetSnake(snake.elsements[0].position.x, snake.elsements[0].position.y);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
}

function DrawBerry() {
  if (positionBerry != null) {
    table[positionBerry.y][positionBerry.x].element.className = "cell berry";
  }
}

function Update() {
  MoveSnake();
  DrawBerry();
}

function SetBerry(x, y) {
  table[y][x].berry = true;
  table[y][x].element.className = "cell berry";
  console.log("BERRY", x, y);
}

function SetSnake(x, y) {
  table[y][x].snake = true;
  table[y][x].element.className = "cell snake";
}

function DeleteCellSnake(x, y) {
  table[y][x].snake = false;
  table[y][x].element.className = "cell";
}

function MoveSnake() {
  

  let currentPositionFirstElement = snake.elsements[0].position;

  if (
    currentPositionFirstElement.x > table[0].length - 2 ||
    currentPositionFirstElement.x + moveVector.x < 0 ||
    currentPositionFirstElement.y > table.length - 2 ||
    currentPositionFirstElement.y + moveVector.y < 0 ||
    table[currentPositionFirstElement.y + moveVector.y][
      currentPositionFirstElement.x + moveVector.x
    ].snake
  ) {
    GameOver();
    return;
  }

  DeleteCellSnake(currentPositionFirstElement.x, currentPositionFirstElement.y);



  snake.elsements[0].lastPosition = { ...currentPositionFirstElement };

  if (snake.elsements.length > 1) {
    for (let i = 1; i < snake.elsements.length; i++) {
      let currentElement = snake.elsements[i];
      let prewElement = snake.elsements[i - 1];

      

      currentElement.lastPosition = { ...currentElement.position };

      DeleteCellSnake(currentElement.position.x, currentElement.position.y);
     

      currentElement.position = { ...prewElement.lastPosition };

      SetSnake(currentElement.position.x, currentElement.position.y);
    }
  }

  currentPositionFirstElement.x += moveVector.x;
  currentPositionFirstElement.y += moveVector.y;

  SetSnake(currentPositionFirstElement.x, currentPositionFirstElement.y);

  console.log(
    table[currentPositionFirstElement.y][currentPositionFirstElement.x].berry
  );

  if (
    table[currentPositionFirstElement.y][currentPositionFirstElement.x].berry
  ) {
    table[currentPositionFirstElement.y][
      currentPositionFirstElement.x
    ].berry = false;
    AddSnake();
    score++;
    SetScore(score);
    SpawnBerry();
  }

  
}

function AddSnake() {
  let snakeElementLast = snake.elsements[snake.elsements.length - 1];

  let element = {
    position: {
      x: snakeElementLast.position.x,
      y: snakeElementLast.position.y,
    },
    lastPosition: {
      x: snakeElementLast.lastPosition.x,
      y: snakeElementLast.lastPosition.y,
    },
  };
  snake.elsements.push(element);
}

function ControlSnake(event) {
  let key = event.code;

  if (key == "KeyA" && moveVector.x != 1) {
    moveVector = { x: -1, y: 0 };
  } else if (key == "KeyD" && moveVector.x != -1) {
    moveVector = { x: 1, y: 0 };
  } else if (key == "KeyS" && moveVector.y != -1) {
    moveVector = { x: 0, y: 1 };
  } else if (key == "KeyW" && moveVector.y != 1) {
    moveVector = { x: 0, y: -1 };
  } 
}

function GameOver() {
  endMenu.style.display="flex";
  console.log("GAME OVER");
  clearInterval(interval);
}

function Restart(){
  for(let i=0; i<snake.elsements.length; i++){
    let element=snake.elsements[i].position;
    DeleteCellSnake(element.x, element.y);
  }
  snake.elsements =[];
  snake.elsements.push({
    position: { x: 0, y: 0 },
    lastPosition: { x: 0, y: 0 },
  })

  moveVector={ x: 1, y: 0 };
  endMenu.style.display="none";
  
  Start();
  
}

function SetScore(score)
{
  scoreElement.innerText=score;
}
function Start(){
  SpawnSnake();
  setTimeout(() => {
    interval = setInterval(Update, 150);
  }, 400);
  startMenu.style.display="none";
  score = 0;
  SetScore(score)
}