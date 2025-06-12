export const FORCEUSERIN = "FORCEUSERIN";
export const CREATE_PASSCODE = "CREATED_PASSCODE";
export const LOGIN = 'LOGIN';
export const CHANGE_BLACK = 'CHANGE_BLACK';
export const CHANGE_WHITE = 'CHANGE_WHITE';
export const OPEN_WALLET = 'OPEN_WALLET';
export const CHANGE_WALLET = 'CHANGE_WALLET';
export const NEW_TRANSACTION = 'NEW_TRANSACTION';
export const LOGOUT = 'LOGOUT';
export const UPDATE_USER = 'UPDATE_USER';
import { ethers } from 'ethers';


const DB_NAME = 'DexvaultDB';
const DB_VERSION = 1;
const STORE_NAME = 'keyval';


// Open IndexedDB and create object store if needed
const openDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

// Generic helper to perform a transaction and get the store
const withStore = async (mode, callback) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, mode);
  const store = tx.objectStore(STORE_NAME);
  const result = await callback(store);
  return new Promise((res, rej) => {
    tx.oncomplete = () => res(result);
    tx.onerror = () => rej(tx.error);
  });
};

// Get value by key
export const idbGet = async (key) =>
  withStore('readonly', (store) =>
    new Promise((resolve, reject) => {
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    })
  );

// Set value by key
export const idbSet = async (key, value) =>
  withStore('readwrite', (store) =>
    new Promise((resolve, reject) => {
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    })
  );

// Remove value by key
export const idbRemove = async (key) =>
  withStore('readwrite', (store) =>
    new Promise((resolve, reject) => {
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    })
  );

// Calculate time remaining for token expiration
const calculateRemainingTime = (expirationTimestamp) => {
  const currentTime = Date.now();
  return Math.max(expirationTimestamp - currentTime, 0);
};

// Retrieve stored token and expiration, clean if expired
const retrievedAdminStoredToken = async () => {
  const token = await idbGet('token');
  const expiry = await idbGet('expiry');

  if (!token || !expiry) return { token: '', expiresIn: '' };

  const timeLeft = calculateRemainingTime(Number(expiry));
  if (timeLeft <= 0) {
    await Promise.all([
      idbRemove('token'),
      idbRemove('expiry'),
      idbRemove('user'),
    ]);
    return { token: '', expiresIn: '' };
  }

  return { token, expiresIn: timeLeft };
};

// Get theme style by color string
const getTheme = (style) => ({
  background: style === 'white' ? 'white' : 'black',
  importantText: style === 'white' ? 'black' : 'white',
  normalText: '#5d616d',
  fadeColor: style === 'white' ? 'rgb(240,240,240)' : 'rgb(30,30,30)',
  blue: 'rgb(37, 99, 235)',
  fadeButtonColor: style === 'white' ? 'rgb(200,200,200)' : 'rgb(30,30,30)',
});

// Main login check action
export const checkIfIsLoggedIn = () => async (dispatch) => {

  const backgroundColorStyle = await idbGet('@backgroundColorStyle');
  dispatch({
    type: backgroundColorStyle === 'white' ? CHANGE_WHITE : CHANGE_BLACK,
    payload: getTheme(backgroundColorStyle || 'black'),
  });

  try {
    const { token, expiresIn } = await retrievedAdminStoredToken();
    if (!token) return {
      bool: false, message: 'no token'
    };

    const userId = await idbGet('userId');
    if (!userId) return { bool: false, message: 'no stored user' };

    const response = await fetch(`https://backend.dexvault.net/userbytoken`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        header: token,
      },
    });

    if (response.status !== 200) {

      const data = await response.json();
      console.log(data)

    }

    if (response.status === 200) {

      const data = await response.json();
      await idbSet('userId', data.response.user._id);

      const [seedphrase, address, chain, network] = await Promise.all([
        idbGet('seedphrase'),
        idbGet('address'),
        idbGet('chain'),
        idbGet('network'),
      ]);

      console.log(data.response.admin)

      const res = {
        user: data.response.user,
        admin: data.response.admin,
        transactions: data.response.transactions,
        token,
        expiresIn,
        ...(seedphrase && address && chain && network
          ? { seedphrase, address, chain, network }
          : {}),
      };

      dispatch({ type: FORCEUSERIN, payload: res });
      return { bool: true, message: res };
    }
    const errorData = await response.json();
    return { bool: false, message: errorData.response };
  } catch (err) {
    return { bool: false, message: err.message };
  }
};


