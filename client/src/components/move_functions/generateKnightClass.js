import validateKnight from './validateKnight'

const generateKnightClass = (startX, startY, targetX, targetY, board, team) => {
  const res = validateKnight(startX, startY, targetX, targetY, board, team, false);
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

export default generateKnightClass
