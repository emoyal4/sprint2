'use strict'

function uploadImg(elForm, ev) {
    ev.preventDefault();
    document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg");
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
        <div class="share-confirm-modal flex"> 
        <h3 data-trans="share-confirm">Are you sure you wish to share this meme?</h3>
        <div class="modal-btn-area flex"> 
        <a class="btn confirm-modal-btn" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'), closeModal() ; return false;" data-trans="share-ok">
        Confirm
        </a>
        <a class="close-modal-btn" onclick="closeModal()" data-trans="share-close">
        Close
        </a>
        </div>
        </div>`
        doTrans()
    }
    let inputVal = elForm.querySelector('input').value
    doUploadImg(elForm, onSuccess, inputVal);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('//ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
    .then(function (res) {
        return res.text()
    })
    .then(onSuccess)
    .catch(function (err) {
        console.error(err)
    })
}




