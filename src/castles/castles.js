export const buildCastles = landscape => {
  let landscapeCopy = new Array()
  let castles = []
  // landscape is not an array
  if (!Array.isArray(landscape)) return `ERROR: expected param 'landscape' to be an array but got ${typeof landscape}`
  // Remove non-numbers
  const landscapeNumbers = landscape.filter(n => !isNaN(parseFloat(n)))
  // Remove duplicate number groups ex [2,3,3,3,2] => [2,3,2]
  landscapeNumbers.map((v, i) => {
    if (i === 0) {
      landscapeCopy.push(Number(v))
    } else {
      const last = landscapeCopy.length - 1
      if (landscapeCopy[last] !== Number(v)) {
        landscapeCopy.push(Number(v))
      }
    }
  })
  // Populate Castles array
  for (var i = 0; i < landscapeCopy.length; i++) {
    const prev = landscapeCopy[i - 1]
    const next = landscapeCopy[i + 1]

    // Handle first item
    if (i === 0) {
      castles.push(`index: ${i}-${i + 1}, (${landscapeCopy[i]}${landscapeCopy[i + 1]})`)
      continue
    }
    // Handle last item
    if (i === landscapeCopy.length - 1) {
      castles.push(`index: ${i - 1}-${i}, (${landscapeCopy[i - 1]}${landscapeCopy[i]})`)
      continue
    }

    // Handle Peaks
    if (prev < landscapeCopy[i] && landscapeCopy[i] > next) {
      castles.push(`index:${i - 1}-${i}-${i + 1}, (${prev}${landscapeCopy[i]}${next})`)
    }
    // Handle Vallies
    if (prev > landscapeCopy[i] && landscapeCopy[i] < next) {
      castles.push(`index:${i - 1}-${i}-${i + 1}, (${prev}${landscapeCopy[i]}${next})`)
    }
  }
  return castles.length
}
