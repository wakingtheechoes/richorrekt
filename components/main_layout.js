const { useState, useEffect } = React

function MainAppLayout(props) {
  const [tokenBalance, setTokenBalance] = useState(0)
  const [tokenAllowance, setTokenAllowance] = useState(0)

  useEffect(() => {
    if (props.activeAddress) {
      TOKEN_READ_CONTRACT.balanceOf(props.activeAddress).then((balance) => {
        setTokenBalance(ethers.utils.formatUnits(balance, 18))
      })

      // console.log('allowance1', tokenAllowance)
      TOKEN_READ_CONTRACT.allowance(
        props.activeAddress,
        GAME_CONTRACT_ADDRESS
      ).then((allowance) => {
        // let allow = parseInt(allowance._hex, 16)
        setTokenAllowance(parseInt(ethers.utils.formatUnits(allowance, 18)))
        //   console.log(typeof allow, allow)
      })
    }
  })

  return (
    <div>
      <NavBar activeAddress={props.activeAddress} tokenBalance={tokenBalance} />
      <Hero
        tokenBalance={tokenBalance}
        tokenAllowance={tokenAllowance}
        activeAddress={props.activeAddress}
        signer={props.signer}
      />
      <GamesTable
        activeAddress={props.activeAddress}
        signer={props.signer}
        tokenBalance={tokenBalance}
        tokenAllowance={tokenAllowance}
      />
      <CompletedGamesTable activeAddress={props.active_address} />
    </div>
  )
}

const e = React.createElement

const reactAppDOM = document.querySelector('#react-app-main-layout')
const root = ReactDOM.createRoot(reactAppDOM)
root.render(e(MainAppLayout, { activeAddress: active_address }))
