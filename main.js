/* Moralis init code */
// const serverUrl = 'https://fnq9ueg5rh3t.usemoralis.com:2053/server' // old serverUrl
// const appId = 'jC9FbUAN6ggfoSXiWQAI8lXZ1utDYCZospdfx8Cw' // old app ID
// const tokenContractAddy = '0x3f8855410EF6F7Ab7Da6680e04afa7DF95D49C94' // mumbai univrs
// const gameContractAddy = '0x53799CF9dfa72C02A644ba4d6E874AFF3F603482' // mumbail game
const serverUrl = 'https://ytw9hgvdwbop.usemoralis.com:2053/server'
const appId = 'bIsFe0a9AxWQH1mCxUJtRu00RyO5MMRjWLSoONnY'
const gameContractAddy = '0x3EcB3c08a30E924B92bc0288Aa7a59cF10B9aaDF'
const tokenContractAddy = '0x337617f19b496cba235f3611e0a69aa94de6c400'

Moralis.start({ serverUrl, appId })

var tokenBalance = 0
var tokenAllowance = 0

/* Check that we can read from the contract */
async function balanceCheck() {
  let user = Moralis.User.current()
  // console.log(user.get('ethAddress'))
  let options = {
    contractAddress: tokenContractAddy,
    functionName: 'balanceOf',
    abi: [
      {
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    params: {
      account: user.get('ethAddress'),
    },
  }

  const balance = await Moralis.executeFunction(options)
  tokenBalance = balance
  return balance
}

/* Check that we can read from the contract */
async function allowanceCheck() {
  let user = Moralis.User.current()
  let options = {
    contractAddress: tokenContractAddy,
    functionName: 'allowance',
    abi: [
      {
        inputs: [
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'address', name: 'spender', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    params: {
      owner: user.get('ethAddress'),
      spender: gameContractAddy,
    },
  }
  const allowance = await Moralis.executeFunction(options).catch((error) => {
    console.log('error checking allowance')
    console.log(error)
    return allowance
  })

  tokenAllowance = allowance.toString()
  return allowance
}

/* Check that we can read from the contract */
async function approveSTEAK() {
  let options = {
    contractAddress: tokenContractAddy,
    functionName: 'approve',
    abi: [
      {
        inputs: [
          { internalType: 'address', name: 'spender', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    params: {
      spender: gameContractAddy,
      amount: 4503599627370496, // 2^52 to be friendly to javascript. Intention is to make this arbitrarily large to not need further approval.
    },
  }

  const approved = await Moralis.executeFunction(options)
}

async function joinGame(gameID) {
  let options = {
    contractAddress: gameContractAddy,
    functionName: 'joinGame',
    abi: [
      {
        inputs: [{ internalType: 'uint256', name: 'gameID', type: 'uint256' }],
        name: 'joinGame',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    params: {
      gameID: gameID,
    },
  }

  let tx = await Moralis.executeFunction(options)
  document.getElementById('join-game-' + gameID).innerHTML =
    "<a href='https://polygonscan.com/tx/" +
    tx.hash +
    "' target='_blank'>Join Tx</a>"
  document.getElementById('join-game-' + gameID).setAttribute('onclick', '')
}

async function createGame(
  tokenEntry,
  minEntries,
  maxEntries,
  entriesPerWallet
) {
  let options = {
    contractAddress: gameContractAddy,
    functionName: 'createGame',
    abi: [
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_entryFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: '_minEntrants',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: '_maxEntrants',
            type: 'uint256',
          },
          {
            internalType: 'uint16',
            name: '_maxEntriesPerWallet',
            type: 'uint16',
          },
          {
            internalType: 'address[]',
            name: '_gameAllowList',
            type: 'address[]',
          },
        ],
        name: 'createGame',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    params: {
      _entryFee: tokenEntry,
      _minEntrants: minEntries,
      _maxEntrants: maxEntries,
      _maxEntriesPerWallet: entriesPerWallet,
      _gameAllowList: [],
    },
  }

  let tx = await Moralis.executeFunction(options)
  document.getElementById('quick-game-btn').innerHTML =
    "<a href='https://polygonscan.com/tx/" +
    tx.hash +
    "' target='_blank'>Your Game is Being Created.</a> Refresh the page once the tx is complete."
  document.getElementById('quick-game-btn').setAttribute('onclick', '')
  return tx
}

async function createCustomGame(
  tokenEntry,
  minEntries,
  maxEntries,
  entriesPerWallet
) {
  let tx = await createGame(
    document.getElementById('entry-input').value,
    document.getElementById('min-input').value,
    document.getElementById('max-input').value,
    document.getElementById('entries-wallet-input').value
  )
  document.getElementById('create-custom-btn').innerHTML =
    "<a href='https://polygonscan.com/tx/" +
    tx.hash +
    "' target='_blank'>Your Game is Being Created.</a> Refresh the page once the tx is complete to see it in the game list."
  document.getElementById('create-custom-btn').setAttribute('onclick', '')
}

async function cancelGame(gameID) {
  let options = {
    contractAddress: gameContractAddy,
    functionName: 'cancelGame',
    abi: [
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'gameID',
            type: 'uint256',
          },
        ],
        name: 'cancelGame',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    params: {
      gameID: gameID,
    },
  }

  let tx = await Moralis.executeFunction(options)
  document.getElementById('cancel-game-' + gameID).innerHTML =
    "<a href='https://polygonscan.com/tx/" +
    tx.hash +
    "' target='_blank'>Cancel Tx</a>"
  document.getElementById('cancel-game-' + gameID).setAttribute('onclick', '')
}

async function runGame(gameID) {
  let options = {
    contractAddress: gameContractAddy,
    functionName: 'runGame',
    abi: [
      {
        inputs: [{ internalType: 'uint256', name: 'gameID', type: 'uint256' }],
        name: 'runGame',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    params: {
      gameID: gameID,
    },
  }

  let tx = await Moralis.executeFunction(options)
  document.getElementById('run-game-' + gameID).innerHTML =
    "<a href='https://polygonscan.com/tx/" +
    tx.hash +
    "' target='_blank'>Run Tx</a>"
  document.getElementById('run-game-' + gameID).setAttribute('onclick', '')
}

async function getGames() {
  let user = Moralis.User.current()
  let options = {
    contractAddress: gameContractAddy,
    functionName: 'nextGameID',
    abi: [
      {
        inputs: [],
        name: 'nextGameID',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
  }

  let openGamesOptions = {
    contractAddress: gameContractAddy,
    functionName: 'getOpenGames',
    abi: [
      {
        inputs: [],
        name: 'getOpenGames',
        outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
  }

  let gameDetailOptions = {
    contractAddress: gameContractAddy,
    functionName: 'gamesMapping',
    abi: [
      {
        inputs: [{ internalType: 'uint256', name: 'gameID', type: 'uint256' }],
        name: 'gamesMapping',
        outputs: [
          { internalType: 'address', name: 'creator', type: 'address' },
          { internalType: 'bool', name: 'isPublic', type: 'bool' },
          {
            internalType: 'uint16',
            name: 'maxEntriesPerWallet',
            type: 'uint16',
          },
          { internalType: 'uint256', name: 'entryFee', type: 'uint256' },
          { internalType: 'uint256', name: 'minEntrants', type: 'uint256' },
          { internalType: 'uint256', name: 'maxEntrants', type: 'uint256' },
          { internalType: 'address', name: 'winner', type: 'address' },
          { internalType: 'uint256', name: 'prize', type: 'uint256' },
          { internalType: 'bool', name: 'requestedRandom', type: 'bool' },
          { internalType: 'bool', name: 'completed', type: 'bool' },
          { internalType: 'uint256', name: 'randomRequestID', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'randomWordReturned',
            type: 'uint256',
          },
          { internalType: 'string', name: 'gameAlias', type: 'string' },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    params: {
      gameID: 0,
    },
  }

  let gameEntriesOptions = {
    contractAddress: gameContractAddy,
    functionName: 'getGameEntrants',
    abi: [
      {
        inputs: [{ internalType: 'uint256', name: 'gameID', type: 'uint256' }],
        name: 'getGameEntrants',
        outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    params: {
      gameID: 0,
    },
  }

  // game allow list array ABI
  /*
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "gameID",
                  "type": "uint256"
                }
              ],
              "name": "getGameAllowlist",
              "outputs": [
                {
                  "internalType": "address[]",
                  "name": "",
                  "type": "address[]"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
  */

  const nextGameID = await Moralis.executeFunction(options)
  Moralis.executeFunction(openGamesOptions)
    .then((value) => {
      // console.log(value)
      document.getElementById('open-games-table-body').innerHTML = ''
      document.getElementById('completed-games-table-body').innerHTML = ''
      let pastGames = 0
      let activeGamesHTML = []
      let pastGamesHTML = []

      /// suppppper hacky ordering. Again, this would be way better in vue or react
      let activeGamesCount = 0
      let pastGamesCount = 0
      for (let i = value.length - 1; i >= 0; i--) {
        if (value[i] < 1 && pastGames < 10) {
          // pastGamesHTML += '{{{' + i + '}}}'
          pastGamesHTML.push('')
          pastGamesCount++
        } else if (value[i] > 0) {
          // activeGamesHTML = '{{{' + i + '}}}' + activeGamesHTML
          activeGamesHTML.push('')
          activeGamesCount++
        }
      }

      for (let i = value.length - 1; i >= 0; i--) {
        if (value[i].toString() != '0' || pastGames < 10) {
          let localGameDetailOptions = JSON.parse(
            JSON.stringify(gameDetailOptions)
          )
          localGameDetailOptions.params['gameID'] = i + 1
          let localGameEntriesOptions = JSON.parse(
            JSON.stringify(gameEntriesOptions)
          )
          localGameEntriesOptions.params['gameID'] = i + 1
          Moralis.executeFunction(localGameDetailOptions)
            .then((gameDetail) => {
              // console.log(
              //   'fetched gameDetail for ' +
              //     localGameEntriesOptions.params['gameID']
              // )
              Moralis.executeFunction(localGameEntriesOptions)
                .then((gameEntries) => {
                  // console.log(
                  //   'fetched gameEntries for ' +
                  //     localGameEntriesOptions.params['gameID']
                  // )
                  let currentEntriesCount = gameEntries.length
                  let myEntries = 0
                  for (let j = 0; j < currentEntriesCount; j++) {
                    // console.log(gameEntries[j].toString())
                    // console.log(user.get('ethAddress').toString())
                    if (
                      gameEntries[j].toLowerCase() ==
                      user.get('ethAddress').toLowerCase()
                    ) {
                      myEntries++
                    }
                  }
                  // console.log(myEntries)
                  let html = ''
                  if (value[i].toString() == '0') {
                    html = `<tr>
                  <td>
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">ID: {{GameID}}</h6>
                        <p class="text-sm text-secondary mb-0">Host: {{Creator}}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="text-sm font-weight-bold text-dark mb-0">{{CurrentEntries}}</p>
                  </td>
                  <td>
                    <p class="text-sm text-dark mb-0 text-center">{{Prize}}</p>
                  </td>
                  <td class="align-middle text-center">
                    <span class="text-secondary text-sm font-weight-bold text-dark">{{Winner}}</span>
                  </td>
                </tr>`
                  } else {
                    html = `<tr>
                  <td>
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">ID: {{GameID}}</h6>
                        <p class="text-sm text-secondary mb-0">Host: {{Creator}}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="text-sm font-weight-bold text-dark mb-0">{{EntryFee}} STEAK</p>
                  </td>
                  <td>
                    <p class="text-sm text-dark mb-0 text-center">{{CurrentEntries}} / {{EntriesRemain}}</p>
                  </td>
                  <td class="align-middle text-center">
                    <span class="text-secondary text-sm font-weight-bold text-dark">{{EntriesPerWallet}} ({{MyEntries}})</span>
                  </td>
                  <td class="align-middle text-center text-sm text-dark">
                    <span class="badge badge-md badge-{{ReadyToRunState}}">{{ReadyToRun}} ({{NeededForMin}})</span>
                    
                  </td>
                  <td class="align-middle">
                    <button id="join-game-{{GameID}}" {{JoinGameDisabled}} onclick="joinGame({{GameID}})" class="btn col-12 btn-sm bg-gradient-{{JoinGameBtnState}} btn-round text-light my-auto font-weight-bold text-xs join-game" data-gameid={{GameID}} data-toggle="tooltip" data-original-title="Join Game">
                      {{JoinGameEligibility}}
                    </button>
                    <br/>
                    <div style="{{RunButtonVisibility}}" >
                    <button id="run-game-{{GameID}}" onclick="runGame({{GameID}})" class="btn col-12 btn-sm bg-gradient-success btn-round text-dark my-auto font-weight-bold mt-2 text-xs">Run Game</button>
                    <br/>
                    </div>
                    <button style="{{CancelButtonVisibility}}" id="cancel-game-{{GameID}}" onclick="cancelGame({{GameID}})" class="btn col-12 btn-sm bg-gradient-danger btn-round mt-2 text-light font-weight-bold text-xs">Cancel Game</button>
                  </td>
                </tr>`
                  }

                  // console.log(tokenBalance)
                  // console.log(gameDetail.entryFee)
                  // console.log(tokenBalance > gameDetail.entryFee)

                  html = html
                    .replaceAll('{{GameID}}', i + 1)
                    .replace(
                      '{{Creator}}',
                      gameDetail.creator.toString().substring(1, 8) +
                        '...' +
                        gameDetail.creator
                          .toString()
                          .substring(35, gameDetail.creator.toString().length)
                    )
                    .replace('{{EntryFee}}', gameDetail.entryFee.toString())
                    .replace(
                      '{{EntriesRemain}}',
                      gameDetail.maxEntrants.toString()
                    )
                    .replace('{{CurrentEntries}}', gameEntries.length)
                    .replace(
                      '{{EntriesPerWallet}}',
                      gameDetail.maxEntriesPerWallet.toString()
                    )
                    .replace(
                      '{{ReadyToRun}}',
                      gameEntries.length >= gameDetail.minEntrants
                        ? 'Yes'
                        : 'No'
                    )
                    .replace(
                      '{{ReadyToRunState}}',
                      gameEntries.length >= gameDetail.minEntrants
                        ? 'success'
                        : 'danger'
                    )
                    .replace(
                      '{{NeededForMin}}',
                      gameDetail.minEntrants.toString()
                    )
                    .replace(
                      '{{JoinGameEligibility}}',
                      myEntries >= gameDetail.maxEntriesPerWallet
                        ? 'No Entries Remain'
                        : tokenAllowance == '0'
                        ? 'STEAK Approve Required'
                        : tokenBalance.toNumber() <
                          gameDetail.entryFee.toNumber()
                        ? 'Not Enough STEAK'
                        : 'Join Game'
                    )
                    .replace('Join Game')
                    .replace(
                      '{{JoinGameDisabled}}',
                      myEntries >= gameDetail.maxEntriesPerWallet ||
                        tokenBalance.toNumber() <
                          gameDetail.entryFee.toNumber() ||
                        tokenAllowance == '0'
                        ? 'disabled'
                        : ''
                    )
                    .replace('{{MyEntries}}', myEntries)
                    .replace(
                      '{{JoinGameBtnState}}',
                      myEntries >= gameDetail.maxEntriesPerWallet ||
                        tokenBalance.toNumber() <
                          gameDetail.entryFee.toNumber() ||
                        tokenAllowance == '0'
                        ? 'secondary'
                        : 'info'
                    )
                    .replace(
                      '{{RunButtonVisibility}}',
                      gameDetail.creator.toLowerCase() ==
                        user.get('ethAddress').toLowerCase() &&
                        gameEntries.length >= gameDetail.minEntrants
                        ? ''
                        : 'display:none;'
                    )
                    .replace(
                      '{{CancelButtonVisibility}}',
                      gameDetail.creator.toLowerCase() ==
                        user.get('ethAddress').toLowerCase() &&
                        gameDetail.requestedRandom == false &&
                        gameDetail.completed == false
                        ? ''
                        : 'display:none;'
                    )
                    .replace('{{Prize}}', gameDetail.prize.toString())
                    .replace(
                      '{{Winner}}',
                      gameDetail.winner.toString() ==
                        '0x0000000000000000000000000000000000000000'
                        ? 'CANCELLED'
                        : gameDetail.winner.toString().substring(1, 8) +
                            '...' +
                            gameDetail.creator
                              .toString()
                              .substring(
                                35,
                                gameDetail.winner.toString().length
                              )
                    )
                  if (gameDetail.completed == true) {
                    // console.log(pastGamesCount)
                    pastGamesHTML[i] = html

                    pastGamesCount--
                    document.getElementById(
                      'completed-games-table-body'
                    ).innerHTML = pastGamesHTML.join('')

                    document.getElementById(
                      'completed-games-table-body'
                    ).style.display = 'table-row-group'
                  } else {
                    // console.log(activeGamesCount)
                    activeGamesHTML[i] = html
                    activeGamesCount--

                    document.getElementById('open-games-table-body').innerHTML =
                      activeGamesHTML.join('')
                    document.getElementById('open-games-data').style.display =
                      'block'
                  }
                })
                .catch((error) => {
                  console.log(
                    'Caught error when requesting game entries for game id ' +
                      localGameEntriesOptions.params['gameID']
                  )

                  if (value[i].toString() == '0') {
                    // past game
                    pastGamesCount--
                  } else {
                    activeGamesCount--
                  }

                  console.log(error)
                })
                .finally(() => {
                  console.log(
                    'finally on the promise ' +
                      pastGamesCount +
                      ' ' +
                      activeGamesCount
                  )
                  // if (pastGamesCount == 0) {
                  //   document.getElementById(
                  //     'completed-games-table-body'
                  //   ).innerHTML = pastGamesHTML

                  //   document.getElementById(
                  //     'completed-games-table-body'
                  //   ).style.display = 'table-row-group'
                  // }

                  // if (activeGamesCount == 0) {
                  //   document.getElementById('open-games-table-body').innerHTML =
                  //     activeGamesHTML

                  //   document.getElementById(
                  //     'open-games-placeholder'
                  //   ).style.display = 'none'
                  // }

                  if (activeGamesCount == 0) {
                    document.getElementById('preloader').remove()
                    document.getElementById('preloader-bg').remove()
                    document.getElementById('preloader-fg').remove()
                  }
                })
            })
            .catch((error) => {
              console.log(
                'Caught error when requesting game detail for game id ' +
                  localGameEntriesOptions.params['gameID']
              )

              if (value[i].toString() == '0') {
                // past game
                pastGamesCount--
              } else {
                activeGamesCount--
              }

              console.log(error)
            })
        }
      }
    })
    .catch((error) => {
      console.log('Caught error in calling openGames')
      console.log(error)
    })
}

/* Authentication code */
async function login() {
  let user = Moralis.User.current()
  if (user) {
    await Moralis.User.logOut()
    localStorage.removeItem('walletConnected')
  }
  user = Moralis.User.current()
  if (!user) {
    try {
      user = await Moralis.authenticate({
        signingMessage: 'Authenticate',
      })

      // document.getElementById('preloader').style.display = 'block'
      // document.getElementById('preloader-bg').style.display = 'block'
      // document.getElementById('preloader-fg').style.display = 'block'

      localStorage.setItem('walletConnected', true)
      // await Moralis.enableWeb3()
      // console.log(user)
      // console.log(user.get('ethAddress'))
      document.getElementById('wallet-addy').innerText =
        Moralis.User.current().get('ethAddress')
      document.getElementById('btn-connect').style.display = 'none'
      document.getElementById('btn-big-connect').style.display = 'none'
      document.getElementById('btn-connect-mobile').style.display = 'none'
      document.getElementById('btn-logout').style.display = 'block'
      document.getElementById('btn-logout-mobile').style.display = 'block'
      // CMR - document.getElementById('btn-approve').style.display = 'block'

      balanceCheck().then((value) => {
        // console.log('Balance' + value.toString())
        document.getElementById('token-balance').innerText =
          value.toString() + ' UNIVRS'
        allowanceCheck().then((allowance) => {
          if (allowance == 0) {
            document.getElementById('approve-token-btn').style.display = 'block'
          } else {
            document.getElementById('approved-actions').style.display = 'block'
          }
          // getGames()
        })
      })
    } catch (error) {
      console.log(error)
    }
  }
}

async function logOut() {
  await Moralis.User.logOut()

  localStorage.removeItem('walletConnected')
  document.getElementById('btn-connect').style.display = 'block'
  document.getElementById('btn-big-connect').style.display = 'block'
  document.getElementById('btn-connect-mobile').style.display = 'block'
  document.getElementById('btn-logout').style.display = 'none'
  document.getElementById('btn-logout-mobile').style.display = 'none'
  //CMR - document.getElementById('btn-approve').style.display = 'none'

  document.getElementById('wallet-addy').innerText = ''
  location.reload()
}

// document.getElementById('btn-connect').onclick = login
// document.getElementById('btn-connect-mobile').onclick = login
// document.getElementById('btn-logout').onclick = logOut
// document.getElementById('btn-logout-mobile').onclick = logOut
document.getElementById('create-custom-btn').onclick = createCustomGame
/*
document.getElementById('btn-approve').onclick = approveSTEAK
*/

const wallet_previously_connected = localStorage.getItem('walletConnected')
if (wallet_previously_connected === 'true') {
  Moralis.enableWeb3().then(() => {
    if (Moralis.User.current()) {
      document.getElementById('wallet-addy').innerText =
        Moralis.User.current().get('ethAddress')
      // document.getElementById('preloader').style.display = 'block'
      // document.getElementById('preloader-bg').style.display = 'block'
      // document.getElementById('preloader-fg').style.display = 'block'
      document.getElementById('btn-connect').style.display = 'none'
      document.getElementById('btn-big-connect').style.display = 'none'
      document.getElementById('btn-connect-mobile').style.display = 'none'
      document.getElementById('btn-logout').style.display = 'block'
      document.getElementById('btn-logout-mobile').style.display = 'block'

      // allowanceCheck().then((allowance) => {
      //   document.getElementById('btn-approve').style.display = 'block'
      //   if (allowance.toString() != '0') {
      //     document.getElementById('btn-approve').innerText =
      //       allowance.toString() + ' Allowance'
      //   }
      // })

      balanceCheck().then((value) => {
        // console.log('Balance' + value.toString())
        document.getElementById('token-balance').innerText =
          value.toString() + ' UNIVRS'

        allowanceCheck().then((allowance) => {
          if (allowance == 0) {
            document.getElementById('approve-token-btn').style.display = 'block'
          } else {
            document.getElementById('approved-actions').style.display = 'block'
          }
          // getGames()
        })
      })
    }
  })
}
