function sortResultArrayToDisplay(data, getRandomizedIndex, getSelectedRow, getTransparentWallSize, getRandomTimes) {
    const selectedIndex = (getSelectedRow*getRandomTimes)-1 // Ex. if selected row to display result is 50th, then use index at 49 of array
    const transparentWllSize = getTransparentWallSize

    let arrayResult = []
    let selectedIndexCount = selectedIndex
    let randomizedIndexCount = getRandomizedIndex

    if(data.length <= (selectedIndex + transparentWllSize)) {
        const loopTimes = Math.ceil((selectedIndex + transparentWllSize)/data.length)

        for(let i=0; i<(loopTimes*data.length); i++) {
            arrayResult[selectedIndexCount] = data[randomizedIndexCount]

            selectedIndexCount++
            randomizedIndexCount++

            if(selectedIndexCount > (loopTimes*data.length)-1) {
                selectedIndexCount = 0
            }

            if((randomizedIndexCount+1) > data.length) {
                randomizedIndexCount = 0
            }
        }
    } else {
        for(let i=0; i<data.length; i++) {
            arrayResult[selectedIndexCount] = data[randomizedIndexCount]

            selectedIndexCount++
            randomizedIndexCount++

            if(selectedIndexCount > data.length-1) {
                selectedIndexCount = 0
            }

            if((randomizedIndexCount+1) > data.length) {
                randomizedIndexCount = 0
            }
        }
    }

    // console.log(arrayResult)
    // console.log(arrayResult.length)
    return arrayResult
}

export default sortResultArrayToDisplay