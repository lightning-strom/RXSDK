package com.ruixue.error;

import androidx.annotation.Nullable;

import com.ruixue.utils.JSONUtil;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;

import javax.net.ssl.SSLException;
import javax.net.ssl.SSLHandshakeException;

public class RXException extends Exception {

    /**
     * 未知类型网络错误
     */
    public static final int DEFAULT_ERROR = 1000;
    /**
     * 网络IO 错误
     */
    public static final int IO_ERROR = 1100;
    /**
     * Runtime 异常
     */
    public static final int RUNTIME_ERROR = 9000;
    /**
     * 代码异常
     */
    public static final int CODE_ERROR = 9010;
    /**
     * URL 异常
     */
    public static final int URL_ERROR = 9020;
    /**
     * JSON 异常
     */
    public static final int JSON_ERROR = 9030;

    public static final int OUT_OF_MEMORY_ERROR = 9040;

    /**
     * Runtime 加载错误
     */
    public static final int SECURITY_ERROR = RUNTIME_ERROR + 1;
    /**
     * Runtime 参数错误
     */
    public static final int ILLEGAL_ARGUMENT_ERROR = RUNTIME_ERROR + 2;
    /**
     * Runtime 空指针错误
     */
    public static final int NULL_POINTER_ERROR = RUNTIME_ERROR + 3;

    /**
     * IO ssl 错误
     */
    public static final int SSL_ERROR = IO_ERROR + 10;
    /**
     * IO host 错误
     */
    public static final int UNKNOWN_HOST_ERROR = IO_ERROR + 20;
    /**
     * IO中断异常
     */
    public static final int INTERRUPTED_IO_ERROR = (IO_ERROR) + 30;
    /**
     * IO ssl 验证错误
     */
    public static final int SSL_HAND_SHAKE_ERROR = (SSL_ERROR) + 1;

    /**
     * IO 超时 SSL handshake timed out
     */
    public static final int SOCKET_TIMEOUT_ERROR = (INTERRUPTED_IO_ERROR) + 1;

    protected int code;
    protected String traceId = "";
    protected Object thirdCode;
    protected String thirdMsg;

    protected Map<String, Object> ext = new HashMap<>();

    public static Throwable getTargetException(Throwable e) {
        if (e instanceof InvocationTargetException) {
            return ((InvocationTargetException) e).getTargetException(); // 获取目标异常
        }
        return e;
    }

    public RXException(Throwable throwable) {
        super(getTargetException(throwable).getMessage(), getTargetException(throwable).getCause());
        initCode(throwable);
    }


    public static int getCode(Throwable throwable) {
        if (throwable instanceof JSONException) {
            return JSON_ERROR;
        } else if (throwable instanceof UnknownHostException) {
            return UNKNOWN_HOST_ERROR;
        } else if (throwable instanceof SSLHandshakeException) {
            return SSL_HAND_SHAKE_ERROR;
        } else if (throwable instanceof SSLException) {
            return SSL_ERROR;
        } else if (throwable instanceof SocketTimeoutException) {
            return SOCKET_TIMEOUT_ERROR;
        } else if (throwable instanceof java.io.InterruptedIOException) {
            return INTERRUPTED_IO_ERROR;
        } else if (throwable instanceof IOException) {
            return IO_ERROR;
        } else if (throwable instanceof SecurityException) {
            return SECURITY_ERROR;
        } else if (throwable instanceof IllegalArgumentException) {
            return ILLEGAL_ARGUMENT_ERROR;
        } else if (throwable instanceof NullPointerException) {
            return NULL_POINTER_ERROR;
        } else if (throwable instanceof RuntimeException) {
            return RUNTIME_ERROR;
        } else if (throwable instanceof OutOfMemoryError) {
            return OUT_OF_MEMORY_ERROR;
        } else {
            return DEFAULT_ERROR;
        }
    }

    private void initCode(Throwable throwable) {
        this.code = getCode(throwable);
    }

    public RXException(Exception e, String traceId) {
        this(e);
        this.traceId = traceId;
    }

    public RXException(int code, Exception e) {
        super(e.getMessage(), e.getCause());
        this.code = code;
    }

    public RXException(String message) {
        super(message);
        this.code = DEFAULT_ERROR;
    }

    @Nullable
    @Override
    public String getMessage() {
        return super.getMessage();
    }

//    public RXException(RXResult result) {
//        super(result.getMsg());
//        this.code = result.getCode();
//        this.traceId = result.getTraceId();
//    }

//    public RXException(RXResult result, Throwable cause) {
//        super(result.getMsg(), cause);
//        this.code = result.getCode();
//        this.traceId = result.getTraceId();
//    }

    public RXException(RXErrorCode rxErrorCode, Object thirdCode, String message) {
        super(rxErrorCode.getDesc());
        this.code = rxErrorCode.getValue();
        this.thirdCode = thirdCode;
        this.thirdMsg = message;
    }

    public RXException(int code, String message) {
        super(message);
        this.code = code;
    }

    public RXException(int code, String message, String traceId) {
        super(message);
        this.code = code;
        this.traceId = traceId;
    }

    public RXException(int code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }

    public Map<String, Object> getExt() {
        return ext;
    }

    public RXException setExt(String key, Object value) {
        if (ext != null) {
            ext.put(key, value);
        }
        return this;
    }

    public RXException setTraceId(String traceId) {
        this.traceId = traceId;
        return this;
    }

    public String getTraceId() {
        return traceId;
    }

    public int getCode() {
        return code;
    }

    public Object getThirdCode() {
        return thirdCode;
    }

    public String getThirdMsg() {
        return thirdMsg;
    }

    public String getJSONString() {
        return toJSONObject().toString();
    }

    public Map<String, Object> toMap() {
        Map<String, Object> map = ext != null ? ext : new HashMap<>();
        map.put("code", this.getCode());
        String msg = this.getMessage();

        map.put("msg", msg);
        map.put("trace_id", this.getTraceId());
        if (this.thirdCode != null) {
            map.put("thirdcode", this.thirdCode);
        }
        if (this.thirdMsg != null) {
            map.put("thirdmsg", this.thirdMsg);
        }
        return map;
    }

    public JSONObject toJSONObject() {
        Map<String, Object> map = ext != null ? ext : new HashMap<>();
        return JSONUtil.toJSONObject(map, this.getCode(), this.getMessage(), this.getTraceId(), this.thirdCode, this.thirdMsg);
    }
}
