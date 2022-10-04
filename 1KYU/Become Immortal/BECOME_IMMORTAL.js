// This will return a bightness value that can be used
// to determine the value of an area in O(1) time
const brightnessCoefficientMap = 
[
  [0, 1, 2, 3, 4, 5, 6, 7],
  [1, 0, 3, 2, 5, 4, 7, 6],
  [2, 3, 0, 1, 6, 7, 4, 5],
  [3, 2, 1, 0, 7, 6, 5, 4],
  [4, 5, 6, 7, 0, 1, 2, 3],
  [5, 4, 7, 6, 1, 0, 3, 2],
  [6, 7, 4, 5, 2, 3, 0, 1],
  [7, 6, 5, 4, 3, 2, 1, 0]
]

let matrix = [];
let tiles = [];
let domains = [];
let l = 0;
let t = 0;
let grossSeconds = 0;
let recDepth = 0
let datumsX = [];
let datumsY = [];

// ========= Matrix functions =========
const buildMatrix = (m,n) => {
  for(let c = 0; c < n; c++) {
    let row = [];
    for(let r = 0; r < m; r++) {
      let xor = (c^r);
      row.push(xor.toString().length > 1 ? xor + " " : " " + xor + " ");
    }
    matrix.push(row);
  }
}

const printMatrix = () => {
  for (let y = 0; y < matrix.length; y++) {
    console.log(matrix[y].toString().split(',').join(''));  
  }
} 

const reset = () => {
  matrix = [];
  datums = [];
  l = 0;
  t = 0;
  grossSeconds = 0;
  recDepth = 0;
}
// ==================

// ========= Visualization functions =========
const markSquareAsCounted = (datum, sideLength) => {
  //console.log(`xOrigin: ${xOrigin}, yOrigin: ${yOrigin}, sideLength: ${sideLength}`);
  for (let y = datum.y; y < sideLength+datum.y; y++) {
    for (let x = datum.x; x < sideLength+datum.x; x++) {
      //console.log(`x: ${x} y: ${y}`);
      if (y < matrix.length && x < matrix.length) {
        matrix[y][x] = " - "
      }
    }
  }
}
// ==================

// ========= Used to test faster solution =========
const solveBruteForce = (matrix) => {
  let xorSum = 0;
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      xorSum += (x^y)
    }
  }
  return xorSum;
}
// ==================

// ========= Solution =========
class Domain {
  constructor(queenTile, parent = "") {
    this.datum = queenTile.datum;
    if(parent?.isHorizontalDomain){
      // This is a vertical domain
      this.isHorizontalDomain = false;
      this.xBound = parent?.datum?.x || matrix.length + queenTile.sideLength || matrix.length;
      this.yBound = parent?.yBound || matrix.length;
    } else {
      // Horizontal domain
      this.isHorizontalDomain = true
      this.xBound = parent?.xBound || matrix.length
      this.yBound = parent?.datum?.y || matrix.length + queenTile?.sideLength || matrix.length;
    }
    this.openTiles = [];
  }
}

class Tile {
  constructor(datum, domain, sideLength) {
    this.datum = datum;
    this.domain = domain;
    this.sideLength = sideLength
  }
}
// I'm going to think of the xor plane as a heightmap.
// Time complexity: O(logb2(n))
// Steps to solve:
// 1. Find the largest square of two in the matrix m x n
// 2. Get additional elevation for that square using the xor of the datum (x^y where x and y are the top left corner of the square (datum) within the m x n matrix)
// 3. Subtract L from the aditional elevation. If the sum is negative, set to zero and pass |sum| to the topology function as L
// 4. Use the formula n(n+1)/2 = sum of topographical pattern over square area where n = (side length - L)
// 5. Add aditional elevation and topographical sum to the total sum of the m x n matrix
// 6. Check for extra space to the right of the square we just solved. This area makes up a new m x n matrix with an x,y datum.
// 7. Recurse on the area to the right.
// 8. Once x axis recursion returns, r ecurse along the y axis, always preferring x axis recursion first.
// Solve for T
// Return total seconds sent by worshipers

 // 1 + 2 + 3 + 4 ... n
 // let lineVal = n(n+1)/2
 // let valueOfSquare = lineval * n

// Returns the additional elevation underneith the square
// x and y should always be the top left corner (datum) of a square of two.
const additionalElevation = (datum) => (datum.x^datum.y) // xor

