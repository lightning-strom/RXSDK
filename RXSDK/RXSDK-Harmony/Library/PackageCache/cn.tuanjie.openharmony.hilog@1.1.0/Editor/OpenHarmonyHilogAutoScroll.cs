namespace Tuanjie.OpenHarmony.Hilog
{
    internal enum AutoScroll
    {
        /// <summary>
        /// No automatic scrolling
        /// </summary>
        Disabled,

        /// <summary>
        /// Always scroll to end
        /// </summary>
        ScrollToEnd,

        /// <summary>
        /// Automatically scroll to end when manually moving to the end of messages
        /// </summary>
        Auto
    }
}
