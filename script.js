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
  const board = []

  // fill gameboard with cells
  for (let i = 0; i < 9; i++) {
    board.push(cellFactory())
  }

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

  return { mark, isCellMarked, toArray }
})()

const playerFactory = (playerName, playerToken) => {
  const token = playerToken
  const name = playerName

  const getToken = () => token
  const getName = () => name
  return { getToken, getName }
}

const gameController = (() => {
  const playerOne = playerFactory('Player 1', 'X')
  const playerTwo = playerFactory('Player 2', 'O')
  let isPlayerOneTurn = true
  let curPlayer = ''
  let winner = ''
  let result = ''

  const getWinningMessage = () => `${winner.getName()} has won the game!`

  const getTurnMessage = () => `${curPlayer.getName()}'s turn...`

  const getDrawMessage = () => "Game has ended. It's a draw!"

  const changePlayer = () => {
    isPlayerOneTurn = !isPlayerOneTurn
    curPlayer = isPlayerOneTurn ? playerOne : playerTwo
    screenController.updateResultBox(getTurnMessage(), false)
  }

  const playMove = number => {
    if (!gameboard.isCellMarked(number) && !winner) {
      gameboard.mark(number, curPlayer)

      const currentBoard = gameboard.toArray()
      screenController.updateGameboard(currentBoard)

      result = isGameOver(currentBoard)
      if (result) {
        winner = curPlayer
        screenController.updateResultBox(
          result === 'DRAW' ? getDrawMessage() : getWinningMessage(),
          true
        )
        return
      }

      changePlayer()
    }
  }

  // returns
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

  function start () {
    curPlayer = playerOne
    screenController.updateResultBox(getTurnMessage(), false)
    screenController.initializeBoard()
  }

  return { playMove, start }
})()

const screenController = (() => {
  const resultBox = document.querySelector('.result-box')
  const board = document.querySelector('.gameboard')

  // initialize board with grids
  const initializeBoard = () => {
    for (let i = 0; i < 9; i++) {
      const grid = document.createElement('div')
      grid.className = 'grid'
      grid.addEventListener('click', () => {
        gameController.playMove(i)
      })
      board.append(grid)
    }
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

  return { initializeBoard, updateGameboard, updateResultBox }
})()

gameController.start()
