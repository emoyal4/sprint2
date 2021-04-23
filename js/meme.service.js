'use strict'

var gSavedMemes = []

const STORAGE_KEY = 'savedMemes'

function loadMemes() {
    var memes = getMemesFromStorage()
    if (!memes) return
    gSavedMemes = memes
    return gSavedMemes
}

function getMemesFromStorage() {
    var memes = loadFromStorage(STORAGE_KEY)
    return memes
}

function saveMemesToStorage(memes) {
    addToStorage(STORAGE_KEY, memes)
}

function saveMeme(imgContent) {
    var meme = getMeme()
    meme.imgContent = imgContent
    gSavedMemes.push(meme)
    saveMemesToStorage(gSavedMemes)
}

function removeMeme(imgContent) {
    var memes = getMemesFromStorage()
    var memeIdx = memes.findIndex(function (meme) {
        return meme.imgContent === imgContent
    })
    memes.splice(memeIdx, 1)
    gSavedMemes = memes
    saveMemesToStorage(gSavedMemes)
}

function getMemeByImg(imgContent){
    var memes = getMemesFromStorage()
    return memes.find(function (meme) {
        return meme.imgContent === imgContent
    })
}