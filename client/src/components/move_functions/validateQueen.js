import validateRook from './validateRook'
import validateBishop from './validateBishop'

const validateQueen  = (startRow, startCol, targetRow, targetCol, board, team, showLogs) => {

  if (showLogs) console.log(`...player: ${team} from (${startRow},${startCol}) to (${targetRow},${targetCol})... [showLogs:${showLogs}]`)

  const rookRes   = validateRook  (startRow, startCol, targetRow, targetCol, board, team, showLogs)
  const bishopRes = validateBishop(startRow, startCol, targetRow, targetCol, board, team, showLogs)

  if (rookRes.code === 2) {
    return bishopRes
  } else {
    return rookRes
  }
}

export default validateQueen
