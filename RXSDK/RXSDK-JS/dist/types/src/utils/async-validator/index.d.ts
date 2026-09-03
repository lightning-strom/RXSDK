import { InternalRuleItem, RuleItem, Rules, Values } from './interface';
export * from './interface';
declare class Schema {
    static validators: {
        string: import("./interface").ExecuteValidator;
        number: import("./interface").ExecuteValidator;
        boolean: import("./interface").ExecuteValidator;
        array: import("./interface").ExecuteValidator;
        object: import("./interface").ExecuteValidator;
        enum: import("./interface").ExecuteValidator;
        email: import("./interface").ExecuteValidator;
        required: import("./interface").ExecuteValidator;
    };
    rules: Record<string, RuleItem>;
    constructor(descriptor: Rules);
    define(rules: Rules): void;
    validate(source: Values): Promise<Values>;
    getType(rule: InternalRuleItem): import("./interface").RuleType;
    getValidationMethod(rule: InternalRuleItem): any;
}
export default Schema;
