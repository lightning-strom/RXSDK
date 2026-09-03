package com.ruixue.oss.internal;

import android.os.ParcelFileDescriptor;

import com.ruixue.oss.ClientException;
import com.ruixue.oss.ServiceException;
import com.ruixue.oss.callback.OSSCompletedCallback;
import com.ruixue.oss.common.OSSConstants;
import com.ruixue.oss.common.OSSLog;
import com.ruixue.oss.common.utils.BinaryUtil;
import com.ruixue.oss.common.utils.OSSUtils;
import com.ruixue.oss.model.AbortMultipartUploadRequest;
import com.ruixue.oss.model.ResumableDownloadResult;
import com.ruixue.oss.model.CompleteMultipartUploadResult;
import com.ruixue.oss.model.HeadObjectRequest;
import com.ruixue.oss.model.ResumableDownloadRequest;
import com.ruixue.oss.model.MultipartUploadRequest;
import com.ruixue.oss.model.OSSRequest;
import com.ruixue.oss.model.ResumableUploadRequest;
import com.ruixue.oss.model.ResumableUploadResult;
import com.ruixue.oss.network.ExecutionContext;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;

/**
 * Created by zhouzhuo on 11/27/15.
 */
public class ExtensionRequestOperation {

    private static ExecutorService executorService =
            Executors.newFixedThreadPool(OSSConstants.DEFAULT_BASE_THREAD_POOL_SIZE, new ThreadFactory() {
                @Override
                public Thread newThread(Runnable r) {
                    return new Thread(r, "oss-android-extensionapi-thread");
                }
            });
    private InternalRequestOperation apiOperation;

    public ExtensionRequestOperation(InternalRequestOperation apiOperation) {
        this.apiOperation = apiOperation;
    }

    public boolean doesObjectExist(String bucketName, String objectKey)
            throws ClientException, ServiceException {

        try {
            HeadObjectRequest head = new HeadObjectRequest(bucketName, objectKey);
            apiOperation.headObject(head, null).getResult();
            return true;
        } catch (ServiceException e) {
            if (e.getStatusCode() == 404) {
                return false;
            } else {
                throw e;
            }
        }
    }
    @SuppressWarnings("unchecked")
    public void abortResumableUpload(ResumableUploadRequest request) throws IOException {
        setCRC64(request);

        if (!OSSUtils.isEmptyString(request.getRecordDirectory())) {
            String uploadFilePath = request.getUploadFilePath();
            String fileMd5 = null;
            if (uploadFilePath != null) {
                fileMd5 = BinaryUtil.calculateMd5Str(uploadFilePath);
            } else {
                ParcelFileDescriptor parcelFileDescriptor = apiOperation.getApplicationContext().getContentResolver().openFileDescriptor(request.getUploadUri(), "r");
                try {
                    fileMd5 = BinaryUtil.calculateMd5Str(parcelFileDescriptor.getFileDescriptor());
                } finally {
                    if (parcelFileDescriptor != null) {
                        parcelFileDescriptor.close();
                    }
                }
            }
            Boolean checkCRC64 = (request.getCRC64() == OSSRequest.CRC64Config.YES);
            String recordFileName = BinaryUtil.calculateMd5Str((fileMd5 + request.getBucketName()
                    + request.getObjectKey() + String.valueOf(request.getPartSize()) + (checkCRC64 ? "-crc64" : "")).getBytes());
            String recordPath = request.getRecordDirectory() + "/" + recordFileName;
            File recordFile = new File(recordPath);

            if (recordFile.exists()) {
                BufferedReader br = new BufferedReader(new FileReader(recordFile));
                String uploadId = br.readLine();
                br.close();

                OSSLog.logDebug("[initUploadId] - Found record file, uploadid: " + uploadId);

                if (request.getCRC64() == OSSRequest.CRC64Config.YES) {
                    String filePath = request.getRecordDirectory() + File.separator + uploadId;
                    File file = new File(filePath);
                    if (file.exists()) {
                        file.delete();
                    }
                }

                AbortMultipartUploadRequest abort = new AbortMultipartUploadRequest(
                        request.getBucketName(), request.getObjectKey(), uploadId);
                apiOperation.abortMultipartUpload(abort, null);
            }

            if (recordFile != null) {
                recordFile.delete();
            }
        }
    }

        @SuppressWarnings("unchecked")
    public OSSAsyncTask<ResumableUploadResult> resumableUpload(
            ResumableUploadRequest request, OSSCompletedCallback<ResumableUploadRequest
                        , ResumableUploadResult> completedCallback) {
        setCRC64(request);
        ExecutionContext<ResumableUploadRequest, ResumableUploadResult> executionContext =
                new ExecutionContext(apiOperation.getInnerClient(), request, apiOperation.getApplicationContext());

        return OSSAsyncTask.wrapRequestTask(executorService.submit(new ResumableUploadTask(request,
                completedCallback, executionContext, apiOperation)), executionContext);
    }
    @SuppressWarnings("unchecked")
    public OSSAsyncTask<ResumableUploadResult> sequenceUpload(
            ResumableUploadRequest request, OSSCompletedCallback<ResumableUploadRequest
            , ResumableUploadResult> completedCallback) {
        setCRC64(request);
        ExecutionContext<ResumableUploadRequest, ResumableUploadResult> executionContext =
                new ExecutionContext(apiOperation.getInnerClient(), request, apiOperation.getApplicationContext());

        SequenceUploadTask task = new SequenceUploadTask(request,
                completedCallback, executionContext, apiOperation);

        return OSSAsyncTask.wrapRequestTask(executorService.submit(task), executionContext);
    }

    @SuppressWarnings("unchecked")
    public OSSAsyncTask<CompleteMultipartUploadResult> multipartUpload(MultipartUploadRequest request
            , OSSCompletedCallback<MultipartUploadRequest
            , CompleteMultipartUploadResult> completedCallback) {
        setCRC64(request);
        ExecutionContext<MultipartUploadRequest, CompleteMultipartUploadResult> executionContext =
                new ExecutionContext(apiOperation.getInnerClient(), request, apiOperation.getApplicationContext());

        return OSSAsyncTask.wrapRequestTask(executorService.submit(new MultipartUploadTask(apiOperation
                , request, completedCallback, executionContext)), executionContext);
    }
    @SuppressWarnings("unchecked")
    public OSSAsyncTask<ResumableDownloadResult> resumableDownload(ResumableDownloadRequest request,
                                                                   OSSCompletedCallback<ResumableDownloadRequest, ResumableDownloadResult> completedCallback) {
        ExecutionContext<ResumableDownloadRequest, ResumableDownloadResult> executionContext =
                new ExecutionContext(apiOperation.getInnerClient(), request, apiOperation.getApplicationContext());
        return OSSAsyncTask.wrapRequestTask(executorService.submit(new ResumableDownloadTask(apiOperation, request, completedCallback, executionContext)), executionContext);
    }

    private void setCRC64(OSSRequest request) {
        Enum crc64 = request.getCRC64() != OSSRequest.CRC64Config.NULL ? request.getCRC64() :
                (apiOperation.getConf().isCheckCRC64() ? OSSRequest.CRC64Config.YES : OSSRequest.CRC64Config.NO);
        request.setCRC64(crc64);
    }
}
