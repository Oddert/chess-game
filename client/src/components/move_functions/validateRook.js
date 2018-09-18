const validateRook  = (startX, startY, targetX, targetY, board) => {
  const xChanged = startX !== targetX
  const yChanged = startY !== targetY

  if (xChanged && yChanged) { return false }
  if (!xChanged && !yChanged) { return false }
  // To be on the '+' movement, either X or Y must be diffirent but not both

  const start = xChanged ? startX : startY

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

  console.log(`start: ${start}`)
  console.log(`cellDiffirence ${cellDiffirence}`)
  console.log(`direction ${direction}`)

  const lineToTarget = []
  for (var x=1; x<=cellDiffirence; x++) {
    lineToTarget.push(direction ? start + x : start - x)
  }
  console.log(lineToTarget)
  return true
}

export default validateRook
