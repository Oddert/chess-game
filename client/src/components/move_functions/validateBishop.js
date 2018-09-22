const validateBishop  = (startRow, startCol, targetRow, targetCol, board, team, ignoreLogs) => {

  if (ignoreLogs) console.log(`...player: ${team} from (${startRow},${startCol}) to (${targetRow},${targetCol})... [ignoreLogs:${ignoreLogs}]`)
  const rowChanged = startRow !== targetRow
  const colChanged = startCol !== targetCol

  if (startRow > 7 || startRow < 0) { console.log('# Starting Row OOB'); return { res: false, takePiece: false, message: 'Start Row OOB', code: 1 }; }
  if (startCol > 7 || startCol < 0) { console.log('# Starting Col OOB'); return { res: false, takePiece: false, message: 'Start Col OOB', code: 2 }; }
  if (targetRow > 7 || targetRow < 0) { console.log('# Target Row OOB'); return { res: false, takePiece: false, message: 'Target Row OOB', code: 3 }; }
  if (targetCol > 7 || targetCol < 0) { console.log('# Target Col OOB'); return { res: false, takePiece: false, message: 'Target Col OOB', code: 4 }; }
  // Catch any Out Of Bounds inputs, should'nt happen but would break enverything if it did


  if (!rowChanged || !colChanged) {
    if (ignoreLogs) {
      console.log('# Same square')
    } else {
      return { res: false, takePiece: false, message: 'Same square', code: 5 }
    }
  }
  // To be on the 'X' movement, both X and Y must be diffirent

  const rowDifference = targetRow > startRow
                              ? targetRow - startRow
                              : startRow - targetRow

  const colDifference = targetRow > startRow
                              ? targetRow - startRow
                              : startRow - targetRow
  // Get the change of each in positive

  if (!(rowDifference === colDifference)) {
    if (!ignoreLogs) console.log('# Not on X shape')
    return { res: false, takePiece: false, message: 'Not on X shape', code: 6 }
  }





  return { res: true, takePiece: false, message: 'Moving to an empty space', code: 0 }
  // If all checks pass, square is empty
}

export default validateBishop
