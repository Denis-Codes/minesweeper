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

function onInit() {
    gBoard = createBoard()
    renderBoard(gBoard)
}


function createBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = createCell()
            // setMinesNegsCount(gBoard)
        }
    }

    board[0][0].isMine = true
    board[2][2].isMine = true
    console.log(board)
    
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var cellContent = currCell.isMine ? MINE : currCell.minesAroundCount
            var cellClass = (cellContent) ? '' : ''
            var cellData = 'data-i="' + i + '" data-j="' + j + '"'
            strHTML += `<td class="cell ${cellClass}" ${cellData} onclick="onCellClick(${i}, ${j})">${cellContent}</td>`
        }
        strHTML += '</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function setMinesNegsCount(board) {
    
    var minesCount = 0
    for (var i = i - 1; i <= i + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = j - 1; j <= j + 1; j++) {
            if (i === i && j === j) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell === MINE) minesCount++
            // currCell.minesAroundCount = minesCount
            // console.log(currCell.minesAroundCount)
        }
    }
//    return currCell.minesAroundCount
}


// function renderCell(location, value) {

//     const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
//     elCell.innerHTML = value
// }

function createCell() {
    return {

        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
}