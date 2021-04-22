'use strict'

let gCanvas
let gCtx
let gStartPos
let isPublishActive = false

const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

function init() {
    gCanvas = document.querySelector('#editor-canvas')
    gCtx = gCanvas.getContext('2d')
    renderImgs()
    renderMemes()
    renderKeywords()
    addListeners()
}

function renderImgs(key) {
    var strHTML = getImgStrHtml(key)
    document.querySelector('.img-gallery').innerHTML = strHTML
}

function renderMemes() {
    var memes = loadMemes()
    if (!memes) return

    var strHTMLs = memes.map(function (meme) {
        return `
            <div class="meme-card flex column">
                <img src="${meme.imgContent}">
                <div class="crudl-btn-container flex">
                    <button class="btn-crudl btn-crudl-remove" onclick="onRemoveMeme('${meme.imgContent}')"><img src="img/remove.png"></button>
                    <button class="btn-crudl btn-crudl-edit" onclick="onEditMeme('${meme.imgContent}')"><img src="img/btn-edit.png"></button>
                </div>
            </div>
        `
    })
    var strHTML = strHTMLs.join('')
    document.querySelector('.meme-container').innerHTML = strHTML
}

function renderKeywords() {
    var keywords = getKeywords()
    var strHTMLs = keywords.map(function (keyword) {
        return `
        <span 
        style="font-size: calc(12px + ${keyword.clicks}px);" 
        onclick="renderImgByStr('${keyword.key}'), onUpdateKeyword('${keyword.key}')">
        ${keyword.key}
        </span>
        `
    })
    var strHTML = strHTMLs.join('')
    document.querySelector('.keywords-area').innerHTML = strHTML
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
        // renderCanvas()
    })
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
    var currSticker = getCurrSticker()
    if (isLineClicked(pos)) {
        currLine.isDragging = true
        gStartPos = pos
        document.body.style.cursor = 'grabbing'
    }
    if (isStickerClicked(pos)) {
        currSticker.isDragging = true
        gStartPos = pos
        document.body.style.cursor = 'grabbing'
    }
}

function onMove(ev) {
    var dragObj
    var currLine = getCurrLine()
    var currSticker = getCurrSticker()
    if (!currLine.isDragging && !currSticker.isDragging) return
    dragObj = (currLine.isDragging) ? currLine : currSticker
    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    dragObj.pos.x += dx
    dragObj.pos.y += dy
    gStartPos = pos
    renderCanvas()
}

function onUp() {
    var currLine = getCurrLine()
    var currSticker = getCurrSticker()
    currLine.isDragging = false
    currSticker.isDragging = false
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
    var linePos = currLine.pos
    const distance = Math.sqrt((linePos.x - clickedPos.x) ** 2 + (linePos.y - clickedPos.y) ** 2)
    return distance <= currLine.size
}

function isStickerClicked(clickedPos) {
    var isClicked = true
    var currSticker = getCurrSticker()
    var stickerPos = currSticker.pos
    var distanceX = clickedPos.x - stickerPos.x
    var distanceY = clickedPos.y - stickerPos.y
    if (distanceX < 0 || distanceX > currSticker.size) isClicked = false
    if (distanceY < 0 || distanceY > currSticker.size) isClicked = false
    return isClicked
}

function openPage(pageName) {
    var galleryDisplay = 'none'
    var editorDisplay = 'none'
    var memeDisplay = 'none'
    switch (pageName) {
        case 'gallery':
            var galleryDisplay = 'flex'
            addActive(document.querySelector('.btn-gallery'))
            renderImgs()
            break;
        case 'editor':
            var editorDisplay = 'flex'
            addActive(document.querySelector('.btn-editor'))
            break;
        case 'meme':
            var memeDisplay = 'grid'
            addActive(document.querySelector('.btn-meme'))
            break;
        default:
            break;
    }
    document.querySelector('.gallery-container').style.display = galleryDisplay
    document.querySelector('.editor-container').style.display = editorDisplay
    document.querySelector('.meme-container').style.display = memeDisplay
}

