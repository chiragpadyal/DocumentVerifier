import { app, BrowserWindow, Menu, screen, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { GraphDFS } from './graph';
import { Database } from './database';
import { File } from './file';
import { Aadhar } from './aadhar';
import { Input } from './input';
import { Ref } from './ref';
import { Store } from './store';

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some((val) => val === '--serve');

function createWindow(): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;

  const store = new Store({
    // We'll call our data file 'user-preferences'
    configName: 'workflow-data',
    defaults: {},
  });

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
  app.whenReady().then(() => {
    // Hide the default menu
    Menu.setApplicationMenu(null);
  });

  ipcMain.on('store-data', (event, data) => {
    console.log('value is:');
    console.log(data.value);
    store.set(data.key, data.value);
  });

  ipcMain.on('get-all', (event, data) => {
    const dataFromDB = store.getAll();
    event.sender.send('get-all', dataFromDB);
  });

  ipcMain.on('get-store-data', (event, data) => {
    const dataFromDB = store.get(data);
    event.sender.send('get-store-data', dataFromDB);
  });

  ipcMain.on('my-message', (event, data) => {
    let nodes = data.nodes;
    let edges = data.edges;
    // console.log(nodes, edges);
    let dfs = new GraphDFS(nodes, edges);
    // console.log(dfs);

    let pathsStartingFrom1 = dfs.findAllPathsStartingFromNode('1');
    // console.log(pathsStartingFrom1);

    let allNodeResult = {};
    Promise.all(
      pathsStartingFrom1.map(async (element) => {
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
              event.sender.send('my-message', `complete`, node.id, result);
            } catch (err) {
              event.sender.send('my-message', `failed`, node.id, '');

              throw new Error(err);
            }
          }

          if (node.label === 'file') {
            // console.log('file run started');
            let prevNode = nodes.find((n) => n.id === element[index - 1]);
            // console.log(prevNode);
            // console.log(allNodeResult[prevNode.id]);
            try {
              let fileSource = new File(node, allNodeResult[prevNode.id]);
              let result = await fileSource.openFile();
              allNodeResult[node.id] = result;
              event.sender.send('my-message', `complete`, node.id, result);
            } catch (e) {
              event.sender.send('my-message', `failed`, node.id, '');
            }
          }

          if (node.label === 'aadhar') {
            let prevNode = nodes.find((n) => n.id === element[index - 1]);

            let aadhar = new Aadhar(node, allNodeResult[prevNode.id]);
            try {
              let result = await aadhar.aadharScan();
              allNodeResult[node.id] = result;
              // console.log(result);
              event.sender.send('my-message', `complete`, node.id, result);
            } catch (e) {
              event.sender.send('my-message', `failed`, node.id, '');
            }
          }

          if (node.label === 'input') {
            let prevNode = nodes.find((n) => n.id === element[index - 1]);
            let input = new Input(node, allNodeResult[prevNode.id]);
            try {
              let result = input.getInput();
              allNodeResult[node.id] = result;
              event.sender.send('my-message', `complete`, node.id, result);
            } catch (e) {
              event.sender.send('my-message', `failed`, node.id, '');
            }
          }

          if (node.label === 'ref') {
            let prevNode = nodes.find((n) => n.id === element[index - 1]);
            // console.log(prevNode);
            let finalArr = [];
            allNodeResult[prevNode.id].forEach((element) => {
              let input = new Ref(node, element);
              try {
                let result = input.getRef();
                console.log(result);
                let final = {};
                if (result.labelName === 'First Name Reference:') {
                  final['firstName'] = input.checkIsInclude(
                    result.paragraph,
                    allNodeResult[result.toNode]
                  );
                } else if (result.labelName === 'Middle Name Reference:') {
                  final['middleName'] = input.checkIsInclude(
                    result.paragraph,
                    allNodeResult[result.toNode]
                  );
                } else if (result.labelName === 'Last Name Reference:') {
                  final['lastName'] = input.checkIsInclude(
                    result.paragraph,
                    allNodeResult[result.toNode]
                  );
                } else if (result.labelName === 'DOB Reference:') {
                  console.log(result.labelName);
                  console.log(allNodeResult[result.toNode]);
                  const date = new Date(allNodeResult[result.toNode]);
                  const dateStr = `${date.getDate()}/${
                    date.getMonth() + 1
                  }/${date.getFullYear()}`;
                  console.log(`DOB: ${result} and ${dateStr}`);
                  console.log(`DOB: ${result.dob} and ${dateStr}`);
                  final['dob'] = input.checkRef(result.dob, dateStr);
                } else if (result.labelName === 'Aadhar Reference:') {
                  final['aadhar'] = input.checkIsInclude(
                    result.paragraph,
                    allNodeResult[result.toNode]
                  );
                } else {
                  console.log('out of order');
                }
                console.log(final);
                finalArr.push(final);
              } catch (e) {
                console.log(e);
              }
            });
            allNodeResult[node.id] = finalArr;
            event.sender.send('my-message', `complete`, node.id, finalArr);
          }
        }
      })
    )
      .then((results) => {
        // handle results
      })
      .catch((error) => {
        // handle errors
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

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
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
