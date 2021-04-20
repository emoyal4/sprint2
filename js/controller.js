'use strict'

var gCanvas
var gCtx

function init() {
    renderImgs()
    renderMemes()
    renderKeywords()
}

function openCanvas(imgId) {
    createMeme(imgId)
    gCanvas = document.querySelector('#editor-canvas')
    gCtx = gCanvas.getContext('2d')
    openEditor()
    renderCanvas()
    selectInput()
    focusInput()
}

function renderCanvas(editMeme) {
    var meme
    if (!editMeme) {
        meme = getMeme()
    } else {
        meme = editMeme
    }
    var img = new Image()
    img.src = `img/${meme.selectedImgId}.jpg`
    img.onload = () => {
        clearCanvas()
        renderInputText()
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        meme.lines.forEach(function (line) {
            drawText(line, line.pos.x, line.pos.y)
            // drawRect()
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
    focusInput()
}

function onSwitchLine() {
    switchLine()
    renderCanvas()
    focusInput()
}

function onRemoveLine() {
    removeLine()
    renderCanvas()
    focusInput()
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

function openGallery() {
    renderImgs()
    document.querySelector('.gallery-container').style.display = "flex"
    document.querySelector('.meme-container').style.display = "none"
    document.querySelector('.editor-container').style.display = "none"
}

function openEditor() {
    document.querySelector('.gallery-container').style.display = "none"
    document.querySelector('.meme-container').style.display = "none"
    document.querySelector('.editor-container').style.display = "flex"
}

function openMeme() {
    document.querySelector('.gallery-container').style.display = "none"
    document.querySelector('.meme-container').style.display = "grid"
    document.querySelector('.editor-container').style.display = "none"
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}

function onChangeFontSize(diff) {
    changeFontSize(diff)
    renderCanvas()
}

function onSetTextAlign(alignKey) {
    setTextAlign(alignKey)
    renderCanvas()
}

function onChangeTextPosY(diff) {
    ChangeTextPosY(diff)
    renderCanvas()
}

function onChangeTextPosX(diff) {
    ChangeTextPosX(diff)
    renderCanvas()
}

function onSaveMeme(ev) {
    ev.preventDefault()
    var imgContent = gCanvas.toDataURL('image/jpeg')
    saveMeme(imgContent)
    renderMemes()
    openMeme()
}

function renderImgs(key) {
    var strHTML = getImgStrHtml(key)
    document.querySelector('.img-gallery').innerHTML = strHTML
}

function renderMemes() {
    var memes = loadMemes()
    var strHTMLs = memes.map(function (meme) {
        return `
            <div class="meme-card flex column">
                <img src="${meme.imgContent}">
                <div class="crudl-btn-container">
                    <button class="btn-crudl btn-crudl-remove" onclick="onRemoveMeme('${meme.imgContent}')"><img src="img/remove.png"></button>
                    <button class="btn-crudl btn-crudl-edit" onclick="onEditMeme('${meme.imgContent}')"><img src="img/btn-edit.png"></button>
                </div>
            </div>
        `
    })
    var strHTML = strHTMLs.join('')
    document.querySelector('.meme-container').innerHTML = strHTML
}

function focusInput() {
    var elInput = document.querySelector('.input-meme-text')
    elInput.focus()
}

function selectInput() {
    var elInput = document.querySelector('.input-meme-text')
    elInput.select()
}

function downloadImg(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}

function onRemoveMeme(imgContent) {
    removeMeme(imgContent)
    renderMemes()
}

function onEditMeme(imgContent) {
    var meme = getMemeByImg(imgContent)
    removeMeme(imgContent)
    openEditor()
    renderCanvas(meme)
    focusInput()
    selectInput()
}

function renderImgByStr(str){
    var key = str.toLowerCase()
    renderImgs(key)
}

function renderKeywords(){
    var keywordsMap = getKeywords()
    var strHTMLs = keywordsMap.map(function(keyword){
        return `
        <span style="font-size: calc(12px + ${keyword.clicks}px);" onclick="renderImgByStr('${keyword.key}') , onUpdateKeyword('${keyword.key}')">${keyword.key}</span>
        `
    })
    var strHTML = strHTMLs.join('')
    document.querySelector('.keywords-area').innerHTML = strHTML
}


function onUpdateKeyword(keyword){
    updateKeyword(keyword)
    renderKeywords()
}