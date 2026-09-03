namespace RuiXue
{
    public enum Sex
    {
        Woman = 0,
        Man = 1,
    }
    
    public enum RXPasswordStrength
    {
        Default = 0,      // 默认 6-32 位任意字符
        Custom = 1,       // 自定义密码正则
        Average = 2,      // 简易密码， 6-32 位任意字符
        Strong = 3,       // 强密码，  6-32 位，包含数字+字母+特殊符号
    }
}