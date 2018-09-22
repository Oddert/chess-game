const validateRook  = (startRow, startCol, targetRow, targetCol, board, team, ignoreLogs) => {

  if (ignoreLogs) console.log(`...player: ${team} from (${startRow},${startCol}) to (${targetRow},${targetCol})... [ignoreLogs:${ignoreLogs}]`)
  const rowChanged = startRow !== targetRow
  const colChanged = startCol !== targetCol

  if (startRow > 7 || startRow < 0) { console.log('# Starting Row OOB'); return { res: false, takePiece: false, message: 'Start Row OOB', code: 6 }; }
  if (startCol > 7 || startCol < 0) { console.log('# Starting Col OOB'); return { res: false, takePiece: false, message: 'Start Col OOB', code: 7 }; }
  if (targetRow > 7 || targetRow < 0) { console.log('# Target Row OOB'); return { res: false, takePiece: false, message: 'Target Row OOB', code: 8 }; }
  if (targetCol > 7 || targetCol < 0) { console.log('# Target Col OOB'); return { res: false, takePiece: false, message: 'Target Col OOB', code: 9 }; }
  // Catch any Out Of Bounds inputs, should'nt happen but would break enverything if it did

  if (!rowChanged && !colChanged) {
    if (ignoreLogs) {
      console.log('# Same square')
    } else {
      return { res: false, takePiece: false, message: 'Same square', code: 1 }
    }
  }

  if (rowChanged && colChanged) {
    if (ignoreLogs) {
      console.log('# Not on cross')
    } else {
      return { res: false, takePiece: false, message: 'Invalid direction', code: 2 }
    }
  }
  // To be on the '+' movement, either X or Y must be diffirent but not both

  const start = rowChanged ? startRow : startCol

  const cellDiffirence = rowChanged
          ? startRow > targetRow
              ? startRow - targetRow
              : targetRow - startRow
          : startCol > targetCol
              ? startCol - targetCol
              : targetCol - startCol

  // Checks to see if either row or col changed
  // Gets a positive number diffirence between the begining and end in order to generate a range of vals later

  const horizontalVertical = !!rowChanged
  // true : moving horizontal
  // false : moving vertical

  const incrementDecrement = rowChanged
              ? startRow > targetRow ? false : true
              : startCol > targetCol ? false : true
              // true : moving accross or down
              // false : moving 'backwards'


  // const end = rowChanged ? targetRow : targetCol
  // console.log(`start: ${start}, end: ${end}`)
  // console.log(`Moving across the horizontal axis? : ${horizontalVertical}`)
  // console.log(`Increment? ${incrementDecrement}`)
  // console.log(`cellDiffirence ${cellDiffirence}`)
  // Debugging Logs ^^^

  const lineToTarget = []
  for (var t=1; t<=cellDiffirence; t++) {
    lineToTarget.push(incrementDecrement ? start + t : start - t)
  }
  // Generate the range of vals (including end, excluding start)

  if (ignoreLogs) console.log(lineToTarget)

  for (var c=0; c<lineToTarget.length; c++) {

    const item = horizontalVertical ? board[lineToTarget[c]][startCol] : board[startRow][lineToTarget[c]]

    if (c >= lineToTarget.length-1) {
        if (item.type !== "empty") {
          if (item.team === team) {
            if (ignoreLogs) console.log(`# Cannot take own piece: ${item.type}`)
            return { res: false, takePiece: false, message: `Cannot take own piece: ${item.type}`, code: 3 }
          } else {
            if (ignoreLogs) console.log(`# Item to be taken: ${item.type}`)
            console.log(team)
            console.log(targetRow, targetCol)
            console.log(board[targetRow][targetCol])
            return { res: true, takePiece: true, message: `Item to be taken: ${item.type}`, code: 4 }
          }
        }
      } else {
        if (item.type !== "empty") {
          if (ignoreLogs) console.log(`# Item in the way: ${item.type}`)
          return { res: false, takePiece: false, message: `Item in the way: ${item.type}`, code: 5 }
        }
      }
  }
  // Itirate through this list of possible values to return an appropriate error where needed

  return { res: true, takePiece: false, message: 'Moving to an empty space', code: 0 }
  // If all checks pass, square is empty
}

export default validateRook
