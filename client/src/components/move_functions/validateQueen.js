import validateRook from './validateRook'
import validateBishop from './validateBishop'

const validateQueen  = (startRow, startCol, targetRow, targetCol, board, team, showLogs) => {

  if (showLogs) console.log(`...player: ${team} from (${startRow},${startCol}) to (${targetRow},${targetCol})... [showLogs:${showLogs}]`)

  const rookRes   = validateRook  (startRow, startCol, targetRow, targetCol, board, team, showLogs)
  const bishopRes = validateBishop(startRow, startCol, targetRow, targetCol, board, team, showLogs)

  // console.log('###########')
  // console.log(rookRes)
  // console.log(bishopRes)

  // if (rookRes.code === 0) {
  //   return rookRes
  // } else if (bishopRes.code === 0) {
  //   return bishopRes
  // }

  if (rookRes.code === 2) {
    return bishopRes
  } else /*if (bishopRes.code === 2)*/ {
    return rookRes
  }

}

export default validateQueen
