# 手写 Promise 实现

本项目是一个符合 Promises/A+规范的 Promise 实现。

## 项目结构

- `promise.js`: Promise 的实现代码
- `test.js`: 基本测试用例
- `aplus-adapter.js`: 符合 Promises/A+测试规范的适配器
- `package.json`: 项目配置文件

## 如何运行测试

首先安装依赖：

```bash
npm install
```

然后运行 Promises/A+规范测试：

```bash
npm test
```

## 实现的功能

- 完全符合 Promises/A+规范
- 支持链式调用 (.then())
- 支持错误处理 (.catch())
- 支持 .finally() 方法
- 支持静态方法：resolve, reject, all, race

## Promises/A+规范要点

1. Promise 有三种状态：pending, fulfilled, rejected
2. 状态一旦更改，不能再变
3. Promise 必须有一个 then 方法，接收 onFulfilled 和 onRejected 两个回调
4. then 方法必须返回一个 Promise
5. 实现链式调用和值传递
6. 正确处理 thenable 对象
