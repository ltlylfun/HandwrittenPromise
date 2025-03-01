# Promise Implementation / Promise 手写实现

[English](#english) | [中文](#chinese)

<a name="english"></a>

# Promise Implementation

A Promise implementation that complies with the Promises/A+ specification.

## Project Structure

- `promise.js`: Core Promise implementation
- `test.js`: Basic test cases
- `aplus-adapter.js`: Adapter for Promises/A+ specification tests
- `package.json`: Project configuration file

## How to Run Tests

First, install dependencies:

```bash
npm install
```

Then run the Promises/A+ specification tests:

```bash
npm test
```

## Features

- Fully compliant with Promises/A+ specification
- Supports chain calls (.then())
- Supports error handling (.catch())
- Supports .finally() method
- Supports static methods: resolve, reject, all, race

## Key Points of Promises/A+ Specification

1. A Promise has three states: pending, fulfilled, rejected
2. Once the state changes, it cannot be changed again
3. Promise must have a then method that accepts onFulfilled and onRejected callbacks
4. The then method must return a Promise
5. Implements chain calls and value passing
6. Properly handles thenable objects

---

<a name="chinese"></a>

# Promise 手写实现

一个符合 Promises/A+规范的 Promise 实现。

## 项目结构

- `promise.js`: Promise 的核心实现代码
- `test.js`: 基础测试用例
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

## 其他说明

本项目主要用于学习和理解 Promise 的原理。生产环境建议使用原生 Promise 或成熟的第三方库。
