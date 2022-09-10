'use strict'

function Hero(props) {
  function approveUNIVRS() {
    console.log('approve UNIVRS')
  }

  function login() {
    provider.send('eth_requestAccounts', []).then((val) => {
      console.log(val)
    })
  }

  function createGame(amount, min, max, entries) {
    console.log('Create Game')
  }

  return (
    <div
      className="page-header min-vh-50"
      style={{ backgroundImage: 'url(./assets/img/unisdiceheader.webp)' }}
    >
      <span className="mask bg-dark opacity-8"></span>
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto text-white text-center">
            <h2 className="text-white">
              UNIFLIP{' '}
              <span className="badge badge-xs badge-primary text-xxs mx-auto">
                BETA
              </span>
            </h2>
            <p className="lead">
              Put your UNIVRS on the line against other holders for big
              winnings.
            </p>
            {console.log(props.signer)}
            {!props.activeAddress && (
              <button
                onClick={() => login()}
                className="btn btn-round btn-lg bg-gradient-primary mx-auto"
                id="btn-big-connect"
              >
                Connect Wallet To Join games
              </button>
            )}
            {props.activeAddress && props.tokenAllowance < 1 && (
              <button
                onClick={() =>
                  TOKEN_READ_WRITE_CONTRACT.approve(
                    GAME_CONTRACT_ADDRESS,
                    4503599627370496
                  )
                }
                className="btn btn-round btn-lg bg-gradient-primary mx-auto"
                id="approve-token-btn"
              >
                Click Here to Approve UNIVRS Access
              </button>
            )}
            <div id="approved-actions" style={{ width: '100%' }}>
              <button
                onClick={() =>
                  GAME_READ_WRITE_CONTRACT.createGame(100, 2, 2, 1, [])
                }
                className="btn col-12 col-lg-10 btn-lg bg-gradient-primary mx-auto"
                id="quick-game-btn"
              >
                Start a Quick Match ( 1v1 Game, 100 UNIVRS Entry )
              </button>
              {/* <!-- Button trigger modal --> */}
              <button
                type="button"
                className="btn col-12 col-lg-10 bg-gradient-info btn-round btn-lg mx-auto"
                data-bs-toggle="modal"
                data-bs-target="#customGameCreateModal"
              >
                Create a Custom Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
