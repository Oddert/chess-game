const validateRook  = (startRow, startCol, targetRow, targetCol, board, team) => {

  console.log(`...from (${startRow},${startCol}) to (${targetRow},${targetCol})...`)
  const rowChanged = startRow !== targetRow
  const colChanged = startCol !== targetCol

  if (!rowChanged && !colChanged) { console.log('# Same square'); return { res: false, takePiece: false, message: 'Same square' }; }
  if (rowChanged && colChanged) { console.log('# Not on cross'); return { res: false, takePiece: false, message: 'Invalid direction' }; }
  // To be on the '+' movement, either X or Y must be diffirent but not both

  const start = rowChanged ? startRow : startCol

  const cellDiffirence = rowChanged
          ? startRow > targetRow
              ? startRow - targetRow
              : targetRow - startRow
          : startCol > targetCol
              ? startCol - targetCol
              : targetCol - startCol

  const horizontalVertical = !!rowChanged
  // true : moving horizontal
  // false : moving vertical

  const incrementDecrement = rowChanged
              ? startRow > targetRow ? false : true
              : startCol > targetCol ? false : true

              // true : moving accross or down
              // false : moving 'backwards'

              
  const end = rowChanged ? targetRow : targetCol
  console.log(`start: ${start}, end: ${end}`)
  console.log(`Moving across the horizontal axis? : ${horizontalVertical}`)
  console.log(`Increment? ${incrementDecrement}`)
  console.log(`cellDiffirence ${cellDiffirence}`)

  const lineToTarget = []
  for (var t=1; t<=cellDiffirence; t++) {
    lineToTarget.push(incrementDecrement ? start + t : start - t)
  }

  console.log(lineToTarget)

  for (var c=0; c<lineToTarget.length; c++) {

    // const item = horizontalVertical ? board[lineToTarget[c]][startCol] : board[startRow][lineToTarget[c]]
    const item = horizontalVertical ? board[startCol][lineToTarget[c]] : board[lineToTarget[c]][startRow]


    // console.log(lineToTarget[c], horizontalVertical, horizontalVertical ? `startRow ${startRow}` : `startCol ${startCol}`)
    console.log(startCol, lineToTarget[c])
    console.log(item)

    if (c >= lineToTarget.length-1) {
        if (item.type !== "empty") {
          if (item.team === team) {
            console.log(`# Cannot take own piece: ${item.type}`)
            return { res: false, takePiece: false, message: `Cannot take own piece: ${item.type}` }
          } else {
            console.log(`# Item to be taken: ${item.type}`)
            return { res: true, takePiece: true, message: `Item to be taken: ${item.type}` }
          }
        }
      } else {
        if (item.type !== "empty") {
          console.log(`# Item in the way: ${item.type}`)
          return { res: false, takePiece: false, message: `Item in the way: ${item.type}` }
        }
      }
  }

  return { res: true, takePiece: false, message: 'Moving to an empty space' }
}

export default validateRook