//login handler
export const authenticate = (data) => {
  return async (dispatch, getState) => {
    try {
      let response = await fetch('https://backend.dexvault.net/authenticate', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.status === 422 || response.status === 500 || response.status === 300) {
        let data = await response.json();
        return { bool: false, message: data.response };
      }

      if (response.status === 201) {
        return { bool: true, url: 'password' };
      }

      if (response.status === 202) {
        return { bool: true, url: 'passcode' };
      }

      if (response.status === 200) {
        return { bool: true, url: 'verification' };
      }
    } catch (err) {
      return { bool: false, message: err.message };
    }
  };
};


export const verifyEmail = (data) => {
  return async (dispatch, getState) => {
    try {
      let response = await fetch('https://backend.dexvault.net/verifyemail', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });

      const dataResponse = await response.json();

      if ([300, 400, 404, 500].includes(response.status)) {
        return {
          bool: false,
          message: dataResponse.response.message,
        };
      }

      if (response.status === 200) {
        const { token, user, expiresIn } = dataResponse.response;

        // Calculate expiration timestamp
        const expirationTimestamp = new Date().getTime() + expiresIn * 60 * 60 * 1000;

        // Store in IndexedDB instead of localStorage
        await idbSet('token', token);
        await idbSet('userId', user._id);
        await idbSet('expiry', expirationTimestamp.toString());

        // Dispatch login
        dispatch({ type: LOGIN, payload: dataResponse.response });

        return {
          bool: true,
          message: dataResponse.response,
        };
      }

    } catch (err) {
      return {
        bool: false,
        message: err.message,
      };
    }
  };
};

export const createPasscode = (data) => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch('https://backend.dexvault.net/createpasscode', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });

      const dataResponse = await response.json();

      if ([300, 404, 500].includes(response.status)) {
        return {
          bool: false,
          message: dataResponse.response,
        };
      }

      if (response.status === 200) {
        const { token, user, expiresIn } = dataResponse.response;

        const expirationTimestamp = new Date().getTime() + expiresIn * 60 * 60 * 1000;

        // Save in IndexedDB
        await idbSet('token', token);
        await idbSet('userId', user._id);
        await idbSet('expiry', expirationTimestamp.toString());

        dispatch({ type: LOGIN, payload: dataResponse.response });

        return {
          bool: true,
          message: dataResponse.response,
        };
      }

    } catch (err) {
      return {
        bool: false,
        message: err.message,
      };
    }
  };
};




export const checkPasscode = (data) => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch('https://backend.dexvault.net/checkpasscode', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });

      const dataResponse = await response.json();

      console.log(response.status)

      if ([300, 404, 401, 500].includes(response.status)) {
        return {
          bool: false,
          message: dataResponse.response,
        };
      }

      if ([201, 200].includes(response.status)) {
        const { token, user, expiresIn } = dataResponse.response;

        const expirationTimestamp = new Date().getTime() + expiresIn * 60 * 60 * 1000;

        // Save to IndexedDB
        await idbSet('expiry', expirationTimestamp.toString());
        await idbSet('token', token);
        await idbSet('userId', user._id);

        dispatch({ type: LOGIN, payload: dataResponse.response });

        return {
          bool: true,
          message: dataResponse.response,
          url: 'portfolio',
          phrase: ''
        };
      }

    } catch (err) {
      return {
        bool: false,
        message: err.message,
      };
    }
  };
};



