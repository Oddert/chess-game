const validateBishop  = (startRow, startCol, targetRow, targetCol, board, team, showLogs) => {

  if (showLogs) console.log(`...player: ${team} from (${startRow},${startCol}) to (${targetRow},${targetCol})... [showLogs:${showLogs}]`)
  const rowChanged = startRow !== targetRow
  const colChanged = startCol !== targetCol

  if (startRow > 7 || startRow < 0) { console.log('# Starting Row OOB'); return { res: false, takePiece: false, message: 'Start Row OOB', code: 6 }; }
  if (startCol > 7 || startCol < 0) { console.log('# Starting Col OOB'); return { res: false, takePiece: false, message: 'Start Col OOB', code: 7 }; }
  if (targetRow > 7 || targetRow < 0) { console.log('# Target Row OOB'); return { res: false, takePiece: false, message: 'Target Row OOB', code: 8 }; }
  if (targetCol > 7 || targetCol < 0) { console.log('# Target Col OOB'); return { res: false, takePiece: false, message: 'Target Col OOB', code: 9 }; }
  // Catch any Out Of Bounds inputs, should'nt happen but would break enverything if it did


  if (!rowChanged || !colChanged) {
    if (showLogs) console.log('# Same square')
    return { res: false, takePiece: false, message: 'Same square', code: 1 }
  }
  // To be on the 'X' movement, both X and Y must be diffirent

  const rowDifference = targetRow > startRow
                              ? targetRow - startRow
                              : startRow - targetRow

  const colDifference = targetCol > startCol
                              ? targetCol - startCol
                              : startCol - targetCol
  // Get the change of each in positive

  // console.log(rowDifference, colDifference)
  // console.log(!(rowDifference === colDifference))
  if (!(rowDifference === colDifference)) {
    if (showLogs) console.log('# Not on X shape')
    return { res: false, takePiece: false, message: 'Not on X shape', code: 2 }
  }

  const rowIncrement = targetRow > startRow
  const colIncrement = targetCol > startCol

  const rowRange = []
  for (var r=1; r<=rowDifference; r++) {
    rowRange.push(rowIncrement ? startRow + r : startRow - r)
  }

  const colRange = []
  for (var c=1; c<=colDifference; c++) {
    colRange.push(colIncrement ? startCol + c : startCol - c)
  }

  if (showLogs) {
    console.log('Row change: ', rowRange)
    console.log('Col change: ', colRange)
  }

  for (var i=0; i<rowDifference; i++) {
    const item = board[rowRange[i]][colRange[i]]
    // console.log(item.team, team)

    if (i === rowDifference-1) {
      // console.log('Last item:')
      if (item.team === team) {
        if (showLogs) console.log(`# Cannot take own piece: ${item.type}`)
        return { res: false, takePiece: false, message: `# Cannot take own piece: ${item.type}`, code: 3 }
      }
      if (item.team === (team === 0 ? 1 : 0)) {
        // console.log(`# Item to be taken: ${item.type}`)
        return { res: true, takePiece: true, message: `# Item to be taken: ${item.type}`, code: 4 }
      }
    } else {
      // console.log('Not last item: ')
      if (item.type !== 'empty') {
        if (showLogs) console.log(`# Item in the way: ${item.type}`)
        return { res: false, takePiece: false, message: `# Item in the way: ${item.type}`, code: 5 }
      }
    }
    // console.log(item)
  }




  return { res: true, takePiece: false, message: 'Moving to an empty space', code: 0 }
  // If all checks pass, square is empty
}

export default validateBishop
