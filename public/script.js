const urlInput = document.getElementById('url')
const downloadButton = document.getElementById('download')

downloadButton.addEventListener('click', () => {
  const url = urlInput.value
  const downloadUrl = `https://web-ytdl.iamtakagi.net/download?url=${url}`
  window.open(downloadUrl)
})