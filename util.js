'use strict'
// var gBoard = createBoard()  //create gBoard globally and add into onInit()
// console.table(gBoard)

function createBoard() {
    var board = []
    for (var i = 0; i < 3; i++) {
        board[i] = []
        for (var j = 0; j < 3; j++) {
            board[i][j] = (Math.random() > 0.7) ? BOMB : EMPTY
        }
    }
    return board
}

{/* <body onload="onInit()">
    <table>
        <tbody class="board"></tbody>
    </table> */}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var cellClass = (board[i][j]) ? 'taken' : ''
            var cellData = 'data-i="' + i + '" data-j="' + j + '"'
            strHTML += `
    <td class="cell ${cellClass}" ${cellData} onclick="onCellClick(${i}, ${j})">
        ${currCell}
    </td>
    `
        }
        strHTML += '</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

//Neighbors Loop
function countMinesAround(board, rowIdx, colIdx) {
    var minesCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell === MINE) minesCount++
        }
    }
    return minesCount
}

function sumRow(mat, rowIdx) {
    var sum = 0
    for (var i = 0; i < mat.length; i++) {
        var currNum = mat[rowIdx][i]
        sum += currNum
    }
    return sum
}

function sumCol(mat, colIdx) {
    var sum = 0
    for (var i = 0; i < mat.length; i++) {
        var currNum = mat[i][colIdx]
        sum += currNum
    }
    return sum
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}



function createCell() {
    return {
        minesAroundCount: 0,
        isShown: false,
        isMine: (Math.random() > 0.2) ? false : true,
        isMarked: false
    }
}