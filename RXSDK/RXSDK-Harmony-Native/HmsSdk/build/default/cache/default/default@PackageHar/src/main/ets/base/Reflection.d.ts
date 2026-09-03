export declare class Reflection {
    private static classMap;
    /**
     * 注册类
     * @param className 字符串类名
     * @param clazz 类本身
     */
    static registerClass(g25: string, h25: any): void;
    /**
     * 根据类名字符串实例化对象
     * @param className 字符串类名
     */
    static newInstance<c25 = any>(d25: string, ...e25: any[]): c25 | null;
    /**
     * 获取对象字段
     * @param obj 对象实例
     * @param fieldName 字段名
     */
    static getField(a25: any, b25: string): any;
    /**
     * 设置对象字段
     * @param obj 对象实例
     * @param fieldName 字段名
     * @param value 要设置的值
     */
    static setField(x24: any, y24: string, z24: any): boolean;
    /**
     * 调用对象方法
     * @param obj 对象实例
     * @param methodName 方法名
     * @param args 参数数组
     */
    static invokeMethod(u24: any, v24: string, ...w24: any[]): any;
}
