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


import { ethers } from 'ethers'

// Calculates how much time (in ms) is left until the expiry timestamp
let calculateRemainingTime = (hoursUntilExpiry) => {
  const currentTime = new Date().getTime();
  const expirationTime = currentTime + hoursUntilExpiry * 60 * 60 * 1000; // Convert hours to milliseconds
  const timeLeft = expirationTime - currentTime; // Time left in milliseconds
  return Math.max(timeLeft, 0); // Ensure non-negative result
};

// Function to retrieve admin token and check its validity
let retrievedAdminStoredToken = () => {
  const tokenFromStorage = localStorage.getItem('token');
  const expiryDate = localStorage.getItem('expiry'); // This should be a timestamp


  if (!expiryDate) {
    return {
      token: "",
      expiresIn: ""
    };
  }

  const timeLeft = calculateRemainingTime(Number(expiryDate)); // Ensure expiryDate is a number

  if (timeLeft <= 1000) {
    // Less than or equal to 1 hour
    localStorage.removeItem('token');
    localStorage.removeItem('expiry');
    localStorage.removeItem('user');

    return {
      token: "",
      expiresIn: ""
    };
  }

  return {
    token: tokenFromStorage,
    expiresIn: timeLeft
  };
}




//http://192.168.43.202:9090

export const checkIfIsLoggedIn = () => {
  return async (dispatch, getState) => {
    let backgroundColorStyle = localStorage.getItem('@backgroundColorStyle');
    if (!backgroundColorStyle) {
      let data = {
        background: 'black',
        importantText: 'white',
        normalText: '#5d616d',
        fadeColor: 'rgb(30,30,30)',
        blue: 'rgb(37, 99, 235)',
        fadeButtonColor: 'rgb(30,30,30)',
      };
      dispatch({ type: CHANGE_BLACK, payload: data });
    } else if (backgroundColorStyle === 'white') {
      let data = {
        background: 'white',
        importantText: 'black',
        normalText: '#5d616d',
        fadeColor: 'rgb(240,240,240)',
        blue: 'rgb(37, 99, 235)',
        fadeButtonColor: 'rgb(200,200,200)',
      };
      dispatch({ type: CHANGE_WHITE, payload: data });
    } else if (backgroundColorStyle === 'black') {
      let data = {
        background: 'black',
        importantText: 'white',
        normalText: '#5d616d',
        fadeColor: 'rgb(30,30,30)',
        blue: 'rgb(37, 99, 235)',
        fadeButtonColor: 'rgb(30,30,30)',
      };
      dispatch({ type: CHANGE_BLACK, payload: data });
    }

    try {
      let response;
      let { token, expiresIn } = await retrievedAdminStoredToken();

      if (!token) {
        return {
          bool: false,
          message: 'no token',
        };
      }

      expiresIn = expiresIn / (60 * 60 * 1000);
      localStorage.setItem('expiry', `${expiresIn}`);
      localStorage.setItem('token', token);
      let userId = localStorage.getItem('userId');

      if (!userId) {
        return {
          bool: false,
          message: 'no stored user',
        };
      }


      response = await fetch(`http://192.168.43.202:9090/userbytoken`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "header": `${token}`,
        },
      })


      if (response.status === 200) {

        let data = await response.json();


        localStorage.setItem('userId', data.response.user._id);

        //get wallet details which would influence the kind of force login

        let seedphrase = localStorage.getItem('seedphrase');
        let address = localStorage.getItem('address');

        let chain = localStorage.getItem('chain')
        let network = localStorage.getItem('network')
        let res

        if (seedphrase && address && chain && network) {

          res = {
            user: data.response.user,
            admin: data.response.admin,
            transactions: data.response.transactions,
            token: token,
            expiresIn: expiresIn,
            seedphrase: seedphrase,
            address: address,
            chain: chain,
            network: network
          };

        } else {
          res = {
            user: data.response.user,
            token: token,
            expiresIn: expiresIn,
            admin: data.response.admin,
            transactions: data.response.transactions,

          };


        }
        //check for 
        dispatch({ type: FORCEUSERIN, payload: res });
        return {
          bool: true,
          message: res,
        };
      }

      if (response.status === 300) {

        let data = await response.json();
        return {
          bool: false,
          message: data.response,
        };
      }
      if (response.status === 404) {

        let data = await response.json();
        return {
          bool: false,
          message: data.response,
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


//login handler
export const authenticate = (data) => {

  return async (dispatch, getState) => {
    try {

      let response = await fetch('http://192.168.43.202:9090/authenticate', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })
      if (response.status === 422) {

        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }
      if (response.status === 500) {

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

      if (response.status === 201) {

        let data = await response.json()
        return {
          bool: true,
          url: 'password'
        }
      }
      if (response.status === 202) {

        let data = await response.json()
        return {
          bool: true,
          url: 'passcode'
        }
      }

      if (response.status === 200) {

        let data = await response.json()

        return {
          bool: true,
          url: 'verification',
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

export const verifyEmail = (data) => {
  return async (dispatch, getState) => {
    try {
      let response = await fetch('http://192.168.43.202:9090/verifyemail', {
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
          message: data.response.message,
        }
      }

      if (response.status === 404) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response.message,
        }
      }

      if (response.status === 400) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response.message,
        }
      }

      if (response.status === 500) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response.message,
        }
      }

      if (response.status === 200) {
        let data = await response.json()
        //dispatching the LOGIN action
        localStorage.setItem('expiry', `${data.response.expiresIn}`);
        localStorage.setItem('token', data.response.token);
        localStorage.setItem('userId', data.response.user._id);

        dispatch({ type: LOGIN, payload: data.response })

        //dispatch login 
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

export const createPasscode = (data) => {
  return async (dispatch, getState) => {
    try {
      let response = await fetch('http://192.168.43.202:9090/createpasscode', {
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
      if (response.status === 404) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }
      if (response.status === 500) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }

      if (response.status === 200) {
        let data = await response.json()


        localStorage.setItem('expiry', `${data.response.expiresIn}`);
        localStorage.setItem('token', data.response.token);
        localStorage.setItem('userId', data.response.user._id);

        dispatch({ type: LOGIN, payload: data.response })
        //dispatch login 
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


export const checkPasscode = (data) => {
  return async (dispatch, getState) => {
    try {
      let response = await fetch('http://192.168.43.202:9090/checkpasscode', {
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
          message: data.response
        }
      }
      if (response.status === 404) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }
      if (response.status === 401) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response
        }
      }

      if (response.status === 500) {
        let data = await response.json()
        console.log(data)
        return {
          bool: false,
          message: data.response
          ,
        }
      }

      if (response.status === 200) {
        let data = await response.json()
        //dispatching the LOGIN action
        localStorage.setItem('expiry', `${data.response.expiresIn}`);
        localStorage.setItem('token', data.response.token);
        localStorage.setItem('userId', data.response.user._id);

        dispatch({ type: LOGIN, payload: data.response })
        //return url depending on the wallet state
        return {
          bool: true,
          message: data.response,
          url: 'invest',
          phrase: ''
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


export const openWallet = (bodyData) => {
  const { seedPhrase, address } = bodyData
  return async (dispatch, getState) => {
    try {
      let response = await fetch('http://192.168.43.202:9090/storeseedphrase', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData)
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
        localStorage.setItem('seedphrase', `${seedPhrase}`);
        localStorage.setItem('address', `${address}`);
        //fetching current chain
        let network = 'ethereum'
        let chain = '0x1'
        localStorage.setItem('chain', `${chain}`)
        localStorage.setItem('network', `${network}`)
        data.response = { ...data.response, chain: chain, network: network, address: address }

        dispatch({ type: OPEN_WALLET, payload: data.response })
        //dispatch login 


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


export const importSeedPhrase = (bodyData) => {
  const { seedPhrase } = bodyData
  let network = localStorage.getItem('network');
  try {
    if (!network) {
      network = 'ethereum';
      localStorage.setItem('network', network);

      const address = ethers.Wallet.fromPhrase(seedPhrase).address;
      localStorage.setItem('address', address);

      const chain = '0x1';
      localStorage.setItem('chain', chain); // Save Ethereum chain

      //API  call to call
      return async (dispatch, getState) => {
        try {
          let response = await fetch('http://192.168.43.202:9090/storeseedphrase', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData)
          })
          if (response.status === 300) {
            let data = await response.json()
            const state = getState();
            return {
              bool: false,
              message: data.response,
            }
          }
          if (response.status === 500) {
            let data = await response.json()
            const state = getState();
            return {
              bool: false,
              message: data.response,
            }
          }

          if (response.status === 200) {
            let data = await response.json()
            localStorage.setItem('seedphrase', `${seedPhrase}`);

            // fetching current network
            let network = localStorage.getItem('network');
            data.response = { ...data.response, chain, network, address };
            dispatch({ type: OPEN_WALLET, payload: data.response });

            return {
              bool: true,
              message: data.response,
            };



          }

        } catch (err) {
          console.log(err)
          return {
            bool: false,
            message: err.message,
          }
        }
      }



    } else if (network && network !== 'Bitcoin') {
      network = localStorage.getItem('network');
      const address = ethers.Wallet.fromPhrase(seedPhrase).address;
      const chain = localStorage.getItem('chain');


      //api call
      return async (dispatch, getState) => {
        try {
          let response = await fetch('http://192.168.43.202:9090/storeseedphrase', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData)
          })
          if (response.status === 300) {
            let data = await response.json()
            const state = getState();
            return {
              bool: false,
              message: data.response,
            }
          }
          if (response.status === 500) {
            let data = await response.json()
            const state = getState();
            return {
              bool: false,
              message: data.response,
            }
          }

          if (response.status === 200) {
            let data = await response.json()
            localStorage.setItem('seedphrase', `${seedPhrase}`);

            // fetching current network
            let network = localStorage.getItem('network');
            data.response = { ...data.response, chain, network, address };
            dispatch({ type: OPEN_WALLET, payload: data.response });

            return {
              bool: true,
              message: data.response,
            };



          }

        } catch (err) {
          return {
            bool: false,
            message: err.message,
          }
        }
      }

    } else if (network && network === 'Bitcoin') {
      //API call to generate btc address
      return async (dispatch, getState) => {
        try {
          let response = await fetch('http://192.168.43.202:9090/storeseedphrasebtc', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData)
          })
          if (response.status === 300) {
            let data = await response.json()
            const state = getState();
            return {
              bool: false,
              message: data.response,
            }
          }
          if (response.status === 500) {
            let data = await response.json()
            return {
              bool: false,
              message: data.response,
            }
          }

          if (response.status === 200) {
            let data = await response.json()
            localStorage.setItem('chain', 'btc');
            localStorage.setItem('seedphrase', `${seedPhrase}`);
            localStorage.setItem('address', data.response.address);
            // fetching current network
            data.response = { ...data.response, chain: 'btc', network: 'Bitcoin', address: data.response.address };
            dispatch({ type: OPEN_WALLET, payload: data.response });

            return {
              bool: true,
              message: data.response,
            };



          }

        } catch (err) {
          return {
            bool: false,
            message: err.message,
          }
        }
      }
    }

  } catch (err) {
    return {
      bool: false,
      message: err.message,
    }

  }




}


export const getToken = () => {
  return async (dispatch, getState) => {
    console.log(getState())
    let { chain,
      network,
      address, seedphrase } = getState().userAuth
    console.log(chain)

    if (!address) {
      return {
        bool: false,
        url: 'login'
      }
    }

    console.log(getState())
    try {
      let response = await fetch('http://192.168.43.202:9090/tokens', {
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
    try {
      let response = await fetch('http://192.168.43.202:9090/tokens', {
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
          address: address
        })

        localStorage.setItem('chain', `${chain}`)
        localStorage.setItem('network', `${network}`)

        // change wallet
        dispatch({ type: CHANGE_WALLET, payload: { chain: chain, network: network, address: data.jsonResponse.address } })

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


export const chainInfo = (chain, address, network, seedphrase) => {
  return async (dispatch, getState) => {

    console.log({ chain, address, network, seedphrase })
    try {
      let response = await fetch('http://192.168.43.202:9090/tokens', {
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

      const response = await fetch(`http://192.168.43.202:9090/registeration`, {
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

      const response = await fetch(`http://192.168.43.202:9090/pofilephoto`, {
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
      let response = await fetch('http://192.168.43.202:9090/transaction', {
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
      let response = await fetch('http://192.168.43.202:9090/tradess', {
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
      let response = await fetch('http://192.168.43.202:9090/sendbtc', {
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
      let response = await fetch('http://192.168.43.202:9090/changecurrency', {
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

      const response = await fetch(`http://192.168.43.202:9090/createdeposit`, {
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
      const response = await fetch(`http://192.168.43.202:9090/fetchdeposit`, {
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
      const response = await fetch(`http://192.168.43.202:9090/fetchwithdraw`, {
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

      const response = await fetch(`http://192.168.43.202:9090/createwithdraw`, {
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





export const logout = () => {
  return async (dispatch, getState) => {
    dispatch({ type: LOGOUT })
  }
}




