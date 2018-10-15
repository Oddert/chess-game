const toPGN = (fPiece, fRow, fCol, tPiece, tRow, tCol, take) => {
  let fPieceLetter = fPiece.substring(0,1).toUpperCase()
  let tPieceLetter = tPiece.substring(0,1).toUpperCase()
  let fColLetter = "abcdefgh".substring(fCol, fCol+1)
  let tColLetter = "abcdefgh".substring(tCol, tCol+1)
  return {f: `${fPieceLetter + fColLetter + fRow}`, t: `${tPieceLetter + tColLetter + tRow}`, x: !!take}
}

module.exports = toPGN
