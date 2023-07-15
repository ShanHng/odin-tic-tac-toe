// Models

const cellFactory = () => {
  const isMarked = false
  const player = ''

  // exposed functions
  const checkIfMarked = () => isMarked
  const getPlayer = () => player
  const mark = () => {
    this.isMarked = !isMarked
  }
  const setPlayer = player => {
    this.player = player
  }
  return { checkIfMarked, getPlayer, mark, setPlayer }
}

const gameboard = (() => {
  const board = []

  // fill gameboard with cells
  for (let i = 0; i < 9; i++) {
    board.push(cellFactory())
  }
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

  const start = () => {
    while (!gameboard.isOver()) {}
  }
})()

const screenController = (() => {
  const turnIndicator = document.querySelector('.turn-indicator')
  const resultBox = document.querySelector('.result-box')
  const gameboard = document.querySelector('.gameboard')

  // initialize board with grids
  const initializeBoard = () => {
    for (let i = 0; i < 9; i++) {
      const grid = document.createElement('div')
      grid.className = 'grid'
      gameboard.append(grid)
    }
  }

  const updateGameboard = (board) => {
    for (let i = 0; i < 9; i++) {
      const grid = document.querySelector(`.grid:nth-child(${i+1})`)
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

  return { initializeBoard, updateGameboard }
})()

screenController.initializeBoard()
screenController.updateGameboard(['X', 'X', 'O', '', '', '', '', '', ''])