// This does not acount for underlying values 
// for where the square is on the xor plane. 
// That must be added to this value.
// This is just the sum value of the texture/topography on top
const sumOfTopographyOnTile = (tile, loss) => {
  // Derrived from sigma notation
  // n(n+1)/2 = row value where n = side length
  // square value = row value * side length
  let n = (tile.sideLength - 1) - loss;
  let rowValue = (n*(n + 1))/2;
  //console.log(`Row value: ${rowValue}`);
  return rowValue*tile.sideLength;
}

//     x               |
//    xx               |
//   xxx     l = 2     |     x
//  xxxx               |    xx
// xxxxx               |   xxx
// -----               | -----

// Finds the largest square of 2 in a given rectangle
const largestSquare = (n, m) => Math.floor(Math.log2(n > m ? m : n)); // Log base 2 of the smallest of the two, rounded down.

const solveTile = (tile) => {
    // Solve square from this datum
    // Get value of extra elevation
    let extraHeight = additionalElevation(tile.datum);
    // Remove loss
    extraHeight -= l;
    // Clamp to > 0 and save excess
    let excessDecay = 0;
    if (extraHeight < 0) {
      excessDecay = Math.abs(extraHeight);
      extraHeight = 0;
    }
    // Calculate topographical volume
    let topographicalVolume = 0;
    if (excessDecay >= (tile.sideLength - 1)) { // Decay would eat the whole heightmap
      topographicalVolume = 0;
    } else {
      topographicalVolume = sumOfTopographyOnTile(tile, excessDecay);
    }
    // Count seconds
    grossSeconds += (topographicalVolume + extraHeight);
}

// Looks to the right of a square for a neighbor datum
const getNeighborX = (datum, sideLength) => {
  let lastXIndexOfThisSquare = datum.x + sideLength;
  if (matrix[datum.y].length > lastXIndexOfThisSquare) {
    return { 
      x: lastXIndexOfThisSquare, 
      y: datum.y
    }
  } else return undefined;
}

// Looks below a square for a neighbor datum
const getNeighborY = (datum, sideLength) => {
  let lastYIndexOfThisSquare = datum.y + sideLength;
  if (matrix.length > lastYIndexOfThisSquare) {
    return { 
      x: datum.x, 
      y: lastYIndexOfThisSquare
    }
  } else return undefined;
}

// Looks for neighbor datums (x,y coordinates) and adds them to the list
const getNeighbors = (datum, sideLength) => {
  let nx = getNeighborX(datum, sideLength);
  let ny = getNeighborY(datum, sideLength);
  if (nx) {
    datumsX.push(nx)
  }
  if (ny) {
    datumsY.push(ny);
  }
}

// Main recursive function. Returns net seconds donated by whole matrix accounting for L
const tileRecursively = (datum = {x:0,y:0}) => {
  recDepth++
  if (recDepth > 20) return
  // Datum is the x,y position of the top left corner of this square in the worshipper matrix
  // Some calcs for this tile
  // Get open space right and down
  let worshippersRight = matrix[datum.y].length - datum.x; // Length of row - position in row to get remainder
  let worshippersDown = matrix.length - datum.y; // Height of matrix - current row 
  // Find largest square in open space
  let ls = largestSquare(worshippersRight, worshippersDown);
  let sideLength = Math.pow(2, ls);

  // Solve this tile
  solveSquareForDatum(datum, sideLength);
  markSquareAsCounted(datum, sideLength);
  printMatrix();
  console.log(`\n`);

  // Look for neighbor datums
  getNeighbors(datum, sideLength)

  // If there is another datum in the list, solve it
  if (datumsX.length > 0) {
    tileRecursively(datumsX.pop());
  } else if(datumsY.length > 0) {
    tileRecursively(datumsY.pop());
  }
}

function elderAge(m,n,l,t) {
  // M = number of columns
  // N = number of rows
  // Init
  buildMatrix(m,n);
  l = l;
  t = t;

  // Solve
  tileRecursively();
  console.log("Rec depth: " + recDepth);
  reset();
}



// Test cases 
//elderAge(8,5,1,100);
//elderAge(8,8,0,100007)
//elderAge(15,15,0,100007)
elderAge(25,31,0,100007)
//elderAge(5,45,3,1000007)
//elderAge(50,48,7,2345)
//elderAge(545,435,342,1000007)
