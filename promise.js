/**
 * 手写Promise实现，符合Promises/A+规范
 * 使用process.nextTick实现微任务
 */

// Promise的三种状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

// 微任务实现
const nextTick = process.nextTick;

class MyPromise {
  constructor(executor) {
    this.status = PENDING; // 初始状态为pending
    this.value = undefined; // 成功的值
    this.reason = undefined; // 失败的原因
    this.onFulfilledCallbacks = []; // 存储成功的回调
    this.onRejectedCallbacks = []; // 存储失败的回调

    // resolve方法
    const resolve = (value) => {
      // 如果value是Promise对象，则等待其状态改变
      if (value instanceof MyPromise) {
        return value.then(resolve, reject);
      }

      // 使用nextTick确保异步执行
      nextTick(() => {
        if (this.status === PENDING) {
          this.status = FULFILLED;
          this.value = value;
          // 执行所有成功的回调
          this.onFulfilledCallbacks.forEach((fn) => fn());
        }
      });
    };

    // reject方法
    const reject = (reason) => {
      // 使用nextTick确保异步执行
      nextTick(() => {
        if (this.status === PENDING) {
          this.status = REJECTED;
          this.reason = reason;
          // 执行所有失败的回调
          this.onRejectedCallbacks.forEach((fn) => fn());
        }
      });
    };

    try {
      // 立即执行executor
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  // then方法，返回一个新的Promise
  then(onFulfilled, onRejected) {
    // 处理参数可选的情况
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    // 返回一个新的Promise
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        nextTick(() => {
          try {
            const x = onFulfilled(this.value);
            // 处理返回值
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.status === REJECTED) {
        nextTick(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.status === PENDING) {
        // pending状态时，将回调存储起来
        this.onFulfilledCallbacks.push(() => {
          nextTick(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });

        this.onRejectedCallbacks.push(() => {
          nextTick(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });

    return promise2;
  }

  // catch方法用于处理rejected状态
  catch(onRejected) {
    return this.then(null, onRejected);
  }

  // finally方法，无论成功失败都会执行
  finally(callback) {
    return this.then(
      (value) => MyPromise.resolve(callback()).then(() => value),
      (reason) =>
        MyPromise.resolve(callback()).then(() => {
          throw reason;
        })
    );
  }

  // 静态resolve方法
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise((resolve) => {
      resolve(value);
    });
  }

  // 静态reject方法
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

  // Promise.all方法
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError("promises must be an array"));
      }

      const results = [];
      let count = 0;

      // 如果传入的是空数组，直接resolve
      if (promises.length === 0) {
        return resolve(results);
      }

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          (value) => {
            results[index] = value;
            count++;
            // 所有promise都成功才resolve
            if (count === promises.length) {
              resolve(results);
            }
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    });
  }

  // Promise.race方法
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError("promises must be an array"));
      }

      // 空数组会一直pending
      promises.forEach((promise) => {
        MyPromise.resolve(promise).then(resolve, reject);
      });
    });
  }
}

// 处理Promise的解决过程
function resolvePromise(promise2, x, resolve, reject) {
  // 如果promise2和x相同，抛出循环引用错误
  if (promise2 === x) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }

  // 记录是否已调用，确保只调用一次
  let called = false;

  // 如果x是对象或函数
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      // 尝试获取x.then
      const then = x.then;

      if (typeof then === "function") {
        // 如果then是函数，认为x是promise-like对象
        then.call(
          x,
          // 成功回调
          (y) => {
            if (called) return;
            called = true;
            // 递归处理，直到解析出普通值
            // 使用nextTick确保异步递归调用不会堆栈溢出
            nextTick(() => {
              resolvePromise(promise2, y, resolve, reject);
            });
          },
          // 失败回调
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        // then不是函数，当做普通值处理
        resolve(x);
      }
    } catch (error) {
      // 如果获取x.then抛出异常
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    // x是普通值，直接resolve
    resolve(x);
  }
}

// 导出MyPromise
module.exports = MyPromise;