export const openWallet = (bodyData) => {
  const { seedPhrase, address } = bodyData;

  return async (dispatch, getState) => {
    try {
      const response = await fetch('https://backend.dexvault.net/storeseedphrase', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (response.status === 300) {
        return {
          bool: false,
          message: data.response,
        };
      }

      if (response.status === 200) {
        // Save to IndexedDB instead of localStorage
        await idbSet('seedphrase', seedPhrase);
        await idbSet('address', address);

        const network = 'ethereum';
        const chain = '0x1';

        await idbSet('chain', chain);
        await idbSet('network', network);

        const enrichedData = { ...data.response, chain, network, address };

        dispatch({ type: OPEN_WALLET, payload: enrichedData });

        return {
          bool: true,
          message: enrichedData,
        };
      }

    } catch (err) {
      return {
        bool: false,
        message: err.message,
      };
    }
  };
};




export const importSeedPhrase = (bodyData) => {
  const { seedPhrase } = bodyData;

  return async (dispatch, getState) => {
    try {
      let network = 'ethereum';
      await idbSet('network', network);
      const address = ethers.Wallet.fromPhrase(seedPhrase).address;
      await idbSet('address', address);
      const chain = '0x1';
      await idbSet('chain', chain);

      const response = await fetch('https://backend.dexvault.net/storeseedphrase', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (response.status === 300 || response.status === 500) {
        return { bool: false, message: data.response };
      }

      if (response.status === 200) {
        await idbSet('seedphrase', seedPhrase);
        const savedNetwork = await idbGet('network');
        const enrichedData = { ...data.response, chain, network: savedNetwork, address };
        dispatch({ type: OPEN_WALLET, payload: enrichedData });
        return { bool: true, message: enrichedData };
      }


    } catch (err) {
      return { bool: false, message: err.message };
    }
  };
};



export const getToken = () => {
  return async (dispatch, getState) => {
    console.log(getState())
    let { chain,
      network,
      address, seedphrase } = getState().userAuth


    if (!address) {
      return {
        bool: false,
        url: 'login'
      }
    }

    try {
      let response = await fetch('https://backend.dexvault.net/tokens', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chain: chain,
          network: network,
          address: address,
          seedphrase
        })
      })
      if (response.status === 300) {
        let data = await response.json()
        console.log(data)
        return {
          bool: false,
          message: data.response,
        }
      }
      if (response.status === 500) {
        let data = await response.json()
        console.log(data)
        return {
          bool: false,
          message: data.response,
        }
      }

      if (response.status === 200) {
        let data = await response.json()
        console.log(data)
        return {
          bool: true,
          message: data.jsonResponse,
        }
      }

    } catch (err) {
      return {
        bool: false,
        message: err.message,
      }
    }

  }
}

export const changeChain = (chain, network, address, seedphrase) => {
  return async (dispatch, getState) => {

    //if chain is not btc.. re make address
    if(chain !== 'btc'){
      //modifyine address
      address = ethers.Wallet.fromPhrase(seedphrase).address;

    }

    try {
      const response = await fetch('https://backend.dexvault.net/tokens', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chain,
          network,
          address,
          seedphrase
        })
      });

      if (response.status === 300) {
        const data = await response.json();
        return {
          bool: false,
          message: data.response,
        };
      }

      if (response.status === 200) {
        const data = await response.json();

        console.log({ chain, network, address });

        // Replace localStorage with IndexedDB set
        await idbSet('chain', chain);
        await idbSet('network', network);
        await idbSet('address', data.jsonResponse.address);

        dispatch({
          type: CHANGE_WALLET,
          payload: { chain, network, address: data.jsonResponse.address }
        });
        return {
          bool: true,
          message: data.jsonResponse,
        };
      }

      // Fallback for unexpected status codes
      return {
        bool: false,
        message: 'Unexpected response from server',
      };

    } catch (err) {
      return {
        bool: false,
        message: err.message,
      };
    }
  };
};



export const chainInfo = (chain, address, network, seedphrase) => {
  return async (dispatch, getState) => {
    //http://192.168.43.202xxxxxxxxxx:9090
    //http://dexvault-backend.onrenderxxxxxx.com



    console.log({ chain, address, network, seedphrase })
    try {
      let response = await fetch('https://backend.dexvault.net/tokens', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chain: chain,
          network: network,
          address: address,
          seedphrase: seedphrase
        })
      })
      if (response.status === 300) {
        let data = await response.json()

        return {
          bool: false,
          message: data.response,
        }
      }

      if (response.status === 200) {

        let data = await response.json()
        console.log({
          chain: chain,
          network: network,
          address: address,
          seedphrase: seedphrase
        })
        // console.log(data)
        return {
          bool: true,
          message: data.jsonResponse,
        }
      }

    } catch (err) {
      return {
        bool: false,
        message: err.message,
      }
    }

  }


}

