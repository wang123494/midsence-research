# AI UI 自动化测试 (Midscene.js Android)

本项目基于 Midscene.js 框架，利用多模态视觉大模型（VLM）实现 Android 端的 UI 自动化测试及断言。

## 📁 分支
main 分支为简单的例子
mult-vip-center 分支为多设备并行测试的例子 
## 🚀 快速开始

### 1. 配置环境
新建文件 `.env`，格式如下：

```bash
MIDSCENE_MODEL_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
MIDSCENE_MODEL_API_KEY="sk-your-api-key"
MIDSCENE_MODEL_NAME="qwen3-vl-flash"
MIDSCENE_MODEL_FAMILY="qwen3-vl"
DEBUG=midscene:ai:profile:stats
```

### 2. 安装依赖
```bash
npm install 
```

### 3. 连接设备
确保手机已通过数据线或网络连接 ADB：
```bash
adb devices
```

### 4. 运行单机测试
```bash
# 运行会员中心断言测试
npx tsx vip_center.ts
```

## 🛠 高级功能

### 多设备并发测试
`mult-vip_center.ts` 能够自动检测所有已连接设备并并行执行测试：
```bash
npx tsx mult-vip_center.ts
```

### 断言准确性稳定性测试
使用配套的 Shell 脚本运行多次并统计断言成功率，结果将追加到 `result.txt`：
```bash
# 运行 10 次并统计准确率
./test_assertion.sh 10
```
