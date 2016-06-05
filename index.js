const { app, BrowserWindow, Menu, Tray } = require('electron');
const moment = require('moment');
require('moment-timezone');

let tray;

const renderClock = function () {
  const timeString = moment().tz('Asia/Seoul').format('ddd h:mm A 🇰🇷');
  tray.setTitle(` ${timeString}`);
};

const initializeClock = function () {
  renderClock();
  setInterval(renderClock, 1000);
};

const contextMenu = Menu.buildFromTemplate([
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
