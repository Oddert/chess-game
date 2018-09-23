const validatePawn  = (startRow, startCol, targetRow, targetCol, board, team, showLogs) => {

  if (showLogs) console.log(`...player: ${team} from (${startRow},${startCol}) to (${targetRow},${targetCol})... [showLogs:${showLogs}]`)
  const rowChanged = startRow !== targetRow
  const colChanged = startCol !== targetCol

  if (startRow > 7 || startRow < 0) { console.log('# Starting Row OOB'); return { res: false, takePiece: false, message: 'Start Row OOB', code: 6 }; }
  if (startCol > 7 || startCol < 0) { console.log('# Starting Col OOB'); return { res: false, takePiece: false, message: 'Start Col OOB', code: 7 }; }
  if (targetRow > 7 || targetRow < 0) { console.log('# Target Row OOB'); return { res: false, takePiece: false, message: 'Target Row OOB', code: 8 }; }
  if (targetCol > 7 || targetCol < 0) { console.log('# Target Col OOB'); return { res: false, takePiece: false, message: 'Target Col OOB', code: 9 }; }
  // Catch any Out Of Bounds inputs, should'nt happen but would break enverything if it did

  if (!rowChanged && !colChanged) {
    if (showLogs) console.log('# Same square')
    return { res: false, takePiece: false, message: 'Same square', code: 1 }
  }
  // Check for same square

  if (!rowChanged) {
    if (showLogs) console.log('# Must move forward')
    return { res: false, takePiece: false, message: 'Must move forward', code: 2 }
  }

  const rowDiff= targetRow > startRow
                          ? targetRow - startRow
                          : startRow - targetRow
  const colDiff = targetCol > startCol
                          ? targetCol - startCol
                          : startCol - targetCol

  const rowIncrement = targetRow > startRow
  // const colIncrement = targetCol > startCol

  if ((targetRow === startRow + 2 || targetRow === startRow - 2) && !colChanged) {
    const selectRow = rowIncrement ? 1 : -1
    if (board[startRow + selectRow][startCol].type !== 'empty') {
      if (showLogs) console.log(`# Piece in the way`)
      return { res: false, takePiece: false, message: `# Piece in the way`, code: 5 }
    }
  }

  if (rowDiff > 2 || colDiff > 1) {
    if (showLogs) console.log('# Out of range')
    return { res: false, takePiece: false, message: 'Out or range', code: 2 }
  }
  // Max possible move distances

  if (rowDiff > 1 && colDiff) {
    if (showLogs) console.log('# Out of range')
    return { res: false, takePiece: false, message: '???', code: 2 }
  }
  // Not sure tbh

  if (team === 0) {
    if (!rowIncrement) {
      if (showLogs) console.log('# Wrong direction for black team')
      return { res: false, takePiece: false, message: 'Out or range', code: 2 }
    }
    // Black team cannot go 'backwards'

    if (startRow !== 1 && rowDiff > 1) {
      if (showLogs) console.log('# Only move one step unless first')
      return { res: false, takePiece: false, message: 'Out or range', code: 2 }
    }
    // Only two steps first move

    if (targetRow === startRow + 1 && !colChanged && board[targetRow][targetCol].type !== 'empty') {
      if (showLogs) console.log('# Only move one step unless first')
      return { res: false, takePiece: false, message: 'Out or range', code: 2 }
    }

  } else {
    if (rowIncrement) {
      if (showLogs) console.log('# Wrong direction for white team')
      return { res: false, takePiece: false, message: 'Out or range', code: 2 }
    }
    // White team cannot go 'forwards'

    if (startRow !== 6 && rowDiff > 1) {
      if (showLogs) console.log('# Only move one step unless first')
      return { res: false, takePiece: false, message: 'Out or range', code: 2 }
    }
    // Only two steps first move

    if (targetRow === startRow - 1 && !colChanged && board[targetRow][targetCol].type !== 'empty') {
      if (showLogs) console.log('# Only move one step unless first')
      return { res: false, takePiece: false, message: 'Out or range', code: 2 }
    }

  }
  // Diffirent checks per team

  const enemyTeam = team === 0 ? 1 : 0

  if (colChanged) {
    if (!(board[targetRow][targetCol].team === enemyTeam)) {
      if (showLogs) console.log('# No enemy to hit')
      return { res: false, takePiece: false, message: 'Out or range', code: 2 }
    }
  }

  if (board[targetRow][targetCol].type !== 'empty') {
    if (board[targetRow][targetCol].team === enemyTeam) {
      console.log(`# Item to be taken: ${board[targetRow][targetCol].type}`)
      return { res: true, takePiece: true, message: `# Item to be taken: ${board[targetRow][targetCol].type}`, code: 4 }
    } else {
      if (showLogs) console.log(`# Cannot take own piece: ${board[targetRow][targetCol].type}`)
      return { res: false, takePiece: false, message: `Cannot take own piece: ${board[targetRow][targetCol].type}`, code: 3 }
    }
  }

  if (targetRow === startRow + rowIncrement ? 1 : -1 && targetCol === startCol) {
    const obstruction = board[targetRow][targetCol]
    if (obstruction.type !== 'empty') {
      if (showLogs) console.log(`# Piece in the way: ${obstruction.type}`)
      return { res: false, takePiece: false, message: `# Piece in the way: ${obstruction.type}`, code: obstruction.team === team ? 3 : 5 }
    }
  }


  return { res: true, takePiece: false, message: 'Moving to an empty space', code: 0 }
  // If all checks pass, square is empty
}

export default validatePawn
