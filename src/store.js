import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const multipliers = 7
const getUniversalCoordinatedTime = () => {
    const dateString = new Date()
    dateString.setTime(dateString.valueOf() + ((multipliers*60*60)*1000))

    return {
        day: dateString.getUTCDay(), // 0 - 7 ---> Sun - Sat
        date: dateString.getUTCDate(),
        month: dateString.getUTCMonth(), // 0 - 11 --> Jan - Dec
        year: dateString.getUTCFullYear(),
        hour: dateString.getUTCHours(),
        minute: dateString.getUTCMinutes(),
        second: dateString.getUTCSeconds()
    }
}

const initState = {
    breadcrumb: [],
    utcMultipliers: multipliers,
    newDate: getUniversalCoordinatedTime(),
    theme: 'sun',
    url: 'http://164.115.43.132:5010',
    slotMachine: {
        height: 72,
        transparentWallSize: 2,
        selectedRow: 50,
        hasFinished: false
    },
    randomzingModal: false
}

const reducer = (state = initState, action) => {
    switch (action.type) {
        case 'SET_BREADCRUMB':
            return {
                ...state,
                breadcrumb: action.data
            }

        case 'FETCH_CLOCK':
            return { 
                ...state,
                newDate: getUniversalCoordinatedTime()
            }

        case 'SET_THEME':
            return {
                ...state,
                theme: action.data
            }

        case 'SET_SLOT_MACHINE_STATUS':
            return {
                ...state,
                slotMachine: {
                    ...action.currentState,                    
                    hasFinished: action.status
                }
            }

        case 'SET_RANDOMIZING_MODAL':
            return {
                ...state,
                randomzingModal: action.visible
            }

        default:
            break
    }

    return state
}

const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: [
        'utcMultipliers',
        'theme'
    ]
}
  
const persistedReducer = persistReducer(persistConfig, reducer)

export default () => {
    let store = createStore(persistedReducer)
    let persistor = persistStore(store)
    return { store, persistor }
}