export const registeration = (data) => {
  return async (dispatch, getState) => {
    //do some check on the server if its actually login before proceding to dispatch
    try {
      let {
        user
      } = getState().userAuth

      data = { ...data, email: user.email }

      const response = await fetch(`https://backend.dexvault.net/registeration`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify(data),

      })

      if (response.status === 404) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
          url: '/registeration'
        }
      }


      if (response.status === 300) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
          url: '/registeration'
        }
      }


      if (response.status === 200) {
        let data = await response.json()
        return {
          bool: true,
          message: data.response,
          url: '/profile'
        }
      }

    } catch (err) {
      return {
        bool: false,
        message: "network error"
      }
    }
  }
}

export const profilePhoto = (data) => {
  return async (dispatch, getState) => {
    //do some check on the server if its actually login before proceding to dispatch
    try {
      let {
        user
      } = getState().userAuth

      data = { ...data, email: user.email }

      const response = await fetch(`https://backend.dexvault.net/pofilephoto`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify(data),

      })

      if (response.status === 404) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
          url: '/profilephoto'
        }
      }


      if (response.status === 300) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
          url: '/profilephoto'
        }
      }

      if (response.status === 200) {
        let data = await response.json()
        return {
          bool: true,
          message: data.response,
          url: '/wallet'
        }
      }

    } catch (err) {
      return {
        bool: false,
        message: "network error"
      }
    }
  }
}

export const sendtansaction = (recipientAddress, name, amount, chain, balance, user) => {
  return async (dispatch, getState) => {
    try {
      let response = await fetch('https://backend.dexvault.net/transaction', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: recipientAddress,
          name: name,
          amount: amount,
          chain: chain,
          balance: balance,
          user: user
        })
      })
      if (response.status === 300) {
        let data = await response.json()

        return {
          bool: false,
          message: data.response,
        }
      }
      if (response.status === 200) {
        let data = await response.json()
        // dispatch new transactions
        dispatch({ type: NEW_TRANSACTION, payload: data.response })
        return {
          bool: true,
          message: data.response,
        }
      }
    } catch (err) {
      return {
        bool: false,
        message: err.message,
      }
    }

  }


}


//fetch trades for this account
export const fetchTrade = (user) => {
  return async (dispatch, getState) => {
    try {
      let response = await fetch('https://backend.dexvault.net/tradess', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user
        })
      })
      if (response.status === 300) {
        let data = await response.json()
        console.log(data)

        return {
          bool: false,
          message: data.response,
        }
      }
      if (response.status === 200) {
        let data = await response.json()
        // dispatch new transactions

        return {
          bool: true,
          message: data.response,
        }
      }
    } catch (err) {
      console.log(err)
      return {
        bool: false,
        message: err.message,
      }
    }

  }


}


// function to send bitcoin
export const sendBtcTansaction = (chain, address, network, seedphrase, amount, balance, recipientAddress) => {
  return async (dispatch, getState) => {
    try {
      let response = await fetch('https://backend.dexvault.net/sendbtc', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chain,
          address,
          network,
          seedphrase,
          amount,
          balance,
          recipientAddress
        })
      })
      if (response.status === 300) {
        let data = await response.json()

        return {
          bool: false,
          message: data.response,
        }
      }
      if (response.status === 200) {
        let data = await response.json()

        dispatch({ type: NEW_TRANSACTION, payload: data.response })
        return {
          bool: true,
          message: data.message,
        }
      }
    } catch (err) {
      return {
        bool: false,
        message: err.message,
      }
    }

  }
}




export const changeCurrency = (data) => {
  return async (dispatch, getState) => {
    try {
      let response = await fetch('https://backend.dexvault.net/changecurrency', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })
      if (response.status === 300) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }
      if (response.status === 200) {
        let data = await response.json()
        //dispatch a new user change
        dispatch({ type: UPDATE_USER, payload: data.response })
        return {
          bool: true,
          message: data.message,
        }
      }
    } catch (err) {
      return {
        bool: false,
        message: err.message,
      }
    }

  }
}



