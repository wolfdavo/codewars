// Recursive function to step in all 4 directions from a node and check for walls

// Funtion to convert string into matrix
const StringToMatrix = (mazeString) => (mazeString.split(`\n`).map(row=>([...row])))


function pathFinder(maze){
  const matrix = StringToMatrix(maze);
  const N = matrix.length;
  console.log(N);
}

pathFinder(`......
......
......
......
.....W
....W.`);