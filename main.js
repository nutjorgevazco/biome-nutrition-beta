const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');

process.on('uncaughtException', (error) => {
  dialog.showErrorBox("Uncaught Exception", error.stack || error.toString());
});

process.on('unhandledRejection', (error) => {
  dialog.showErrorBox("Unhandled Rejection", String(error.stack || error));
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "BiomeNutrition",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  // Ocultar barra de menú por defecto para que parezca app nativa moderna
  mainWindow.setMenuBarVisibility(false);

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:5174');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
