"use strict";
const { BrowserWindow } = require("electron");

function getWindow() {
  return BrowserWindow.getFocusedWindow();
}

function sendAction(action, ...args) {
  const win = getWindow();
  if (process.platform === "darwin") {
    win.restore();
  }

  win.webContents.send(action, ...args);
}

exports.getWindow = getWindow;
exports.sendAction = sendAction;
