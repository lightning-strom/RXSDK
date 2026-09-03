package com.ruixue.error;

import java.io.IOException;
import java.net.HttpURLConnection;

public class NetworkException extends RXException {

    /**
     * An {@code int} representing the three digit HTTP Status-Code.
     * <ul>
     * <li> 1xx: Informational
     * <li> 2xx: Success
     * <li> 3xx: Redirection
     * <li> 4xx: Client Error
     * <li> 5xx: Server Error
     * </ul>
     */
    protected int responseCode = -1;

    public NetworkException(String message) {
        super(message);
        this.responseCode = HttpURLConnection.HTTP_UNSUPPORTED_TYPE;
        this.code = DEFAULT_ERROR + responseCode;
    }

    public NetworkException(int responseCode, String message) {
        super(message);
        this.responseCode = responseCode;
        this.code = DEFAULT_ERROR + responseCode;
    }

    public NetworkException(Throwable e) {
        super(e);
    }

    public int getResponseCode() {
        return responseCode < 0 ? getCode() : responseCode;
    }
}
