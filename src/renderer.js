// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
;(async () => {
  var isReady = false

  window.addEventListener('DOMContentLoaded', () => {
    outputcontent = document.getElementById('interpreter-output')
    submitbutton = document.getElementById('prompt-submit')
    input = document.getElementById('prompt-input')

    // event listener for enter key when input is focused and submit button is not disabled
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !submitbutton.disabled) {
        submitbutton.click()
      }
    })

    submitbutton.addEventListener('click', () => {
    // send input to python
    // at the begining of the message add 'user-input' so we can tell the difference between user input and other output
    window.postMessage('user-input ' + input.value, '*')
    // window.postMessage('command', '*')
    // clear input
    addInput(input.value)
    input.value = ''
    // add output
    
  })
  })

  

  var output

  function addOutput(message) {
    outputcontent.innerHTML += `<div class='bot'>${message}</div>`
  }

  function  addInput(message) {
    outputcontent.innerHTML += `<div class='user'>${message}</div>`
  }

  window.addEventListener('message', (event) => {
    if (event.data.startsWith('bot-stdout')) {
      // remove 'bot-stdout' from the beginning of the message
      const message = event.data.replace('bot-stdout', '')
      // add output
      if (message === '') {
        console.log('empty string')
        return
      }
      addOutput(message)
    }
    if (event.data !== 'ready') {
      // check type of event.data
      if (typeof event.data === 'string') {
        console.log('string')
        console.log("sent event data: ",event.data)
      } else if (typeof event.data === 'object') {
        console.log('object')
        const textDecoder = new TextDecoder('utf-8');
      const decodedData = textDecoder.decode(event.data);
      output = decodedData
      console.log("sent event data: ",decodedData)
      } else {
        console.log('other')
        console.log("other event data: ",event.data)
      }
    }
  })
})()
