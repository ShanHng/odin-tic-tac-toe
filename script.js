// Models

const cellFactory = () => {
  let player = ''

  // exposed functions
  const isMarked = () => Boolean(player)
  const getPlayer = () => player
  const setPlayer = person => {
    player = person
  }
  return { isMarked, getPlayer, setPlayer }
}

const gameboard = (() => {
  let board = []

  reset()

  function mark (index, player) {
    const cell = board[index]
    cell.setPlayer(player)
  }

  function toArray () {
    const result = []
    for (cell of board) {
      if (!cell.isMarked()) {
        result.push('')
        continue
      }

      result.push(cell.getPlayer().getToken())
    }
    return result
  }

  function isCellMarked (index) {
    return board[index].isMarked()
  }

  function reset () {
    board = []
    for (let i = 0; i < 9; i++) {
      board.push(cellFactory())
    }
  }

  return { mark, isCellMarked, toArray, reset }
})()

const playerFactory = (playerName, playerToken) => {
  const token = playerToken
  const name = playerName

  const getToken = () => token
  const getName = () => name
  return { getToken, getName }
}

const gameController = (() => {
  let playerOne = ''
  let playerTwo = ''
  let isPlayerOneTurn = true
  let curPlayer = ''
  let winner = ''
  let result = ''
  let hasGameStarted = false

  const getWinningMessage = () =>
    `${winner.getName()} has won the game! Click START to replay!`

  const getTurnMessage = () => `${curPlayer.getName()}'s turn...`

  const getDrawMessage = () => "Game has ended. It's a draw!"

  const getStartMessage = () => 'Click on START to begin!'

  const changePlayer = () => {
    isPlayerOneTurn = !isPlayerOneTurn
    curPlayer = isPlayerOneTurn ? playerOne : playerTwo
    screenController.updateResultBox(getTurnMessage(), false)
  }

  const endGame = () => {
    winner = curPlayer
    screenController.updateResultBox(
      result === 'DRAW' ? getDrawMessage() : getWinningMessage(),
      true
    )
  }

  const playMove = number => {
    if (!gameboard.isCellMarked(number) && !winner && hasGameStarted) {
      gameboard.mark(number, curPlayer)

      const currentBoard = gameboard.toArray()
      screenController.updateGameboard(currentBoard)

      result = isGameOver(currentBoard)
      if (result) {
        endGame()
        screenController.showGameboardCover(true)
        return
      }

      changePlayer()
    }
  }

  function isGameOver (board) {
    return (
      (board[1] && board[0] === board[1] && board[1] === board[2]) ||
      (board[4] && board[3] === board[4] && board[4] === board[5]) ||
      (board[7] && board[6] === board[7] && board[8] === board[7]) ||
      (board[4] && board[0] === board[4] && board[8] === board[4]) ||
      (board[4] && board[2] === board[4] && board[6] === board[4]) ||
      (board[3] && board[0] === board[3] && board[6] === board[3]) ||
      (board[4] && board[1] === board[4] && board[7] === board[4]) ||
      (board[5] && board[2] === board[5] && board[8] === board[5]) ||
      (board.reduce((a, b) => a && b, true) && 'DRAW')
    )
  }

  function run () {
    screenController.updateResultBox(getStartMessage(), false)
    screenController.initializeElements()
    screenController.showGameboardCover(true)
  }

  function startGame (playerOneName, playerTwoName) {
    reset()
    // create new players
    playerOne = playerFactory(playerOneName, 'X')
    playerTwo = playerFactory(playerTwoName, 'O')

    screenController.showGameboardCover(false)
    screenController.updateResultBox(getTurnMessage(), false)
  }

  function reset () {
    gameboard.reset()
    screenController.updateGameboard(gameboard.toArray(), false)
    formController.resetFormInputs()
    
    hasGameStarted = true
    curPlayer = playerOne
    isPlayerOneTurn = true
    winner = ''
  }

  return { playMove, startGame, run }
})()

const screenController = (() => {
  const resultBox = document.querySelector('.result-box')
  const board = document.querySelector('.gameboard')
  const startButton = document.querySelector('.start-button')
  const gameboardCover = document.querySelector('.gameboard-disable')

  const showGameboardCover = force => {
    gameboardCover.style.display = force ? 'flex' : 'none'
  }

  const initializeElements = () => {
    for (let i = 0; i < 9; i++) {
      const grid = document.createElement('div')
      grid.className = 'grid'
      grid.addEventListener('click', () => {
        gameController.playMove(i)
      })
      board.append(grid)
    }
    startButton.addEventListener('click', () => {
      formController.showForm(true)
    })
  }

  const updateGameboard = board => {
    for (let i = 0; i < 9; i++) {
      const grid = document.querySelector(`.grid:nth-child(${i + 1})`)
      if (board[i] === 'O') {
        grid.innerHTML = '<i class="fa-solid fa-o"></i>'
        continue
      }

      if (board[i] === 'X') {
        grid.innerHTML = '<i class="fa-solid fa-x"></i>'
        continue
      }

      grid.innerHTML = ''
    }
  }

  const updateResultBox = function (message, isGameOver) {
    // reset the class list upon every update
    resultBox.className = 'result-box'

    resultBox.innerHTML = message
    if (isGameOver) {
      resultBox.classList.add('flash')
    }
  }

  return {
    initializeElements,
    updateGameboard,
    updateResultBox,
    showGameboardCover
  }
})()

const formController = (() => {
  const form = document.querySelector('#player-name-form')
  const playerOneName = document.getElementById('player-one-name')
  const playerTwoName = document.getElementById('player-two-name')

  const handleFormSubmit = e => {
    e.preventDefault()
    showForm(false)
    gameController.startGame(playerOneName.value, playerTwoName.value)
  }

  form.addEventListener('submit', e => handleFormSubmit(e))

  const showForm = force => {
    form.style.display = force ? 'flex' : 'none'
  }

  const resetFormInputs = () => {
    playerOneName.value = 'Player 1'
    playerTwoName.value = 'Player 2'
  }

  return { showForm, resetFormInputs }
})()

gameController.run()
