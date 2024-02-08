'use strict'

const MINE = '💣'
const FLAG = '🚩'

var gBoard

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gToggleFlag = false

function onInit() {
    // gGame.isOn = true
    gBoard = createBoard()
    // setMinesAtRandom(gBoard)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    checkGameOver(gBoard)
}

function createBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = createCell()
        }
    }
    board[0][0].isMine = true
    // board[2][2].isMine = true
    console.log(board)
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
            strHTML += `<td class="cell ${cellClass}" ${cellData} onclick="onCellClick(this, ${i}, ${j}); checkGameOver(${i}, ${j}); expandShown(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j})">${cellContent}</td>`
        }
        strHTML += '</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function checkGameOver(i, j) {
    const currCell = gBoard[i][j]
    if (currCell.isMine) {
        return gameOver()
    }
    if (gGame.markedCount === gLevel.MINES && gGame.shownCount === (gLevel.SIZE ** 2) - gLevel.MINES) {
        var elModal = document.querySelector('.modal')
        var elUserMsg = document.querySelector('.user-msg')
        elUserMsg.innerText = 'You Win! \n😁'
        elModal.classList.remove('hide')
    } else {
        console.log('Keep playing')
    }
}

function gameOver() {
    const elModal = document.querySelector('.modal')
    var elUserMsg = document.querySelector('.user-msg')
    elUserMsg.innerText = 'You Lose \n🥲'
    elModal.classList.remove('hide')
}

function restart() {
    const elModal = document.querySelector('.modal')
    elModal.classList.add('hide')
    // const elFlagBtn = document.querySelector('.flag-btn')
    // elFlagBtn.classList.remove('clicked-flag')
    onInit()
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = getNegsMineCount(i, j, gBoard)
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

function expandShown(board, elCell, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (!currCell.isMine && !currCell.isShown) {
                currCell.isShown = true
                gGame.shownCount++
                
            }
        }
    }
}

function onCellClick(elCell, i, j) {
    var currCell = gBoard[i][j]
    if (!currCell.isShown) {
        currCell.isShown = true
        gGame.shownCount++
        console.log('gGame.shownCount', gGame.shownCount)
        elCell.innerText = currCell.isMine ? MINE : currCell.minesAroundCount
    }
    if (currCell.minesAroundCount === 0) {
        expandShown(gBoard, i, j)
    }
    if (currCell.isMine) {
        elCell.style.backgroundColor = 'red'
    }
}

function onCellMarked(elCell, i, j) {

    if (!gToggleFlag) return

    event.preventDefault()
    const cell = gBoard[i][j]
    const numOfFlags = gLevel.MINES
    console.log(elCell)

    if (!cell.isMarked && gGame.markedCount > numOfFlags - 1) {
        return
    }
    if (!cell.isMarked) {
        gGame.markedCount++
        console.log('gGame.markedCount', gGame.markedCount)
        elCell.innerText = '🚩'

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

