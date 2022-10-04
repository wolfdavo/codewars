class ANode {
  constructor({hCost, gCost, parent, position}) {
    this.hCost = hCost;
    this.gCost = gCost;
    this.fCost = this.hCost + this.gCost;
    this.parent = parent;
    this.position = position;
  }
}

// Calculate gCost
const CalcgCost = (pos, n) => (2*(n-1) - pos.y - pos.x);

// Funtion to convert string into matrix
const StringToMatrix = (mazeString) => (mazeString.split(`\n`).map(row=>([...row])))

// Check if node is closed
const isOnClosedNode = (pos, closedNodes) => closedNodes.some(node => {
  return node.position.x === pos.x && node.position.y === pos.y;
})

// Returns an array of x,y coordinates of valid neighbors
const getNeighbors = (node, grid, closedNodes) => {
  let neighbors = [];
  const steps = [
    [0,1],
    [1,0],
    [0,-1],
    [-1,0]
  ]
  steps.forEach(step => {
    let [x,y] = step;
    let checkX = node.position.x + x;
    let checkY = node.position.y + y;
    let checkPos = {
      x: checkX,
      y: checkY
    }
    if (checkX >= 0 && checkX < grid[0].length &&
        checkY >= 0 && checkY < grid.length &&
        grid[checkX][checkY] === '.' &&
        !isOnClosedNode(checkPos, closedNodes)) {
      // Valid neighbor
      neighbors.push([checkX,checkY]);
    }
  })
  //console.log(JSON.stringify(neighbors, null, 2));
  return neighbors;
}

const pathFinder = (maze) => {
  const grid = StringToMatrix(maze);

  let open = [];
  let closed = [];
  let startingNode = new ANode({
    hCost: 0,
    gCost: CalcgCost({x:0,y:0}, grid.length),
    parent: "Origin",
    position: {x:0,y:0}
  })
  open.push(startingNode);
  // Start looping
  while(true) {
    //console.log(JSON.stringify(open, null, 2));
    //console.log(JSON.stringify(closed, null, 2));
    // End cases
    if (open.length === 0) {
      return false;
    }

    // Visit node
    let currentNode = open.shift();
    closed.push(currentNode);

    // Check for exit node
    if (currentNode.gCost === 0) {
      return currentNode.fCost;
    }

    // Get neighbors
    let neighbors = getNeighbors(currentNode, grid, closed);
    neighbors.forEach(neighbor => {
      // Add each neighbor to the list of open nodes
      let pos = {x:neighbor[0],y:neighbor[1]};
      let newNode = new ANode({
        hCost: currentNode.hCost + 1,
        gCost: CalcgCost(pos, grid.length),
        parent: currentNode,
        position: pos
      })
      let i = 0;
      while(i < open.length && newNode.fCost > open[i].fCost) i++
      open.splice(i, 0, newNode);
    })
  }
}

console.log(pathFinder(`.W.
.W.
W..`));

console.log(pathFinder(`......
......
......
......
.....W
....W.`));