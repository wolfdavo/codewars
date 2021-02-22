/* 
Write a function, persistence, that takes in a positive parameter num 
and returns its multiplicative persistence, which is the number of times 
you must multiply the digits in num until you reach a single digit.

    Example
    persistence(39) === 3       // because 3*9 = 27, 2*7 = 14, 1*4=4
                                // and 4 has only one digit

    persistence(999) === 4      // because 9*9*9 = 729, 7*2*9 = 126, 
                                // 1*2*6 = 12, and finally 1*2 = 2

    persistence(4) === 0        // because 4 is already a one-digit number
*/

//Helper
const product = (num) => {
    //Break num into array and multiply it out
    let arr = num.toString().split('');
    let sum = 1;
    arr.forEach(digit => sum *= Number(digit));
    return sum;
}

//Main
const persistence = (num) => {
    let counter = 0;
    while (num.toString().length > 1) {
        num = product(num);
        counter++;
    }
    return counter;
}

console.log(persistence(39));