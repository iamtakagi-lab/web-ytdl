const urlInput = document.getElementById('url')
const downloadButton = document.getElementById('download')
downloadButton.addEventListener('click', () => {
  window.open(`http://localhost:8080/download?url=${urlInput.value}`)
})