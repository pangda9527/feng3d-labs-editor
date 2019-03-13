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
    shell.showItemInFolder(fullPath);
}

/**
 * 打开开发者工具
 */
function openDevTools()
{
    ipcRenderer.send(`openDevTools`);
}

/**
 * 使用 VSCode 打开项目（文件）
 * 
 * @param {string} projectPath 项目（文件）路径
 */
function openWithVSCode(projectPath, callback)
{
    process.exec(`code "${projectPath}"`, function (error, stdout, stderr)
    {
        if (error !== null)
        {
            console.log('exec error: ' + error);
        }
        console.log(stdout)
        console.log(stderr)
        callback(error);
    });
}


exports.selectDirectoryDialog = selectDirectoryDialog;
exports.showFileInExplorer = showFileInExplorer;
exports.openWithVSCode = openWithVSCode;
exports.openDevTools = openDevTools;