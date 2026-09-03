package com.ruixue.sdk.oss;

public class OSSConfig {

    // Endpoint以华东1（杭州）为例，其它Region请按实际情况填写。
    public String oss_endpoint = "https://oss-cn-hangzhou.aliyuncs.com";
    // 填写callback地址。
    public String oss_callback_url = "https://oss-demo.aliyuncs.com:23450";
    // 填写STS鉴权服务器地址。
    // 您还可以根据工程sts_local_server目录中本地鉴权服务脚本代码启动本地STS鉴权服务器。
    public String sts_server_url = "http://****/sts/getsts";

    public String bucket_name = "yourBucketName";
    public String oss_access_key_id = "yourAccessKeyId";;
    public String oss_access_key_secret = "yourAccessKeySecret";

    public int DOWNLOAD_SUC = 1;
    public int DOWNLOAD_Fail = 2;
    public int UPLOAD_SUC = 3;
    public int UPLOAD_Fail = 4;
    public int UPLOAD_PROGRESS = 5;
    public int LIST_SUC = 6;
    public int HEAD_SUC = 7;
    public int RESUMABLE_SUC = 8;
    public int SIGN_SUC = 9;
    public int BUCKET_SUC = 10;
    public int GET_STS_SUC = 11;
    public int MULTIPART_SUC = 12;
    public int STS_TOKEN_SUC = 13;
    public int FAIL = 9999;
    public int REQUESTCODE_AUTH = 10111;
    public int REQUESTCODE_LOCALPHOTOS = 10112;
}