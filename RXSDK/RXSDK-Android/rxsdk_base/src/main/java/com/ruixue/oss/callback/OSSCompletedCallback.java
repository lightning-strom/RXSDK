package com.ruixue.oss.callback;

import com.ruixue.oss.ClientException;
import com.ruixue.oss.ServiceException;
import com.ruixue.oss.model.OSSRequest;
import com.ruixue.oss.model.OSSResult;

/**
 * Created by zhouzhuo on 11/19/15.
 */
public interface OSSCompletedCallback<T1 extends OSSRequest, T2 extends OSSResult> {

    public void onSuccess(T1 request, T2 result);

    public void onFailure(T1 request, ClientException clientException, ServiceException serviceException);
}
