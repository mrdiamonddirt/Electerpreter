// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge } = require('electron')
const { electronAPI } = require('@electron-toolkit/preload')
const {spawn} = require('node:child_process')
const { create } = require('domain');
const { decode } = require('node:punycode');

// Set the PYTHONIOENCODING environment variable to UTF-8
process.env.PYTHONIOENCODING = 'UTF-8';

function createOpenInterpreterProcess() {
  const createProcess = spawn('interpreter', ['--model', 'azure/gpt-35-turbo', '--context_window', '2042'],{
    shell: true,
    stdio: ['pipe', 'pipe', 'pipe'],
    env: process.env,
    // cwd: process.cwd(),
    // windowsHide: true,
    detached: false,

  })

  createProcess.stdout.on('data', (data) => {
    // log the data
    console.log(`stdout: ${data}`)
    // send message to renderer
    // add the word 'bot-stdount' to the beginning of the message so we can tell the difference between bot output and other output
    window.postMessage('bot-stdout' + data, '*')
  })
  createProcess.stderr.on('data', (data) => {
    data = data.toString()
    console.error(`stderr: ${data}`)
    if (data.includes('Downloading')) {
      // get numbers before %
      const percent = data.match(/\d+(?=%)/)[0]
      console.log(percent)
      window.postMessage('Downloading', '*')
    }
  })

  // get anything being piped out of the process
  createProcess.stdio[1].on('data', (data) => {
    console.log(`stdio[1]: ${data}`)
  })

  // get anything being piped into the process
  createProcess.stdio[0].on('data', (data) => {
    console.log(`stdio[0]: ${data}`)
  })

  createProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
  })
  createProcess.on('error', (err) => {
    console.error(err)
  })
  
  // send messages to the process
  window.addEventListener('message', (event) => {
    if (event.source === window) {
      if (event.data !== 'ready' && event.data !== 'command' && event.data !== 'Downloading') {
        // and event.data doesnt degin with 'bot-stdout'
        if (event.data.startsWith('bot-stdout')) {
          if (event.data.includes('Would you like to run this code? (y/n)')) {
            console.log('we have some code to run')
            // just run it *test*
            // createProcess.stdio[1].write('y')
          }
          // send message to renderer
          // window.postMessage('bot-stdout' + event.data, '*')
        }
        if (event.data.startsWith('user-input')) {
          // remove 'user-input' from the beginning of the message
          const message = event.data.replace('user-input', '')
          createProcess.stdio[0].write(event.data + '\n')
          // add output
          // addOutput(message)
        }
        // decodedData = new TextDecoder('utf-8').decode(event.data)
        // console.log("sent decoded data: ", decodedData)
      }
    }
  })
}

createOpenInterpreterProcess()


// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // window.electron = electronAPI
  window.api = api
}
