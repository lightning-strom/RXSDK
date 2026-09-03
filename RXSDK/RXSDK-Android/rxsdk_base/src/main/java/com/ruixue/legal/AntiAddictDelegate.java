package com.ruixue.legal;

/**
 * 防沉迷委托
 */
public interface AntiAddictDelegate {
    AntiAddictDelegate EMPTY = new AntiAddictDelegate() {
        public boolean isGaming() {
            return false;
        }

        public void didAddictInfoUpdate(String json) {
        }

        public boolean enableCustomUI() {
            return false;
        }
    };

    //是否正在游戏中
    public boolean isGaming();

    // 自定义UI时处理此防沉迷状态变化接口,游戏根据用户防沉迷的状态回调自行处理弹窗、强制登出等逻辑
    void didAddictInfoUpdate(String json);

    // 防沉迷是否使用CP自定义UI
    // 如果需要自定义ui，则return true, 然后监听didAddictInfoUpdate的回调，做对应的ui处理
    boolean enableCustomUI();
}
