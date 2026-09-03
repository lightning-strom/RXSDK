using System;
using System.Threading.Tasks;

namespace RXSDK
{
    public class Timer
    {

        private bool _isRunning;

        /// <summary>
        /// 启动倒计时
        /// </summary>
        /// <param name="duration">倒计时时间（秒）</param>
        /// <param name="onComplete">倒计时完成时执行的逻辑</param>
        public async void StartCountdown(double duration, Action onComplete)
        {
            _isRunning = true;
            await Task.Delay(TimeSpan.FromSeconds(duration));

            if (_isRunning)
            {
                //MessageBox(IntPtr.Zero, "倒计时结束！", "提示", 0x00000040); // 0x40: 信息图标
                onComplete?.Invoke(); // 执行完成逻辑
            }
        }

        /// <summary>
        /// 停止倒计时
        /// </summary>
        public void StopCountdown()
        {
            _isRunning = false;
        }

    }
}