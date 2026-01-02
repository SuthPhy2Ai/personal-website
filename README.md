# Tianhao Su - Personal Website

一个简单的个人介绍网页，展示物理与深度学习的研究方向。

## 快速开始

### 🚀 启动网站
双击运行 `start.bat`

这会自动：
- 启动本地 HTTP 服务器（端口 8000）
- 启动 localtunnel 隧道
- 获取并显示公网访问地址
- 获取并显示访问密码

### 🔑 获取访问密码
双击运行 `get-password.bat`

### 📊 查看状态
双击运行 `status.bat`

### 🛑 停止服务
双击运行 `stop.bat`

## 访问方式

### 本地访问
http://localhost:8000

### 公网访问
运行 `start.bat` 后会显示类似：
```
your url is: https://xxxxx.loca.lt
Tunnel Password: xxx.xxx.xxx.xxx
```

第一次访问时需要输入密码（你的公网 IP），之后 7 天内不需要重复输入。

## 文件说明

- `index.html` - 网页文件
- `start.bat` - 启动服务脚本
- `stop.bat` - 停止服务脚本
- `get-password.bat` - 获取密码脚本
- `status.bat` - 查看服务状态
- `tunnel.log` - localtunnel 日志（自动生成）
- `server.log` - HTTP 服务器日志（自动生成）
- `password.txt` - 访问密码（自动生成）

## 修改网页

直接编辑 `index.html` 文件，保存后刷新浏览器即可看到更改。

## 注意事项

- 服务启动后会在后台运行
- 关闭命令行窗口不会停止服务
- 必须运行 `stop.bat` 才能完全停止所有服务
- 每次重启 localtunnel，URL 会改变（但可以通过付费获得固定域名）
