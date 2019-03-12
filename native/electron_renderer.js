const { ipcRenderer } = require('electron')
const { shell } = require('electron')
const os = require('os')
var process = require('child_process');

/**
 * 选择文件夹窗口
 * 
 * @param {event:Event,path:string} callback 
 */
function selectDirectoryDialog(callback)
{
    ipcRenderer.once('selected-directory', callback);
    ipcRenderer.send('open-file-dialog');
}

/**
 * 在资源管理器中显示
 * 
 * @param {string} fullPath 完整路径
 */
function showFileInExplorer(fullPath)
{
    shell.showItemInFolder(fullPath)
}

/**
 * 使用 VSCode 打开项目
 * 
 * @param {string} projectPath 项目路径
 */
function vscodeOpenProject(projectPath)
{
    process.exec('code ' + projectPath);
}


exports.selectDirectoryDialog = selectDirectoryDialog;
exports.showFileInExplorer = showFileInExplorer;
exports.vscodeOpenProject = vscodeOpenProject;