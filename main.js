const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const storage = require('electron-json-storage');

let winMain;

storage.setDataPath(__dirname + '/data');
console.log('The storage path is: ' + storage.getDataPath());


function createWindow() {
    console.log('createWindow');

    winMain = new BrowserWindow({width: 1366, height: 768, frame:false});

    winMain.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    winMain.webContents.openDevTools();

    winMain.on('closed', () => {
        winMain = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('minimize-window', () => {
    winMain.minimize();
});

ipcMain.on('restore-window', () => {
    winMain.restore();
});

ipcMain.on('maximize-window', () => {
    winMain.maximize();
});

ipcMain.on('close-window', () => {
    app.quit();
});


ipcMain.on('add-user', () => {

    let login_window = new BrowserWindow({
        minWidth: 480,
        maxWidth: 480,
        minHeight: 640,
        maxHeight: 640,
        width: 480,
        height: 640,
        parent: winMain,
        frame:false});

    login_window.loadURL(url.format({
        pathname: path.join(__dirname, './html/taobao-login.html'),
        protocol: 'file:',
        slashes: true
    }));

    // login_window.openDevTools();

    let close_listener = function() {
        login_window.close();
        login_window = null;
    };

    ipcMain.on('close-taobao-login-window', close_listener);

    login_window.on('close', () => {
        winMain.webContents.send('taobao-users-update', '');
        ipcMain.removeListener('close-taobao-login-window', close_listener)
    });

});
