package com.ruixue.error;

public class BusinessException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public BusinessException(Object object) {
        super(object.toString());
    }
}
