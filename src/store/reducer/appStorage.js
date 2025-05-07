import { LOGIN, CHANGE_WHITE, CHANGE_BLACK, FORCEUSERIN, CREATE_PASSCODE, OPEN_WALLET, CHANGE_WALLET, NEW_TRANSACTION, LOGOUT, UPDATE_USER } from "../action/appStorage";


const initialState = {
    token: "",
    expiresIn: "",
    user: null,
    background: '',
    importantText: '',
    normalText: '',
    fadeColor: '',
    blue: '',
    fadeButtonColor: '',
    assets: [],
    seedphrase: '',
    chain: '',
    network: '',
    address: '',
    transactions: [],
    admin: null
}


export const userAuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_WHITE:
            if (action.payload) {
                return {
                    ...state,
                    background: action.payload.background,
                    importantText: action.payload.importantText,
                    normalText: action.payload.normalText,
                    fadeColor: action.payload.fadeColor,
                    blue: action.payload.blue,
                    fadeButtonColor: action.payload.fadeButtonColor,
                }
            }
            break;
        case CHANGE_BLACK:
            if (action.payload) {
                return {
                    ...state,
                    background: action.payload.background,
                    importantText: action.payload.importantText,
                    normalText: action.payload.normalText,
                    fadeColor: action.payload.fadeColor,
                    blue: action.payload.blue,
                    fadeButtonColor: action.payload.fadeButtonColor,
                }
            }
            break;
            case FORCEUSERIN:
                if (action.payload) {
                  return {
                    ...state,
                    token: action.payload.token,
                    expiresIn: action.payload.expiresIn,
                    user: action.payload.user,
                    transactions: action.payload.transactions,
                    admin: action.payload.admin,
                    ...(action.payload.seedphrase && {
                      seedphrase: action.payload.seedphrase,
                      address: action.payload.address,
                      chain: action.payload.chain,
                      network: action.payload.network
                    })
                  };
                }
                break;
              

        case LOGIN:
            if (action.payload) {
                return {
                    ...state,
                    token: action.payload.token,
                    expiresIn: action.payload.expiresIn,
                    user: action.payload.user,
                    transactions: action.payload.transactions,
                    admin: action.payload.admin
                }
            }
            break;
        case CREATE_PASSCODE:
            if (action.payload) {
                return {
                    ...state,
                    user: action.payload.user,
                    transactions: action.payload.transactions
                }
            }
            break;
        case OPEN_WALLET:
            if (action.payload) {
                return {
                    ...state,
                    seedphrase: action.payload.seedPhrase,
                    chain: action.payload.chain,
                    network: action.payload.network,
                    address: action.payload.address
                }
            }
            break;

        case CHANGE_WALLET:
            if (action.payload) {
                return {
                    ...state,
                    chain: action.payload.chain,
                    network: action.payload.network,
                    address: action.payload.address
                }
            }
            break;
        case NEW_TRANSACTION:
            if (action.payload) {
                return {
                    ...state,
                    transactions: [...state.transactions, action.payload]
                }
            }
            break;

        case UPDATE_USER:
            if (action.payload) {
                return {
                    ...state,
                    user: action.payload
                }
            }
            break;
        case LOGOUT:
            if (action.payload) {
                return null; // if you want to clear the state completely
            }
            return state; // return the previous state if no payload
        // other cases...
        default:
            return state; // very important to always return state by default
    }

}
