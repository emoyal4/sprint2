'use strict'

var gMeme

function createMeme(imgId) {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'Enter your text hare',
                size: 40,
                align: 'center',
                color: 'white',
                pos: { x: 200, y: 50 }
            }
        ]
    }
    return gMeme
}

function getMeme() {
    return gMeme
}

function setText(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function getPos(idx) {
    switch (idx) {
        case 0:
            return { x: 200, y: 50 }
        case 1:
            return { x: 200, y: 350 }
        case 2:
            return { x: 200, y: 200 }
        default:
            return { x: 200, y: 200 }
    }
}

function addLine() {
    gMeme.selectedLineIdx++

    var newLine = {
        txt: 'Enter your text hare',
        size: 40,
        align: 'center',
        color: 'white',
        pos: getPos(gMeme.lines.length)
    }
    gMeme.lines.push(newLine)
}

function switchLine() {
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) {
        gMeme.selectedLineIdx = 0
    } else {
        gMeme.selectedLineIdx++
    }
}

function removeLine() {
    var currLineIdx = gMeme.selectedLineIdx
    if (gMeme.lines.length === 1) return
    gMeme.lines.splice(currLineIdx, 1)
    gMeme.selectedLineIdx = 0
}

function getCurrLine() {
    var currLineIdx = gMeme.selectedLineIdx
    return gMeme.lines[currLineIdx]
}

function changeFontSize(diff) {
    var currLine = getCurrLine()
    currLine.size += diff
}

function setTextAlign(alignKey) {
    var currLine = getCurrLine()
    currLine.align = alignKey
}

function ChangeTextPosY(diff){
    var currLine = getCurrLine()
    currLine.pos.y += diff
}

function ChangeTextPosX(diff){
    var currLine = getCurrLine()
    currLine.pos.x += diff
}




