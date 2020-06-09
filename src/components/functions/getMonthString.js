import months from '../../static_data/components/functions/months'

function getMonthString(monthValue, type, lang) {
    if(type === 'long') {
        switch (monthValue) {
            case 0:
                return months.long[0][lang]

            case 1:
                return months.long[1][lang]

            case 2:
                return months.long[2][lang]

            case 3:
                return months.long[3][lang]

            case 4:
                return months.long[4][lang]

            case 5:
                return months.long[5][lang]

            case 6:
                return months.long[6][lang]

            case 7:
                return months.long[7][lang]

            case 8:
                return months.long[8][lang]

            case 9:
                return months.long[9][lang]

            case 10:
                return months.long[10][lang]

            case 11:
                return months.long[11][lang]
        
            default:
                break
        }
    } else {
        switch (monthValue) {
            case 0:
                return months.short[0][lang]

            case 1:
                return months.short[1][lang]

            case 2:
                return months.short[2][lang]

            case 3:
                return months.short[3][lang]

            case 4:
                return months.short[4][lang]

            case 5:
                return months.short[5][lang]

            case 6:
                return months.short[6][lang]

            case 7:
                return months.short[7][lang]

            case 8:
                return months.short[8][lang]

            case 9:
                return months.short[9][lang]

            case 10:
                return months.short[10][lang]

            case 11:
                return months.short[11][lang]
        
            default:
                break
        }
    }
}

export default getMonthString