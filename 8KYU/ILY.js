const resolutions = [
  "I love you",
  "a little",
  "a lot",
  "passionately",
  "madly",
  "not at all"
];

const howMuchILoveYou = (petals) => {
  //Let's pick a flower...
  return resolutions[(petals-1) % resolutions.length];
};

console.log(howMuchILoveYou(7));
console.log(howMuchILoveYou(3));
console.log(howMuchILoveYou(6));
