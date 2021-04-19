'use strict'

var gCanvas
var gCtx


function openCanvas(imgId) {
    createMeme(imgId)
    gCanvas = document.querySelector('#editor-canvas')
    gCtx = gCanvas.getContext('2d')
    renderCanvas()
    toggleCanvas()
}

function renderCanvas() {
    var meme = getMeme()
    var img = new Image()
    img.src = `img/${meme.selectedImgId}.jpg`
    img.onload = () => {
        clearCanvas()
        renderInputText()
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        meme.lines.forEach(function (line) {
            drawText(line, line.pos.x, line.pos.y)
            drawRect()
        });
    }
}

function onSetText(txt) {
    setText(txt)
    renderCanvas()
}

function onAddLine() {
    addLine()
    renderCanvas()
}

function onSwitchLine() {
    switchLine()
    renderCanvas()
}

function onRemoveLine() {
    removeLine()
    renderCanvas()
}

function renderInputText() {
    var meme = getMeme()
    document.querySelector('.input-meme-text').value = meme.lines[gMeme.selectedLineIdx].txt
}

function drawText(line, x, y) {
    gCtx.lineWidth = 3;
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = line.color
    gCtx.font = `${line.size}px Impact`
    gCtx.textAlign = line.align
    gCtx.fillText(line.txt, x, y)
    gCtx.strokeText(line.txt, x, y)
}

function drawRect() {
    var currLine = getCurrLine()
    var strLength = gCtx.measureText(currLine.txt)
    gCtx.strokeStyle = '#363636'
    gCtx.strokeRect(currLine.pos.x - (strLength.width / 2), currLine.pos.y - currLine.size, strLength.width, currLine.size)
}

function toggleCanvas() {
    var elGallery = document.querySelector('.gallery-container')
    var elEditor = document.querySelector('.editor-container')
    if (elEditor.style.display = "none") {
        elGallery.style.display = "none"
        elEditor.style.display = "flex"
    } else {
        elGallery.style.display = "flex"
        elEditor.style.display = "none"
    }
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}

function onChangeFontSize(diff){
    changeFontSize(diff)
    renderCanvas()
}

function onSetTextAlign(alignKey){
    setTextAlign(alignKey)
    renderCanvas()
}

function onChangeTextPosY(diff){
    ChangeTextPosY(diff)
    renderCanvas()
}

function onChangeTextPosX(diff){
    ChangeTextPosX(diff)
    renderCanvas()
}

function renderImgs(){
    var strHTML = getImgStrHtml()
    document.querySelector('.img-gallery').innerHTML = strHTML
}