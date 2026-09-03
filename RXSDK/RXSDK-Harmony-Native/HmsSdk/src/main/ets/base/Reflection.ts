// reflection.ts
export class Reflection {
    // 模拟类注册表
    private static classMap: { [key: string]: any } = {};

    /**
     * 注册类
     * @param className 字符串类名
     * @param clazz 类本身
     */
    static registerClass(className: string, clazz: any) {
        this.classMap[className] = clazz;
    }

    /**
     * 根据类名字符串实例化对象
     * @param className 字符串类名
     */
    static newInstance<T = any>(className: string, ...args: any[]): T | null {
        const Cls = this.classMap[className];
        if (!Cls) {
            console.warn(`Class ${className} not found in registry`);
            return null;
        }
        return new Cls(...args) as T;
    }

    /**
     * 获取对象字段
     * @param obj 对象实例
     * @param fieldName 字段名
     */
    static getField(obj: any, fieldName: string): any {
        if (obj && fieldName in obj) {
            return obj[fieldName];
        }
        console.warn(`Field ${fieldName} not found in object`);
        return undefined;
    }

    /**
     * 设置对象字段
     * @param obj 对象实例
     * @param fieldName 字段名
     * @param value 要设置的值
     */
    static setField(obj: any, fieldName: string, value: any): boolean {
        if (obj) {
            obj[fieldName] = value;
            return true;
        }
        return false;
    }

    /**
     * 调用对象方法
     * @param obj 对象实例
     * @param methodName 方法名
     * @param args 参数数组
     */
    static invokeMethod(obj: any, methodName: string, ...args: any[]): any {
        if (obj && typeof obj[methodName] === "function") {
            return obj[methodName](...args);
        }
        console.warn(`Method ${methodName} not found in object`);
        return undefined;
    }
}
