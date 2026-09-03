cd "$(dirname $0)" || exit
./gradlew -v

# 仅发布 local_repo 到阿里云
if [ "$1" = "local_repo" ] || [ "$1" = "localRepo" ]; then
    ./scripts/publish_local_repo.sh ali
    exit $?
fi
# 仅发布 local_repo 到 Nexus
if [ "$1" = "local_repo_nexus" ] || [ "$1" = "localRepoNexus" ]; then
    ./scripts/publish_local_repo.sh nexus
    exit $?
fi
# 发布 local_repo 到阿里云 + Nexus
if [ "$1" = "local_repo_both" ] || [ "$1" = "localRepoBoth" ]; then
    ./scripts/publish_local_repo.sh both
    exit $?
fi

TASK=${1:-publishReleasePublicationToRuixueRepository}
BATCH_SIZE=10
# 模块列表
MODULES=(
    # 基础模块
    "rxsdk_base"
    "rxsdk_base_ui"
    "rxsdk_oaid"
    "rxsdk_oaidv2"
    "rxsdk_alimobile"
    "rxsdk_gaode"
    "rxsdk_weixin"
    "rxsdk_weixin_withpay"
    "rxsdk_alipay"
    "rxsdk_unifypay"
    "rxsdk_upay"
    "rxsdk_h5pay"
    "rxsdk_snfpay"
    "rxsdk_yeepay"
    "rxsdk_catappult"

    # 海外模块
    "overseas:rxsdk_facebook"
    "overseas:rxsdk_google"
    "overseas:rxsdk_line"
    "overseas:rxsdk_zalo"
    "overseas:rxsdk_overseas"
    "overseas:rxsdk_adjust"
    "overseas:rxsdk_firebase"
    "overseas:rxsdk_tiktok"
    "overseas:rxsdk_snapchat"
    "overseas:rxsdk_instagram"
    "overseas:rxsdk_reddit"
    "overseas:rxsdk_qoo"
    "overseas:rxsdk_vk"
    "overseas:rxsdk_overseas_huawei"
    "overseas:rxsdk_overseas_oppo"
    "overseas:rxsdk_apkpure"
    "overseas:rxsdk_rustore"
    # 渠道模块
    "channel:rxsdk_kwaiallin"
    "channel:rxsdk_kwai_buy"
    "channel:rxsdk_baidu_wangxun"
    "channel:rxsdk_douyin_gb"
    "channel:rxsdk_huawei"
    "channel:rxsdk_oppo"
    "channel:rxsdk_vivo"
    "channel:rxsdk_weile"
    "channel:rxsdk_xiaomi"
    "channel:rxsdk_ysdk"
    "channel:rxsdk_taptap"
    "channel:rxsdk_bilibili"
    "channel:rxsdk_4399"
    "channel:rxsdk_honor"
    "channel:rxsdk_9game"
    "channel:rxsdk_yofun"
    "channel:rxsdk_ld"
    "channel:rxsdk_007"
    "channel:rxsdk_quick"
    "channel:rxsdk_xuteng"
    "channel:rxsdk_xingyi"
    "channel:rxsdk_huya"
    # 推送模块
    "push:rxsdk_push_base"
    "push:rxsdk_push_huawei"
    "push:rxsdk_push_meizu"
    "push:rxsdk_push_mi"
    "push:rxsdk_push_oppo"
    "push:rxsdk_push_vivo"
    "push:rxsdk_push_honor"
    # 其他功能模块
    "rxsdk_bytedance_log"
    "rxsdk_websocket"
    "rxsdk_topon"
    "rxsdk_install_appinfo"
    "rxsdk_deviceinfo"
    "rxsdk_contacts"
    "ruixue_aliyun_dns"
    "ruixue_tencent_dns"
    "rxsdk_performance"
    "rxsdk_feedback_ui"
    "rxsdk_openinstall"
    "rxsdk_openinstall_os"
    "rxsdk_gdt"
    "rxsdk_huawei_replay"
    "rxsdk_huawei_moment"
)


#./gradlew :overseas:rxsdk_instagram:$TASK

TOTAL_START=$(date +%s)
for MODULE in "${MODULES[@]}"; do
    echo "=== Executing $TASK for module: $MODULE ==="
    ./gradlew ":$MODULE:$TASK" || {
        echo ">>> Task failed for module: $MODULE <<<"
        exit 1
    }
done

TOTAL_END=$(date +%s)
TOTAL_ELAPSED=$((TOTAL_END - TOTAL_START))

echo "=== All modules completed successfully in ${TOTAL_ELAPSED}s ==="
