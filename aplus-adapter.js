const MyPromise = require("./promise");

// 适配Promises/A+规范测试
const adapter = {
  // Promises/A+规范测试需要这个方法
  deferred() {
    const result = {};

    result.promise = new MyPromise((resolve, reject) => {
      result.resolve = resolve;
      result.reject = reject;
    });

    return result;
  },

  // Promises/A+规范测试需要这个方法
  resolved(value) {
    return MyPromise.resolve(value);
  },

  // Promises/A+规范测试需要这个方法
  rejected(reason) {
    return MyPromise.reject(reason);
  },
};

module.exports = adapter;
