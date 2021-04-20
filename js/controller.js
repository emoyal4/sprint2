'use strict'

var gCanvas
var gCtx
var gStartPos
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']


function init() {
    gCanvas = document.querySelector('#editor-canvas')
    gCtx = gCanvas.getContext('2d')
    renderImgs()
    renderMemes()
    renderKeywords()
    addListeners()
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
            drawRect()
            drowSticker()
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

function onDrowSticker(stickerId){
    setSticker(stickerId)
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
    gCtx.font = `${line.size}px ${line.font}`
    gCtx.textAlign = line.align
    gCtx.fillText(line.txt, x, y)
    gCtx.strokeText(line.txt, x, y)
}

function drawRect() {
    var currLine = getCurrLine()
    gCtx.strokeStyle = '#363636'
    gCtx.strokeRect( 5 , currLine.pos.y - currLine.size, gCanvas.width-10, currLine.size+10)
}

function drowSticker(){
    var img = new Image()
    img.src = `img/sticker-${gMeme.stickerId}.png`
    img.onload = () => {
        gCtx.drawImage(img, 100, 100, 100, 100)
    }
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

function onSetFont(font){
    setFont(font)
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

function addActive(elBtn){
    var elBtns = document.querySelectorAll('.header-btn')
    elBtns.forEach(function(elBtn){
        elBtn.classList.remove('active')
    })
   elBtn.classList.add('active')
}

function onUploadImg(img){
    alert('This function is not available now')
}


function closeModal(){
    document.querySelector('.share-container').hidden = true
}






function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    const pos = getEvPos(ev)
    var currLine = getCurrLine()
    if (!isLineClicked(pos)) return
    currLine.isDragging = true
    gStartPos = pos
    document.body.style.cursor = 'grabbing'

}

function onMove(ev) {
    var currLine = getCurrLine()
    if (currLine.isDragging) {
        const pos = getEvPos(ev)
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y

        currLine.pos.x += dx
        currLine.pos.y += dy

        gStartPos = pos
        renderCanvas()
    }
}

function onUp() {
    var currLine = getCurrLine()
    currLine.isDragging = false
    document.body.style.cursor = 'grab'
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function isLineClicked(clickedPos) {
    var currLine = getCurrLine()
    const { pos } = currLine
    const distance = Math.sqrt((pos.x - clickedPos.x) ** 2 + (pos.y - clickedPos.y) ** 2)
    return distance <= currLine.size
}