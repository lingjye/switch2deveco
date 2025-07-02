"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const child_process = __importStar(require("child_process"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function activate(context) {
    console.log('Cursor2DevEco extension is now active!');
    // 显示安装成功提示
    const config = vscode.workspace.getConfiguration('cursor2deveco');
    const showToasts = config.get('showToasts', true);
    if (showToasts) {
        vscode.window.showInformationMessage('Cursor2DevEco 插件已激活! 快捷键: Alt+Shift+O (打开文件), Alt+Shift+P (打开项目)', '了解更多', '设置').then(selection => {
            if (selection === '设置') {
                vscode.commands.executeCommand('workbench.action.openSettings', 'cursor2deveco');
            }
            else if (selection === '了解更多') {
                vscode.env.openExternal(vscode.Uri.parse('https://github.com/your-name/cursor2deveco'));
            }
        });
    }
    // 检查DevEco Studio是否存在
    function checkDevEcoStudio() {
        const config = vscode.workspace.getConfiguration('cursor2deveco');
        const devEcoPath = config.get('devEcoPath') || '/Applications/DevEco-Studio.app';
        if (fs.existsSync(devEcoPath)) {
            return devEcoPath;
        }
        // 尝试其他常见路径
        const commonPaths = [
            '/Applications/DevEco-Studio.app',
            '/Applications/DevEco Studio.app',
            '/opt/DevEco-Studio/bin/devecostudio.sh',
            '/usr/local/DevEco-Studio/bin/devecostudio.sh'
        ];
        for (const testPath of commonPaths) {
            if (fs.existsSync(testPath)) {
                return testPath;
            }
        }
        return null;
    }
    // 打开当前文件
    const openFileCommand = vscode.commands.registerCommand('cursor2deveco.openFile', async () => {
        console.log('openFile command triggered');
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('❌ 没有打开的文件');
                return;
            }
            const filePath = editor.document.uri.fsPath;
            const line = editor.selection.active.line + 1;
            const column = editor.selection.active.character + 1;
            console.log(`Opening file: ${filePath} at line ${line}, column ${column}`);
            const devEcoPath = checkDevEcoStudio();
            if (!devEcoPath) {
                const result = await vscode.window.showErrorMessage('❌ 未找到 DevEco Studio，请检查安装路径', '设置路径', '下载 DevEco Studio');
                if (result === '设置路径') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'cursor2deveco.devEcoPath');
                }
                else if (result === '下载 DevEco Studio') {
                    vscode.env.openExternal(vscode.Uri.parse('https://developer.harmonyos.com/cn/develop/deveco-studio'));
                }
                return;
            }
            // 显示正在打开的提示
            const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
            statusBarItem.text = "$(loading~spin) 正在打开 DevEco Studio...";
            statusBarItem.show();
            // 构建命令
            const command = process.platform === 'darwin'
                ? `open -a "${devEcoPath}" "${filePath}" --args --line ${line} --column ${column}`
                : `"${devEcoPath}" --line ${line} --column ${column} "${filePath}"`;
            console.log(`Executing command: ${command}`);
            child_process.exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
                statusBarItem.dispose();
                if (error) {
                    console.error(`Error: ${error}`);
                    vscode.window.showErrorMessage(`❌ 打开 DevEco Studio 失败: ${error.message}`, '重试', '设置路径').then(selection => {
                        if (selection === '重试') {
                            vscode.commands.executeCommand('cursor2deveco.openFile');
                        }
                        else if (selection === '设置路径') {
                            vscode.commands.executeCommand('workbench.action.openSettings', 'cursor2deveco.devEcoPath');
                        }
                    });
                    return;
                }
                if (stderr) {
                    console.warn(`Stderr: ${stderr}`);
                }
                console.log(`Stdout: ${stdout}`);
                const config = vscode.workspace.getConfiguration('cursor2deveco');
                const showToasts = config.get('showToasts', true);
                if (showToasts) {
                    vscode.window.showInformationMessage(`✅ 已在 DevEco Studio 中打开文件: ${path.basename(filePath)}`);
                }
            });
        }
        catch (err) {
            console.error('Unexpected error:', err);
            vscode.window.showErrorMessage(`❌ 发生意外错误: ${err}`);
        }
    });
    // 打开当前项目
    const openProjectCommand = vscode.commands.registerCommand('cursor2deveco.openProject', async () => {
        console.log('openProject command triggered');
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                vscode.window.showErrorMessage('❌ 没有打开的工作区');
                return;
            }
            const workspacePath = workspaceFolders[0].uri.fsPath;
            console.log(`Opening project: ${workspacePath}`);
            const devEcoPath = checkDevEcoStudio();
            if (!devEcoPath) {
                const result = await vscode.window.showErrorMessage('❌ 未找到 DevEco Studio，请检查安装路径', '设置路径', '下载 DevEco Studio');
                if (result === '设置路径') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'cursor2deveco.devEcoPath');
                }
                else if (result === '下载 DevEco Studio') {
                    vscode.env.openExternal(vscode.Uri.parse('https://developer.harmonyos.com/cn/develop/deveco-studio'));
                }
                return;
            }
            // 显示正在打开的提示
            const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
            statusBarItem.text = "$(loading~spin) 正在打开 DevEco Studio...";
            statusBarItem.show();
            // 构建命令
            const command = process.platform === 'darwin'
                ? `open -a "${devEcoPath}" "${workspacePath}"`
                : `"${devEcoPath}" "${workspacePath}"`;
            console.log(`Executing command: ${command}`);
            child_process.exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
                statusBarItem.dispose();
                if (error) {
                    console.error(`Error: ${error}`);
                    vscode.window.showErrorMessage(`❌ 打开 DevEco Studio 失败: ${error.message}`, '重试', '设置路径').then(selection => {
                        if (selection === '重试') {
                            vscode.commands.executeCommand('cursor2deveco.openProject');
                        }
                        else if (selection === '设置路径') {
                            vscode.commands.executeCommand('workbench.action.openSettings', 'cursor2deveco.devEcoPath');
                        }
                    });
                    return;
                }
                if (stderr) {
                    console.warn(`Stderr: ${stderr}`);
                }
                console.log(`Stdout: ${stdout}`);
                const config = vscode.workspace.getConfiguration('cursor2deveco');
                const showToasts = config.get('showToasts', true);
                if (showToasts) {
                    vscode.window.showInformationMessage(`✅ 已在 DevEco Studio 中打开项目: ${path.basename(workspacePath)}`);
                }
            });
        }
        catch (err) {
            console.error('Unexpected error:', err);
            vscode.window.showErrorMessage(`❌ 发生意外错误: ${err}`);
        }
    });
    context.subscriptions.push(openFileCommand, openProjectCommand);
}
function deactivate() {
    console.log('Cursor2DevEco extension is now deactivated!');
}
//# sourceMappingURL=extension.js.map