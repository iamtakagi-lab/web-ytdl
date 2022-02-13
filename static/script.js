const urlInput = document.getElementById('url')
const downloadButton = document.getElementById('download')
downloadButton.addEventListener('click', () => {
  window.open(`https://web-ytdl.iamtakagi.net/download?url=${urlInput.value}`)
})