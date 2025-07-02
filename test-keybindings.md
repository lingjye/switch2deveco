# Switch2DevEco 快捷键测试指南
## 安装插件
1. 在VSCode中按 `Cmd+Shift+P` 打开命令面板
2. 输入 "Extensions: Install from VSIX..."
3. 选择 `switch2deveco-1.0.1.vsix` 文件安装
## 测试快捷键
### 1. 测试打开文件快捷键
- **快捷键**: `Alt+Shift+O` (所有平台)
- **步骤**:
  1. 在VSCode中打开任意文件
  2. 按快捷键 `Alt+Shift+O`
  3. 应该看到状态栏显示 "正在打开 DevEco Studio..."
  4. 如果成功，会显示绿色成功提示
  5. 如果失败，会显示红色错误提示并提供解决方案
### 2. 测试打开项目快捷键
- **快捷键**: `Alt+Shift+P` (所有平台)
- **步骤**:
  1. 在VSCode中打开一个项目文件夹
  2. 按快捷键 `Alt+Shift+P`
  3. 应该看到状态栏显示 "正在打开 DevEco Studio..."
  4. 如果成功，会显示绿色成功提示
  5. 如果失败，会显示红色错误提示并提供解决方案
### 3. 测试右键菜单
- **文件右键菜单**:
  1. 在编辑器中右键点击
  2. 应该看到 "Open File in DevEco Studio" 选项
- **文件夹右键菜单**:
  1. 在文件资源管理器中右键点击文件夹
  2. 应该看到 "Open Project in DevEco Studio" 选项
## 故障排除
### 如果快捷键不工作：
1. 检查是否有快捷键冲突：
   - 按 `Cmd+K Cmd+S` 打开快捷键设置
   - 搜索 "switch2deveco" 查看是否正确配置
   - 搜索 "alt+shift+o" 和 "alt+shift+p" 检查冲突
2. 检查插件是否正确激活：
   - 按 `Cmd+Shift+P` 打开命令面板
   - 输入 "Switch2DevEco" 应该看到相关命令
3. 查看控制台日志：
   - 按 `Cmd+Shift+P` 打开命令面板
   - 输入 "Developer: Toggle Developer Tools"
   - 在Console面板中查看是否有错误信息
### 如果DevEco Studio打开失败：
1. 检查DevEco Studio安装路径：
   - 按 `Cmd+,` 打开设置
   - 搜索 "switch2deveco"
   - 确认 "Dev Eco Path" 设置正确
2. 常见路径：
   - macOS: `/Applications/DevEco-Studio.app`
   - Windows: `C:\Program Files\Huawei\DevEco Studio\bin\devecostudio64.exe`
   - Linux: `/opt/DevEco-Studio/bin/devecostudio.sh`
## 配置选项
在VSCode设置中搜索 "switch2deveco" 可以找到以下配置：
- **Dev Eco Path**: DevEco Studio 可执行文件路径
- **Show Toasts**: 是否显示操作成功/失败的提示消息
## 反馈
如果遇到问题，请检查：
1. 插件是否正确安装和激活
2. DevEco Studio 是否正确安装
3. 快捷键是否有冲突
4. 查看开发者控制台的错误信息 