/**
 * index.ts
 * Created on 2018/Mar/2
 *
 * Author:
 *      "SONIC3D <sonic3d@gmail.com>"
 *
 * Copyright (c) 2017 "SONIC3D <sonic3d@gmail.com>"
 */

import * as electron from "electron";
import * as path from "path";
import * as url from "url";

module app {
    // Program Entry Class
    export class MainEntry {
        public static CONFIG__PATH__ENTRY_PAGE_FILE: string = 'res/index.html';

        protected static s_app = electron.app;
        protected static s_ipcMain = electron.ipcMain;

        public static create(): MainEntry {
            let retVal: MainEntry = new MainEntry();
            return retVal;
        }

        // Keep a global reference of the window object, if you don't, the window will
        // be closed automatically when the JavaScript object is garbage collected.
        protected m_mainWindow: Electron.BrowserWindow;

        constructor() {
            this._initEventsForAppWindow();
            this._initEventsForIpc();

            // console.log("MainEntry created!");
        }

        private _initEventsForAppWindow(): void {
            // Module to control application life.
            let electronApp = MainEntry.s_app;

            // This method will be called when Electron has finished
            // initialization and is ready to create browser windows.
            // Some APIs can only be used after this event occurs.
            electronApp.on('ready', (launchInfo: any) => {
                this.createWindow();
            });

            // Quit when all windows are closed.
            electronApp.on('window-all-closed', (launchInfo: any) => {
                // On OS X it is common for applications and their menu bar
                // to stay active until the user quits explicitly with Cmd + Q
                if (process.platform !== 'darwin') {
                    electronApp.quit()
                }
            });

            electronApp.on('activate', (launchInfo: any) => {
                // On OS X it's common to re-create a window in the app when the
                // dock icon is clicked and there are no other windows open.
                if (this.m_mainWindow === null) {
                    this.createWindow();
                }
            });
        }

        private _initEventsForIpc(): void {
            let ipcMain = MainEntry.s_ipcMain;
            if (ipcMain) {
                ipcMain.on('startJob-single', (evt: electron.Event, ...argv: any[]) => {
                    let argc: number = argv.length;
                    console.log(`ipcMain on event startJob-single, argc: ${argv.length}, args: ${argv}`);

                    if (argc != 2) {
                        // Parameters error.
                        evt.sender.send('log-addLine-Error', 'Gdi image source file path and output directory are both required.');
                    } else {
                        let srcFilePath: string = argv[0];
                        let dstDir: string = argv[1];
                        // TODO: Integrate gdi-utils lib to invoke its conversion API here with the user provided file paths.
                    }
                });
            }
        }

        protected createWindow(): void {
            // Create the browser window.
            this.m_mainWindow = new electron.BrowserWindow({width: 800, height: 600});

            // and load the index.html of the app.
            this.m_mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, MainEntry.CONFIG__PATH__ENTRY_PAGE_FILE),
                protocol: 'file:',
                slashes: true
            }));

            // Open the DevTools.
            // m_mainWindow.webContents.openDevTools()

            // Emitted when the window is closed.
            this.m_mainWindow.on('closed', () => {
                // Dereference the window object, usually you would store windows
                // in an array if your app supports multi windows, this is the time
                // when you should delete the corresponding element.
                this.m_mainWindow = null;
            });
        }
    }
}

// Program entry code
let appInstance = app.MainEntry.create();
if (!appInstance) {
    console.log("Fatal Error: Failed to create MainEntry!");
}
