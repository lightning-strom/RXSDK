import { InterceptorRejected, InterceptorResolved } from './index';
import { forEach as utilsForEach } from './utils'

class InterceptorManager {
  handlers: any[];
  
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled: InterceptorResolved, rejected: InterceptorRejected) {
    this.handlers.push({
      fulfilled: fulfilled,
      rejected: rejected,
    });
    return this.handlers.length - 1;
  };

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   */
  forEach(fn: Function) {
    utilsForEach(this.handlers, function forEachHandler(h: any) {
      if (h !== null) {
        fn(h);
      }
    });
  };
}

export default InterceptorManager;
