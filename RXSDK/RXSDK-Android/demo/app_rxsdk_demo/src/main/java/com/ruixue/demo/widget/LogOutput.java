package com.ruixue.demo.widget;

/**
 * 日志输出接口
 * <p>
 * 统一日志输出能力，支持多种日志显示方式（吸底面板、浮动窗口等）
 *
 * @since 2.0
 */
public interface LogOutput {

    /** 日志级别 */
    interface Level {
        String INFO = "INFO";
        String SUCCESS = "SUCCESS";
        String WARN = "WARN";
        String ERROR = "ERROR";
        String DEBUG = "DEBUG";
    }

    /**
     * 输出日志（默认 INFO 级别）
     */
    void log(String message);

    /**
     * 输出日志（指定级别）
     *
     * @param level   日志级别，见 {@link Level}
     * @param message 日志内容
     */
    void log(String level, String message);

    /**
     * 清除日志
     */
    void clearLog();

    /**
     * 复制日志到剪贴板
     */
    void copyLog();
}
