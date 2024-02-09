'use strict'

const MINE = '💣'
const FLAG = '🚩'

var gBoard

var gGame


var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gToggleFlag = false

function onInit() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gBoard = createBoard()
    renderBoard(gBoard)
    setMinesAtRandom(gBoard)
    setMinesNegsCount(gBoard)
}

function createBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = createCell()
        }
    }
    //HARDCODED MINE POS
    // board[0][0].isMine = true
    // board[2][2].isMine = true
    return board
}

function createCell() {
    return {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            var cellContent = ''
            var cellClass = ''
            var cellData = 'data-i="' + i + '" data-j="' + j + '"'
            strHTML += `<td class="cell ${cellClass}" ${cellData} onclick="onCellClick(this, ${i}, ${j}); expandShown(this, ${i}, ${j}); checkIfWin(${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j})">${cellContent}</td>`
        }
        strHTML += '</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function setMinesAtRandom(board) {
    var numOfMines = gLevel.MINES
    while (numOfMines > 0) {
        const rRowIdx = getRandomInt(0, gLevel.SIZE)
        const rColIdx = getRandomInt(0, gLevel.SIZE)
        if (!board[rRowIdx][rColIdx].isMine) {
            board[rRowIdx][rColIdx].isMine = true
            numOfMines--
        }
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = getNegsMineCount(i, j, board)
        }
    }
}

function getNegsMineCount(iIdx, jIdx, board) {
    var negMinesCount = 0
    for (var i = iIdx - 1; i <= iIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = jIdx - 1; j <= jIdx + 1; j++) {
            if (i === iIdx && j === jIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) negMinesCount++
        }
    }
    return negMinesCount
}

function checkIfWin() {
    var totalCells = gLevel.SIZE ** 2
    var correctFlags = 0
    var openedCells = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine && cell.isMarked) {
                correctFlags++
            } else if (!cell.isMine && cell.isShown) {
                openedCells++
            }
        }
    }
    if (correctFlags === gLevel.MINES && openedCells === totalCells - gLevel.MINES) {
        var elModal = document.querySelector('.modal')
        var elUserMsg = document.querySelector('.user-msg')
        elUserMsg.innerText = 'You Win! \n😁'
        elModal.classList.remove('hide')
    }
}

function gameOver() {
    const elModal = document.querySelector('.modal')
    var elUserMsg = document.querySelector('.user-msg')
    elUserMsg.innerText = 'You Lose! \n🥲'
    elModal.classList.remove('hide')
}

function restart() {
    const elModal = document.querySelector('.modal')
    elModal.classList.add('hide')
    onInit()
}



function onCellClick(elCell, i, j) {
    var currCell = gBoard[i][j]
    if (!currCell.isShown) {
        currCell.isShown = true
        elCell.classList.add('clicked')
        gGame.shownCount++

        if (currCell.isMine) {
            elCell.innerText = MINE
            elCell.classList.add('clicked')
            elCell.style.backgroundColor = 'red'
            gameOver()
        } else if (currCell.minesAroundCount === 0) {
            elCell.classList.add('clicked')
            expandShown(gBoard, elCell, i, j)
        } else {
            elCell.innerText = currCell.minesAroundCount
            elCell.classList.add('clicked')
        }
    }
}

function expandShown(board, elCell, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (!currCell.isShown) {
                currCell.isShown = true
                gGame.shownCount++
                if (currCell.isMine) {
                    var elNeighborCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                    elNeighborCell.innerText = MINE
                    elNeighborCell.style.backgroundColor = 'red'
                    gameOver()
                } else if (currCell.minesAroundCount === 0) {
                    var elNeighborCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                    elNeighborCell.innerText = ''
                    elNeighborCell.classList.add('clicked')
                    expandShown(board, elNeighborCell, i, j)
                } else {
                    var elNeighborCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                    elNeighborCell.innerText = currCell.minesAroundCount
                    elNeighborCell.classList.add('clicked')
                }
            }
        }
    }
}

function onCellMarked(elCell, i, j) {

    if (!gToggleFlag) return

    event.preventDefault()
    const cell = gBoard[i][j]
    if (cell.isMarked) {
        cell.isMarked = false
        elCell.innerText = ''
        gGame.markedCount--
        checkIfWin()
    } else {
        cell.isMarked = true
        elCell.innerText = '🚩'
        gGame.markedCount++
        checkIfWin()
    }
}

function toggleFlag(elFlag) {
    gToggleFlag = !gToggleFlag
    if (gToggleFlag) {
        elFlag.classList.add('clicked-flag')
    } else {
        elFlag.classList.remove('clicked-flag')
    }
}

