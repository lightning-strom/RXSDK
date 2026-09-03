import { RCallback } from '../types/Index';
import Passport from './Passport';

type TimeoutCallback = (methodName: string, duration: number) => void | Promise<void>;
type ErrorHandler = (error: any, methodName: string, args: any[]) => void | Promise<void>;

export const LoginState = (target: Object, propertyKey: string) => {
  const original = target['prototype'] as Object;
  let t = target[propertyKey]
  // descriptor.value = function () {
  //   return original.apply(this, arguments)
  // }
};


export const LoginDecorator = (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
  const original = descriptor.value;
  descriptor.value = async function () {
    await Passport.checkAccessToken()
    return original.apply(this, arguments)
  }
};
function isRCallback<T>(callback: any): callback is RCallback<T> {
    return typeof callback === 'function';
}
export const CatchError = (errorHandler?: ErrorHandler) => {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        // 默认错误处理
        console.error(`Error in ${propertyKey}:`, error);
        // 执行自定义错误处理
        if (errorHandler) {
          await Promise.resolve(errorHandler(error, propertyKey, args));
        }
        throw error;
      }
    };

    return descriptor;
  };
}


export const Timeout = (ms: number = 5000, callback?: TimeoutCallback) => {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(async () => {
          if (callback) {
            await Promise.resolve(callback(propertyKey, ms));
          }
          reject(new Error(`${propertyKey} timeout after ${ms}ms`));
        }, ms);
      });

      return Promise.race([
        originalMethod.apply(this, args),
        timeoutPromise
      ]);
    };

    return descriptor;
  };
}