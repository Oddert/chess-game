import validatePawn from './validatePawn'

const generatePawnClass = (startX, startY, targetX, targetY, board, team) => {
  const res = validatePawn(startX, startY, targetX, targetY, board, team, false);
  switch(res.code) {
    case 0:
      return 'virtual-row-square s'
    case 1:
      return ''
    case 2:
      return 'virtual-row-square s empty'
    case 3:
      return 'virtual-row-square s friend'
    case 4:
      return 'virtual-row-square s enemy'
    case 5:
      return 'virtual-row-square s obstruct'
    default:
      return ''
  }
}

export default generatePawnClass
