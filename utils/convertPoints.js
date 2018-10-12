const convertPoints = str => {
  switch(str) {
    case 'pawn':
      return 1;
    case 'knight':
      return 3;
    case 'bishop':
      return 3;
    case 'rook':
      return 5;
    case 'queen':
      return 9;
    default:
      console.log('Check please, switch game reducer ln: 4')
      console.log(str)
      return 1;
  }
}

module.exports = convertPoints
