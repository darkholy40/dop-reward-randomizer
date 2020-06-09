import days from '../../static_data/components/functions/days'

function getDayString(dayValue, type, lang) {
    if(type === 'long') {
        switch (dayValue) {
            case 0:
                return days.long[0][lang]

            case 1:
                return days.long[1][lang]

            case 2:
                return days.long[2][lang]

            case 3:
                return days.long[3][lang]

            case 4:
                return days.long[4][lang]

            case 5:
                return days.long[5][lang]

            case 6:
                return days.long[6][lang]
        
            default:
                break
        }
    } else {
        switch (dayValue) {
            case 0:
                return days.short[0][lang]

            case 1:
                return days.short[1][lang]

            case 2:
                return days.short[2][lang]

            case 3:
                return days.short[3][lang]

            case 4:
                return days.short[4][lang]

            case 5:
                return days.short[5][lang]

            case 6:
                return days.short[6][lang]
        
            default:
                break
        }
    }
}

export default getDayString