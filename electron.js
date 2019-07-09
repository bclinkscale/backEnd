import './fly' 
const electron = require('electron')
const {app, BrowserWindow} = electron ;

let mainWindow;

app2 = app.on('ready', () => {
    mainWindow = new BrowserWindow({webPreferences: {nodeIntegration: true},
    height : 600,
    width: 800 
    })
})

mainWindow.loadURL(`file://${__dirname}/localhost:3000`)

export default app2; 