const validateRook  = (startX, startY, targetX, targetY, board) => {
  console.log(`...from (${startX},${startY}) to (${targetX},${targetY})...`)
  const xChanged = startX !== targetX
  const yChanged = startY !== targetY

  if (xChanged && yChanged) { console.log('# Same square'); return false; }
  if (!xChanged && !yChanged) { console.log('# Not on cross'); return false; }
  // To be on the '+' movement, either X or Y must be diffirent but not both

  const start = xChanged ? startX : startY
  const end = xChanged ? targetX : targetY

  const cellDiffirence = xChanged
          ? startX > targetX
              ? startX - targetX
              : targetX - startX
          : startY > targetY
              ? startY - targetY
              : targetY - startY

  const direction = xChanged
          ? startX > targetX ? false : true
          : startY > targetY ? false : true
  // true = increse on either axis

  console.log(`start: ${start}, end: ${end}`)
  console.log(`cellDiffirence ${cellDiffirence}`)
  console.log(`direction ${direction}`)

  const lineToTarget = []
  for (var t=1; t<=cellDiffirence; t++) {
    lineToTarget.push(direction ? start + t : start - t)
  }
  console.log(lineToTarget)

  for (var c=0; c<lineToTarget.length; c++) {
    console.log(lineToTarget[c])
    // console.log(board[][])
  }

  return true
}

export default validateRook