function renderImgByStr(str) {
    var key = str.toLowerCase()
    renderImgs(key)
}

function onUpdateKeyword(keyword) {
    updateKeyword(keyword)
    renderKeywords()
}

function addActive(elBtn) {
    var elBtns = document.querySelectorAll('.header-btn')
    elBtns.forEach(function (elBtn) {
        elBtn.classList.remove('active')
    })
    elBtn.classList.add('active')
}

function openCanvas(imgId) {
    openPage('editor')
    resizeCanvas()
    createMeme(imgId)
    renderCanvas()
    selectInput()
    focusInput()
}

function renderCanvas() {
    var meme = getMeme()
    var img = new Image()
    var currImg = getImgById(meme.selectedImgId)
    img.src = currImg.url
    img.onload = function () {
        clearCanvas()
        setInputText()
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        meme.lines.forEach(line => {
            drawText(line, line.pos.x, line.pos.y)
            drawRect()
            drowSticker()
        });
        setPublishBtns()
        meme.isPrint = false
        isPublishActive = false
    }
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}

function setInputText() {
    var meme = getMeme()
    document.querySelector('.input-meme-text').value = meme.lines[meme.selectedLineIdx].txt
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
    var meme = getMeme()
    if (meme.isPrint) return
    var currLine = getCurrLine()
    gCtx.strokeStyle = '#363636'
    gCtx.strokeRect(5, currLine.pos.y - currLine.size, gCanvas.width - 10, currLine.size + 10)
}

function drowSticker() {
    var meme = getMeme()
    if (!meme.sticker.id) return
    const img = new Image()
    img.src = `img/sticker-${meme.sticker.id}.png`
    img.onload = () => {
        gCtx.drawImage(img, meme.sticker.pos.x, meme.sticker.pos.y, 100, 100)
    }
}

function setPublishBtns() {
    var elPublishBtns = document.querySelectorAll('.publish-btn')
    if (isPublishActive) {
        elPublishBtns.forEach(function (elPublishBtn) {
            elPublishBtn.classList.remove('inactive-btn')
        })
    } else {
        elPublishBtns.forEach(function (elPublishBtn) {
            elPublishBtn.classList.add('inactive-btn')
        })
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

function focusInput() {
    var elInput = document.querySelector('.input-meme-text')
    elInput.focus()
}

function selectInput() {
    var elInput = document.querySelector('.input-meme-text')
    elInput.select()
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

function onDrowSticker(stickerId) {
    setSticker(stickerId)
    renderCanvas()
}

function onChangeFontSize(diff) {
    changeFontSize(diff)
    renderCanvas()
}

function onSetTextAlign(alignKey) {
    setTextAlign(alignKey)
    renderCanvas()
}

function onSetFont(font) {
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
    removeRect()
    openSaveModal()
    isPublishActive = true
    setTimeout(() => {
        var imgContent = gCanvas.toDataURL('image/jpeg')
        saveMeme(imgContent)
        renderMemes()
    }, 100)
}

function removeRect() {
    var meme = getMeme()
    meme.isPrint = true
    renderCanvas(meme)
}

function onDownloadImg(elLink) {
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
    openPage('editor')
    setSavedMeme(meme)
    renderCanvas()
    focusInput()
    selectInput()
}

function onUploadImg(img) {
    alert('This function is not available now')
}

function closeModal() {
    document.querySelector('.share-container').hidden = true
}

function resizeCanvas() {
    gCanvas.style.width = '100%'
    gCanvas.style.height = '100%'
}


function openSaveModal() {
    document.querySelector('.save-modal').style.top = '0vh'
    setTimeout(() => {
        document.querySelector('.save-modal').style.top = '-7vh'
    }, 2000);
}

function onImgInput(ev) {
    loadImageFromInput(ev, onAddUserImg)
}

function loadImageFromInput(ev, onImageReady) {
    document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader()

    reader.onload = function (event) {
        var img = new Image()
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result
    }
    reader.readAsDataURL(ev.target.files[0])
}

function onAddUserImg(img) {
    const addedImg = addUserImg(img)
    createMeme(addedImg.id)
    renderCanvas()
}
