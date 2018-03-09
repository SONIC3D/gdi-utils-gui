/**
 * index-render.ts
 * Created on 2018/Mar/2
 *
 * Author:
 *      "SONIC3D <sonic3d@gmail.com>"
 *
 * Copyright (c) 2018 "SONIC3D <sonic3d@gmail.com>"
 */

import * as electron from "electron";

module appRenderer {
    class IndexRenderer {
        protected static s_ipcRenderer = electron.ipcRenderer;
        protected static s_remote = electron.remote;
        protected static s_dialog = IndexRenderer.s_remote.dialog;

        protected m_btnBrowseGdiSrc: HTMLButtonElement;
        protected m_txtGdiSrcFilePath: HTMLInputElement;
        protected m_btnBrowseGdiDstDir: HTMLButtonElement;
        protected m_txtGdiDstDir: HTMLInputElement;
        protected m_btnStartJobSingle: HTMLButtonElement;
        protected m_txtareaLogMain: HTMLTextAreaElement;
        protected m_btnLogClear: HTMLButtonElement;

        constructor() {
            this.m_btnBrowseGdiSrc = document.getElementById("btn-browseGdiSrc") as HTMLButtonElement;
            this.m_txtGdiSrcFilePath = document.getElementById("txt-gdiSrcFilePath") as HTMLInputElement;
            this._initEvtBindingBtnBrowseGdiSrc();
            this.m_btnBrowseGdiDstDir = document.getElementById("btn-browseGdiDstDir") as HTMLButtonElement;
            this.m_txtGdiDstDir = document.getElementById("txt-gdiDstDir") as HTMLInputElement;
            this._initEvtBindingBtnBrowseGdiDst();
            this.m_btnStartJobSingle = document.getElementById("btn-startJob-single") as HTMLButtonElement;
            this._initEvtBindingBtnStartJobSingle();
            this._initEvtForIpc_CompleteJobSingle();
            this.m_btnLogClear = document.getElementById("btn-logClear") as HTMLButtonElement;
            this._initEvtBindingBtnLogClear();
            this.m_txtareaLogMain = document.getElementById("txtarea-logMain") as HTMLTextAreaElement;
            this._initEvtForIpc_LogAddLine();
        }

        private _initEvtBindingBtnBrowseGdiSrc(): void {
            let dialog = IndexRenderer.s_dialog;
            let btnTarget = this.m_btnBrowseGdiSrc;

            if (btnTarget) {
                btnTarget.addEventListener("click", (evt: Event) => {
                    console.log(`Button ${btnTarget.id} event ${evt.type} occurred.`);
                    dialog.showOpenDialog({
                        properties: ["openFile", "showHiddenFiles"]
                    }, (filePaths: string[]) => {
                        if ((filePaths) && (filePaths.length > 0)) {
                            console.log(`FilePaths from OpenDialog: ${filePaths}`);
                            this.setInputBoxGdiSrcFilePath(filePaths[0]);
                        }
                    });
                });
            }
        }

        private _initEvtBindingBtnBrowseGdiDst(): void {
            let dialog = IndexRenderer.s_dialog;
            let btnTarget = this.m_btnBrowseGdiDstDir;

            if (btnTarget) {
                btnTarget.addEventListener("click", (evt: Event) => {
                    console.log(`Button ${btnTarget.id} event ${evt.type} occurred.`);
                    dialog.showOpenDialog({
                        properties: ["openDirectory", "createDirectory", "promptToCreate"]
                    }, (filePaths: string[]) => {
                        if ((filePaths) && (filePaths.length > 0)) {
                            console.log(`FilePaths from OpenDialog: ${filePaths}`);
                            this.setInputBoxGdiDstDir(filePaths[0]);
                        }
                    });
                });
            }
        }

        private _initEvtBindingBtnStartJobSingle(): void {
            let ipcRenderer = IndexRenderer.s_ipcRenderer;
            let btnTarget = this.m_btnStartJobSingle;

            if (btnTarget) {
                btnTarget.addEventListener("click", (evt: Event) => {
                    console.log(`Button ${btnTarget.id} event ${evt.type} occurred.`);

                    btnTarget.disabled = true;

                    // DONE: Post path data to main process and start the conversion job.
                    if (ipcRenderer) {
                        ipcRenderer.send('startJob-single', this.getInputBoxGdiSrcFilePath(), this.getInputBoxGdiDstDir());
                    }
                });
            }
        }

        private _initEvtForIpc_CompleteJobSingle(): void {
            let ipcRenderer = IndexRenderer.s_ipcRenderer;

            if (ipcRenderer) {
                ipcRenderer.on('completeJob-single', (evt: electron.Event, ...argv: any[]) => {
                    let argc: number = argv.length;
                    console.log(`ipcRender on event log-addLine-Error, argc: ${argv.length}, args: ${argv}`);

                    let btnTarget = this.m_btnStartJobSingle;

                    if (btnTarget) {
                        btnTarget.disabled = false;
                    }
                });
            }
        }

        private _initEvtBindingBtnLogClear(): void {
            let btnTarget = this.m_btnLogClear;

            if (btnTarget) {
                btnTarget.addEventListener("click", (evt: Event) => {
                    console.log(`Button ${btnTarget.id} event ${evt.type} occurred.`);
                    this.logClear();
                });
            }
        }

        private _initEvtForIpc_LogAddLine(): void {
            let ipcRenderer = IndexRenderer.s_ipcRenderer;

            if (ipcRenderer) {
                ipcRenderer.on('log-addLine-Error', (evt: electron.Event, ...argv: any[]) => {
                    let argc: number = argv.length;
                    console.log(`ipcRender on event log-addLine-Error, argc: ${argv.length}, args: ${argv}`);

                    if (argc > 0) {
                        this.logAddLine(argv[0]);
                    }
                });
            }
        }

        protected getInputBoxGdiSrcFilePath(): string {
            let ret: string = "{failed to get}";
            let txtBox = this.m_txtGdiSrcFilePath;
            if (txtBox) {
                ret = txtBox.value;
            }
            return ret;
        }

        protected setInputBoxGdiSrcFilePath(filePath: string): void {
            let txtBox = this.m_txtGdiSrcFilePath;
            if (txtBox) {
                txtBox.value = filePath;
            }
        }

        protected getInputBoxGdiDstDir(): string {
            let ret: string = "{failed to get}";
            let txtBox = this.m_txtGdiDstDir;
            if (txtBox) {
                ret = txtBox.value;
            }
            return ret;
        }

        protected setInputBoxGdiDstDir(filePath: string): void {
            let txtBox = this.m_txtGdiDstDir;
            if (txtBox) {
                txtBox.value = filePath;
            }
        }

        protected logClear(): void {
            if (this.m_txtareaLogMain) {
                this.m_txtareaLogMain.value = "";
            }
        }

        protected logAddLine(msg: string): void {
            if (this.m_txtareaLogMain) {
                this.m_txtareaLogMain.value = `${this.m_txtareaLogMain.value}${msg}\n`;
            }
        }
    }

    // Instantiate the renderer class
    let indexRenderer = new IndexRenderer();
}

// console.log("index-render execution finished!");
