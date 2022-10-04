const sequence = [1,10,9,12,3,4]

const reduce = (n) => {
  //Number to array
  n = [...n.toString()];
  //Flip array
  n.reverse();
  //Multiply by sequence and sunm
  let sum = 0;
  n.forEach((digit, i)=>{
    //Get corresponding index of lookup table
    let lookupIndex = i%6;
    let product = Number(digit) * sequence[lookupIndex];
    sum += product;
  })
  //Return new number
  return sum;
}

const recurse = (lastSum) => {
  let newVal = reduce(lastSum);
  if (lastSum !== newVal) {
    return recurse(newVal)
  } else {
    return newVal;
  }
}

const thirt = (n) => {
  return recurse(n);
}

console.log(thirt(1234567));