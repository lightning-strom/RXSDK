type TimeoutCallback = (methodName: string, duration: number) => void | Promise<void>;
type ErrorHandler = (error: any, methodName: string, args: any[]) => void | Promise<void>;
export declare const LoginState: (target: Object, propertyKey: string) => void;
export declare const LoginDecorator: (target: object, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare const CatchError: (errorHandler?: ErrorHandler) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare const Timeout: (ms?: number, callback?: TimeoutCallback) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export {};
