


function updateAttackingPawn (y, x, team, board) {
  
  const yDiff = team === 0 ? 1 : -1

  const oob = cell => !(cell.x > 8 || cell.x < 0 || cell.y > 8 || cell.y < 0)

  const validMoves = [
    { y: y + yDiff, x: x-1 },
    { y: y + yDiff, x: x+1 },
  ]
  .filter(oob)

  return validMoves
}

export default updateAttackingPawn