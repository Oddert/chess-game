const validateKing  = (startRow, startCol, targetRow, targetCol, board, team, showLogs) => {

  if (showLogs) console.log(`...player: ${team} from (${startRow},${startCol}) to (${targetRow},${targetCol})... [showLogs:${showLogs}]`)
  // const rowChanged = startRow !== targetRow
  // const colChanged = startCol !== targetCol

  if (startRow > 7 || startRow < 0) { console.log('# Starting Row OOB'); return { res: false, takePiece: false, message: 'Start Row OOB', code: 6 }; }
  if (startCol > 7 || startCol < 0) { console.log('# Starting Col OOB'); return { res: false, takePiece: false, message: 'Start Col OOB', code: 7 }; }
  if (targetRow > 7 || targetRow < 0) { console.log('# Target Row OOB'); return { res: false, takePiece: false, message: 'Target Row OOB', code: 8 }; }
  if (targetCol > 7 || targetCol < 0) { console.log('# Target Col OOB'); return { res: false, takePiece: false, message: 'Target Col OOB', code: 9 }; }
  // Catch any Out Of Bounds inputs, should'nt happen but would break enverything if it did


  const validMoves = [
    { row: startRow - 1, col: startCol     },
    { row: startRow - 1, col: startCol + 1 },
    { row: startRow,     col: startCol + 1 },
    { row: startRow + 1, col: startCol + 1 },

    { row: startRow + 1, col: startCol     },
    { row: startRow + 1, col: startCol - 1 },
    { row: startRow,     col: startCol - 1 },
    { row: startRow - 1, col: startCol - 1 }
  ]

  const validMovesFiltered = validMoves.filter(e => !(e.row>7 || e.row<0 || e.col>7 || e.col<0))

  const enemyTeam = team === 0 ? 1 : 0

  for (var i=0; i<validMovesFiltered.length; i++) {
    const matchedMove = validMovesFiltered[i]
    // console.log(matchedMove)
    const item = board[matchedMove.row][matchedMove.col]
    if (targetRow === matchedMove.row && targetCol === matchedMove.col) {
      // console.log('THING FOUND')
      if (item.type !== 'empty') {
        if (item.team === enemyTeam) {
          console.log(`# Item to be taken: ${item.type}`)
          return { res: true, takePiece: true, message: `# Item to be taken: ${item.type}`, code: 4 }
        } else {
          if (showLogs) console.log(`# Cannot take own piece: ${item.type}`)
          return { res: false, takePiece: false, message: `# Cannot take own piece: ${item.type}`, code: 3 }
        }
      }
      return { res: true, takePiece: false, message: 'Moving to an empty space', code: 0 }
    }
  }



  return { res: false, takePiece: false, message: 'Invalid move', code: 2 }
  // If all checks pass, square is empty
}

export default validateKing
