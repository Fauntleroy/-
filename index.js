const { app, BrowserWindow, ipcMain, Menu, Tray } = require('electron');
const _ = require('lodash');
const moment = require('moment');
require('moment-timezone');
const ElectronConfig = require('electron-config');
const trayClockConfig = new ElectronConfig({
  defaults: {
    format: 'ddd h:mm A',
    timezone: 'Asia/Seoul',
    language: 'ko'
  }
});

let settingsWindow;

ipcMain.on('settings-ready', (event) => {
  event.sender.send('settings', trayClockConfig.store);
});

ipcMain.on('settings-update', (event, newSettings) => {
  trayClockConfig.set(newSettings);
});

let tray;

const openSettingsWindow = function () {
  if (settingsWindow) {
    settingsWindow.show();
    return;
  }

  settingsWindow = new BrowserWindow({
    resizable: false,
    useContentSize: true
  });
  settingsWindow.on('close', () => {
    settingsWindow = null;
  });
  settingsWindow.loadURL(`file://${__dirname}/settings.html`);
};

const renderClock = function () {
  moment.locale(trayClockConfig.get('language'));
  const timeString = moment().tz(trayClockConfig.get('timezone')).format(trayClockConfig.get('format'));
  tray.setTitle(` ${timeString}`);
};

const initializeClock = function () {
  renderClock();
  setInterval(renderClock, 1000);
};

const contextMenu = Menu.buildFromTemplate([
  {
    label: 'Settings',
    click: openSettingsWindow
  },
  {
    type: 'separator'
  },
  {
    label: 'Quit',
    click: () => app.quit()
  }
]);

app.on('ready', () => {
  tray = new Tray('./trayTemplate.png');
  tray.setContextMenu(contextMenu);
  initializeClock();
});

app.on('window-all-closed', () => {});
