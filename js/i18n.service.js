'use strict'

let gCurrLang = 'en';

let gTrans = {
    gallery: {
        en: 'gallery',
        he: 'גלריה'
    },
    editor: {
        en: 'editor',
        he: 'עריכה'
    },
    memes: {
        en: 'memes',
        he: 'מוכנים'
    },
    title: {
        en: 'Create and share your own viral memes in minutes',
        he: 'צור ושתף מימז ויראליים  משלך תוך דקות'
    },
    'start-Now': {
        en: 'Start Now',
        he: 'התחל עכשיו'
    },
   ' meme-gallery-placeholder': {
        en: 'Save Your Memes Here!',
        he: 'המימז החדשים שלך נשמרים כאן'
    },
}


function getTrans(transKey) {
    var keyTrans = gTrans[transKey]
    if (!keyTrans) return 'UNKNOWN';
    var txt = keyTrans[gCurrLang]
    if (!txt) txt = keyTrans['en']
    return txt;
}

function doTrans() {
    var els = document.querySelectorAll('[data-trans]')
    els.forEach(el => {
        var transKey = el.dataset.trans
        var txt = getTrans(transKey)
        if (el.nodeName === 'INPUT') {
            el.setAttribute('placeholder', txt)
        } else {
            el.innerText = txt
        }
    }) 
}

function setLang(lang) {
    gCurrLang = lang;
}