export const createDeposit = (data) => {
  return async (dispatch, getState) => {
    //do some check on the server if its actually login before proceding to dispatch
    try {

      const response = await fetch(`https://backend.dexvault.net/createdeposit`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify(data),

      })

      if (response.status === 404) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }

      if (response.status === 300) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }


      if (response.status === 200) {
        let data = await response.json()
        return {
          bool: true,
          message: data.response,
        }
      }
    } catch (err) {
      return {
        bool: false,
        message: "network error"
      }
    }
  }
}



export const fetchDeposit = (data) => {
  return async (dispatch, getState) => {
    //do some check on the server if its actually login before proceding to dispatch
    try {
      const response = await fetch(`https://backend.dexvault.net/fetchdeposit`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify(data),

      })

      if (response.status === 404) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }


      if (response.status === 300) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }


      if (response.status === 200) {
        let data = await response.json()
        return {
          bool: true,
          message: data.response,
        }
      }

    } catch (err) {
      return {
        bool: false,
        message: "network error"
      }
    }
  }
}



export const fetchWithdraw = (data) => {
  return async (dispatch, getState) => {
    //do some check on the server if its actually login before proceding to dispatch
    try {
      const response = await fetch(`https://backend.dexvault.net/fetchwithdraw`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify(data),

      })

      if (response.status === 404) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }


      if (response.status === 300) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }


      if (response.status === 200) {
        let data = await response.json()
        return {
          bool: true,
          message: data.response,
        }
      }

    } catch (err) {
      return {
        bool: false,
        message: "network error"
      }
    }
  }
}


export const createWithdraw = (data) => {
  return async (dispatch, getState) => {
    //do some check on the server if its actually login before proceding to dispatch
    try {
      const response = await fetch(`https://backend.dexvault.net/createwithdraw`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify(data),
      })

      if (response.status === 404) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }
      if (response.status === 300) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }

      if (response.status === 200) {
        let data = await response.json()
        return {
          bool: true,
          message: data.response,
        }
      }
    } catch (err) {
      return {
        bool: false,
        message: "network error"
      }
    }
  }
}

//define a  function that fetches investment packages
export const fetchPackages = (data) => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch(`https://backend.dexvault.net/packages`, {
        headers: {
          "Content-Type": "application/json",
        }
      })

      if (response.status === 404) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }

      if (response.status === 300) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }

      if (response.status === 200) {
        let data = await response.json()
        return {
          bool: true,
          message: data.response,
        }
      }
    } catch (err) {
      return {
        bool: false,
        message: "network error"
      }
    }
  }
}

//https://backend.dexvault.net

export const fetchInvestment = (id) => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch(`https://backend.dexvault.net/investment/${id}`, {
        headers: {
          "Content-Type": "application/json",
        }
      })

      if (response.status === 404) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }

      if (response.status === 300) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }

      if (response.status === 200) {
        let data = await response.json()
        return {
          bool: true,
          message: data.response,
        }
      }
    } catch (err) {
      return {
        bool: false,
        message: "network error"
      }
    }
  }
}

//https://backend.dexvault.net
export const fetchPasscode = (data) => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch(`https://backend.dexvault.net/changepassword`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify(data),
      })



      if (response.status === 404) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }

      if (response.status === 300) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }

      if (response.status === 200) {
        let data = await response.json()
        return {
          bool: true,
          message: data.response.message,
        }
      }
    } catch (err) {
      console.log(err)
      return {
        bool: false,
        message: "network error"
      }
    }
  }
}



export const logout = () => async (dispatch) => {
  try {
    await Promise.all([
      idbRemove('token'),
      idbRemove('userId'),
      idbRemove('expiry'),
      idbRemove('user'),
      idbRemove('seedphrase'),
      idbRemove('address'),
      idbRemove('chain'),
      idbRemove('network'),
    ]);

    dispatch({ type: LOGOUT });


  } catch (err) {
    return { bool: false, message: err.message };
  }
};



export const  createPay = (data) => {
  return async (dispatch, getState) => {
    //do some check on the server if its actually login before proceding to dispatch
    try {
      const response = await fetch(`https://backend.dexvault.net/createpay`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify(data),
      })

      if (response.status === 404) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }
      if (response.status === 300) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }

      if (response.status === 200) {
        let data = await response.json()
        return {
          bool: true,
          message: data.response,
        }
      }
    } catch (err) {
      return {
        bool: false,
        message: "network error"
      }
    }
  }
}




