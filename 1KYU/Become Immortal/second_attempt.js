// Variables
let matrix = [];
let tiles = [];
let domains = [];
let l = 0;
let t = 0;
let grossSeconds = 0;
let recDepth = 0
let datumsX = [];
let datumsY = [];

// Setup functions
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

// Visualization functions
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

// Brute force solve
const solveBruteForce = (matrix) => {
  let xorSum = 0;
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      xorSum += (x^y)
    }
  }
  return xorSum;
}

// Solving algorithms
const findLargestSquare = (n, m) => {
  return Math.floor(Math.log2(n > m ? m : n))
}

const elderAge = (m,n,l,t) => {
  // M = number of columns
  // N = number of rows
  // Init
  buildMatrix(m,n);
  l = l;
  t = t;

  let largestSquare = findLargestSquare(n, m);

  markSquareAsCounted({x:0,y:0}, Math.pow(2, largestSquare));

  // Mark off largest square

  printMatrix();

  // Solve
  let xorsum = solveBruteForce(matrix);
  console.log(`Brute force sum: ${xorsum}`);
}

// Test cases 
//elderAge(8,5,1,100);
//elderAge(8,8,0,100007)
//elderAge(15,15,0,100007)
elderAge(25,31,0,100007)
//elderAge(5,45,3,1000007)
//elderAge(50,48,7,2345)
//elderAge(545,435,342,1000007)