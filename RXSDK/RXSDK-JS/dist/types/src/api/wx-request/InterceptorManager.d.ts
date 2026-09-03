import { InterceptorRejected, InterceptorResolved } from './index';
declare class InterceptorManager {
    handlers: any[];
    constructor();
    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    use(fulfilled: InterceptorResolved, rejected: InterceptorRejected): number;
    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     */
    forEach(fn: Function): void;
}
export default InterceptorManager;
