function removeFromArray(arr, ele) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == ele) {
      arr.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  var d = dist(a.i, a.j, b.i, b.j);
  // var d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}

const gridW = 800;
const gridH = 800;
const cols = 50;
const rows = 50;
const pathColor = "blue";
var grid = new Array(cols);

// Stores nodes that still need to be evaluated, if openSet is empty
// then the algorithm is completed (either by finding end or not)
var openSet = [];
// Stores all the nodes that have finished being evaluated
var closedSet = [];
var start;
var end;
var w, h;
var path = [];

function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;

  // Sets number of obstacles
  if (random(1) < 0.3) {
    this.wall = true;
  }

  this.show = function(col) {
    // fill(col);
    if (this.wall) {
      fill(0);
      noStroke();
      // Draw circles for better diag pathfinding
      ellipse(this.i * w + w / 2, this.j * h + h / 2, w / 2, h / 2);

      // Draws rectangles, this makes diag pathfinding odd
      // rect(this.i * w, this.j * h, w - 1, h - 1);
    }
  };

  this.addNeighbors = function(grid) {
    var i = this.i;
    var j = this.j;
    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
    if (i > 0 && j > 0) {
      this.neighbors.push(grid[i - 1][j - 1]);
    }
    if (i < cols - 1 && j > 0) {
      this.neighbors.push(grid[i + 1][j - 1]);
    }
    if (i > 0 && j < rows - 1) {
      this.neighbors.push(grid[i - 1][j + 1]);
    }
    if (i < cols - 1 && j < rows - 1) {
      this.neighbors.push(grid[i + 1][j + 1]);
    }
  };
}

function setup() {
  createCanvas(gridW, gridH);
  console.log("A*");

  w = width / cols;
  h = height / rows;

  // Making a 2D array
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  start.wall = false;
  end.wall = false;

  openSet.push(start);
  console.log(grid);
}

// Use draw loop for the 'while openSet is not empty'
function draw() {
  if (openSet.length > 0) {
    // we can keep looking for the endpoint
    var winner = 0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }

    var current = openSet[winner];

    if (current === end) {
      // Done

      noLoop();
      console.log("DONE!");
    }

    removeFromArray(openSet, current);
    closedSet.push(current);

    var neighbors = current.neighbors;
    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];

      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        var tempG = current.g + 1;

        var newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }
        if (newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    }
  } else {
    // openSet has no nodes, but we have not arrived at
    // the end, there is no solution for this problem
    console.log("No path avaiable");
    noLoop();
    return;
  }

  background(255);

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }

  for (var i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0));
  }

  for (var i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0));
  }

  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  // for (var i = 0; i < path.length; i++) {
  //   path[i].show(color(0, 0, 255));
  // }

  noFill();
  stroke(pathColor);
  strokeWeight(w / 2);
  beginShape();
  for (var i = 0; i < path.length; i++) {
    // Draws a vertex path
    vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);

    // Draws a line path
    // path[i].show(color(0, 0, 255));
  }
  endShape();
}
