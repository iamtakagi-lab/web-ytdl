const urlInput = document.getElementById('url')
const downloadButton = document.getElementById('download')
const qualitySelectbox = document.getElementById("quality")

downloadButton.addEventListener('click', () => {
  const url = urlInput.value
  const quality = qualitySelectbox.value
  const downloadUrl = `https://web-ytdl.iamtakagi.net/download?url=${url}&quality=${quality}`
  window.open(downloadUrl)
})