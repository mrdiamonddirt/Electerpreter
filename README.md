# Electerpreter

A minimal Electron application to run and display the output of open-interpreter
this is a work in progress and was intended to be my entry for the lablab.ai open-interpreter 24hour hackathon

link to entry here: https://lablab.ai/event/open-interpreter-hackathon/big-full-stack-gamers/electerpreter-open-interpreter-electron-app

![CoverArt](/screenshots/cover_art.png)

## Features

- Runs open-interpreter within an electron app
- Displays the output of open-interpreter
- Allows for the user to send an input to open-interpreter
- Uses Open-Interpreter to automatically execute code that the llm comes up with

## TODO

- [ ] have a spefic argument to send to open-interpreter so that it knows that we are using the electron app and not the cli may make it easier to use
- [ ] a way to change the arguments in the spawned process of open-interpreter

## Screenshots

![Screenshot](/screenshots/Screenshot_1.png)
![Screenshot](/screenshots/Screenshot_2.png)

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## Note

if you want to use this application it is currently setup to run the open-interpreter cli with the specific aruements i use for testing which are

```bash
$ open-interpreter --context_window 2042 -y
```

this can be changed on line 13 of the preload.js file, you will need to set your environment variable OPENAI_API_KEY