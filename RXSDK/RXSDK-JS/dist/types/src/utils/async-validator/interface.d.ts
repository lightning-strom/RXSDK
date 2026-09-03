export type RuleType = 'string' | 'number' | 'boolean' | 'method' | 'array' | 'object' | 'enum' | 'email';
export type SyncErrorType = Error | string;
export type SyncValidateResult = boolean | SyncErrorType | SyncErrorType[];
export type ValidateResult = void | Promise<void> | SyncValidateResult;
export interface RuleItem {
    type?: RuleType;
    required?: boolean;
    enum?: Array<string | number | boolean | null | undefined>;
    message?: string | ((a?: string) => string);
    asyncValidator?: (rule: InternalRuleItem, value: Value, source: Values) => void | Promise<void>;
    validator?: (rule: InternalRuleItem, value: Value, source: Values) => SyncValidateResult | void;
}
export type Value = any;
export type Values = Record<string, Value>;
export type Rule = RuleItem;
export type Rules = Record<string, Rule>;
export interface RuleValuePackage {
    rule: InternalRuleItem;
    value: Value;
    source: Values;
    field: string;
}
export interface InternalRuleItem extends Omit<RuleItem, 'validator'> {
    field?: string;
    validator?: RuleItem['validator'] | ExecuteValidator;
}
export type ExecuteValidator = (rule: InternalRuleItem, value: Value, source: Values) => void;
export type ExecuteRule = (rule: InternalRuleItem, value: Value, source: Values, errors: string[], type?: string) => void;
export interface ValidateError {
    message: string;
    fieldValue: Value;
    field: string;
}
