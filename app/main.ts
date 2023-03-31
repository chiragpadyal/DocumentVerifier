import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { GraphDFS } from './graph';
import { Database } from './database';
import { File } from './file';

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some((val) => val === '--serve');

function createWindow(): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false, // false if you want to run e2e test with Spectron
    },
  });
  ipcMain.on('my-message', (event, data) => {
    let nodes = data.nodes;
    let edges = data.edges;
    let dfs = new GraphDFS(nodes, edges);
    let pathsStartingFrom1 = dfs.findAllPathsStartingFromNode('1');
    let allNodeResult = {};
    pathsStartingFrom1.forEach(async (element) => {
      for (let index = 1; index < element.length; index++) {
        let node = nodes.find((n) => n.id === element[index]);
        if (allNodeResult[node.id] in allNodeResult) {
          // check if previous the node is traversed
          continue;
        }

        if (node.label === 'database') {
          let database = new Database(node);
          try {
            let result = await database.mysqlDB();
            allNodeResult[node.id] = result;
            event.sender.send('my-message', `complete`, node.id);
          } catch (err) {
            event.sender.send('my-message', `failed`, node.id);

            throw new Error(err);
          }
        }

        if (node.label === 'file') {
          // console.log('file run started');
          let prevNode = nodes.find((n) => n.id === element[index - 1]);
          // console.log(prevNode);
          // console.log(allNodeResult[prevNode.id]);
          let fileSource = new File(node, allNodeResult[prevNode.id]);
          let result = await fileSource.openFile();
          allNodeResult[node.id] = result;
          event.sender.send('my-message', `complete`, node.id);
        }

        if (node.label === 'aadhar') {
          let prevNode = nodes.find((n) => n.id === element[index - 1]);
          console.log(`aadhar value: ${allNodeResult[prevNode.id]}`);
          event.sender.send('my-message', `complete`, node.id);
        }
      }
    });

    // console.log(pathsStartingFrom1);
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}
