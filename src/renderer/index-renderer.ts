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

        constructor() {
            this.m_btnBrowseGdiSrc = document.getElementById("btn-browseGdiSrc") as HTMLButtonElement;
            this.m_txtGdiSrcFilePath = document.getElementById("txt-gdiSrcFilePath") as HTMLInputElement;
            this._initEvtBindingBtnBrowseGdiSrc();
            this.m_btnBrowseGdiDstDir = document.getElementById("btn-browseGdiDstDir") as HTMLButtonElement;
            this.m_txtGdiDstDir = document.getElementById("txt-gdiDstDir") as HTMLInputElement;
            this._initEvtBindingBtnBrowseGdiDst();
            this.m_btnStartJobSingle = document.getElementById("btn-startJob-single") as HTMLButtonElement;
            this._initEvtBindingBtnStartJobSingle();
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

                    // DONE: Post path data to main process and start the conversion job.
                    if (ipcRenderer) {
                        ipcRenderer.send('startJob-single', this.getInputBoxGdiSrcFilePath(), this.getInputBoxGdiDstDir());
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
    }

    // Instantiate the renderer class
    let indexRenderer = new IndexRenderer();
}

// console.log("index-render execution finished!");
