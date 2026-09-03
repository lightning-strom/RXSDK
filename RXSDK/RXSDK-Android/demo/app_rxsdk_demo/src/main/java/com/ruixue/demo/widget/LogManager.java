package com.ruixue.demo.widget;

import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.ArrayList;
import java.util.List;

/**
 * 日志管理器
 * <p>
 * 统一管理多个日志输出目标，支持同时输出到多个组件（吸底面板、浮动窗口等）
 *
 * <pre>
 * 使用示例：
 * LogManager logManager = LogManager.getInstance();
 * logManager.addOutput(resizableLogPanel);
 * logManager.addOutput(floatingLogView);
 * logManager.log("操作成功");
 * logManager.log(LogOutput.Level.ERROR, "操作失败");
 * </pre>
 *
 * @since 2.0
 */
public class LogManager implements LogOutput {

    private static volatile LogManager instance;

    private final List<LogOutput> outputs = new ArrayList<>();
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    private LogManager() {
    }

    /**
     * 获取单例
     */
    public static LogManager getInstance() {
        if (instance == null) {
            synchronized (LogManager.class) {
                if (instance == null) {
                    instance = new LogManager();
                }
            }
        }
        return instance;
    }

    /**
     * 添加日志输出目标
     */
    public void addOutput(@NonNull LogOutput output) {
        if (!outputs.contains(output)) {
            outputs.add(output);
        }
    }

    /**
     * 移除日志输出目标
     */
    public void removeOutput(@NonNull LogOutput output) {
        outputs.remove(output);
    }

    /**
     * 清除所有输出目标
     */
    public void clearOutputs() {
        outputs.clear();
    }

    /**
     * 获取输出目标数量
     */
    public int getOutputCount() {
        return outputs.size();
    }

    @Override
    public void log(String message) {
        log(Level.INFO, message);
    }

    @Override
    public void log(String level, String message) {
        mainHandler.post(() -> {
            for (LogOutput output : outputs) {
                try {
                    output.log(level, message);
                } catch (Exception e) {
                    // 忽略单个输出的异常，不影响其他输出
                }
            }
        });
    }

    /**
     * 输出成功日志
     */
    public void success(String message) {
        log(Level.SUCCESS, message);
    }

    /**
     * 输出警告日志
     */
    public void warn(String message) {
        log(Level.WARN, message);
    }

    /**
     * 输出错误日志
     */
    public void error(String message) {
        log(Level.ERROR, message);
    }

    /**
     * 输出调试日志
     */
    public void debug(String message) {
        log(Level.DEBUG, message);
    }

    @Override
    public void clearLog() {
        mainHandler.post(() -> {
            for (LogOutput output : outputs) {
                try {
                    output.clearLog();
                } catch (Exception e) {
                    // 忽略异常
                }
            }
        });
    }

    @Override
    public void copyLog() {
        // 复制操作只需在第一个输出目标执行即可
        if (!outputs.isEmpty()) {
            mainHandler.post(() -> {
                try {
                    outputs.get(0).copyLog();
                } catch (Exception e) {
                    // 忽略异常
                }
            });
        }
    }
}
