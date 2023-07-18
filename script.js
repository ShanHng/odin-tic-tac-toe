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

  const changePlayer = () => {
    isPlayerOneTurn = !isPlayerOneTurn
  }

  const playMove = number => {
    if (!gameboard.isCellMarked(number)) {
      gameboard.mark(number, isPlayerOneTurn ? playerOne : playerTwo)
      changePlayer()
    }
  }

  return { playMove }
})()

const screenController = (() => {
  const turnIndicator = document.querySelector('.turn-indicator')
  const resultBox = document.querySelector('.result-box')
  const board = document.querySelector('.gameboard')

  // initialize board with grids
  const initializeBoard = () => {
    for (let i = 0; i < 9; i++) {
      const grid = document.createElement('div')
      grid.className = 'grid'
      grid.addEventListener('click', () => {
        gameController.playMove(i)
        // console.log(gameboard.toArray())
        updateGameboard()
      })
      board.append(grid)
    }
  }

  const updateGameboard = () => {
    const currentBoard = gameboard.toArray()
    for (let i = 0; i < 9; i++) {
      const grid = document.querySelector(`.grid:nth-child(${i + 1})`)
      if (currentBoard[i] === 'O') {
        grid.innerHTML = '<i class="fa-solid fa-o"></i>'
        continue
      }

      if (currentBoard[i] === 'X') {
        grid.innerHTML = '<i class="fa-solid fa-x"></i>'
        continue
      }
    }
  }

  return { initializeBoard, updateGameboard }
})()

screenController.initializeBoard()
// screenController.updateGameboard(['X', 'X', 'O', '', '', '', '', '', ''])
