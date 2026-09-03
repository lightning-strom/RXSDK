namespace Tuanjie.OpenHarmony.Hilog
{
    internal interface IOpenHarmonyHilogTaskInput
    {
    }

    internal class OpenHarmonyHilogTaskInput<T> : IOpenHarmonyHilogTaskInput
    {
        internal T data;
    }

    internal class OpenHarmonyHilogTaskInput<T1, T2> : IOpenHarmonyHilogTaskInput
    {
        internal T1 data1;
        internal T2 data2;
    }
    internal class OpenHarmonyHilogTaskInput<T1, T2, T3> : IOpenHarmonyHilogTaskInput
    {
        internal T1 data1;
        internal T2 data2;
        internal T3 data3;
    }
}
