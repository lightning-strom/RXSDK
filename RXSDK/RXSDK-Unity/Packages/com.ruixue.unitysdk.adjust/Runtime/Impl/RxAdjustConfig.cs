using System;
using RuiXueLitJson;

namespace RuiXue.Adjust
{
    [Serializable]
    public class RxAdjustConfig
    {
        public string appToken;
        public string environment;
        public bool eventBufferingEnabled;
        public OnAttributionChangedDelegate OnRxAttributionChangedDelegateListener;
        public OnFinishedEventTrackingSucceededDelegate OnRxEventTrackingSucceededDelegateListener;
        public OnFinishedEventTrackingFailedDelegate OnRxEventTrackingFailedDelegateListener;
        public OnFinishedSessionTrackingSucceededDelegate OnRxSessionTrackingSucceededDelegateListener;
        public OnFinishedSessionTrackingFailedDelegate OnRxSessionTrackingFailedDelegateListener;
        public LaunchReceivedDeeplinkDelegate OnRxDeeplinkDelegateResponseListener;
        public bool sendInBackground;
        public double delayStart;
        public string externalDeviceId;
        public bool preinstallTrackingEnabled;
        public bool needsCost;
        public string urlStrategy;

        public RxLogLevel rxLogLevel;
        
        public const string ENVIRONMENT_SANDBOX = "sandbox";
        public const string ENVIRONMENT_PRODUCTION = "production";

        public const string URL_STRATEGY_INDIA = "url_strategy_india";
        public const string URL_STRATEGY_CHINA = "url_strategy_china";
        public const string URL_STRATEGY_CN = "url_strategy_cn";
        public const string DATA_RESIDENCY_EU = "data_residency_eu";
        public const string DATA_RESIDENCY_TR = "data_residency_tr";
        public const string DATA_RESIDENCY_US = "data_residency_us";

        public const string AD_REVENUE_APPLOVIN_MAX = "applovin_max_sdk";
        public const string AD_REVENUE_MOPUB = "mopub";
        public const string AD_REVENUE_ADMOB = "admob_sdk";
        public const string AD_REVENUE_IRONSOURCE = "ironsource_sdk";
        public const string AD_REVENUE_ADMOST = "admost_sdk";
        public const string AD_REVENUE_UNITY = "unity_sdk";
        public const string AD_REVENUE_HELIUM_CHARTBOOST = "helium_chartboost_sdk";
        public const string AD_REVENUE_SOURCE_PUBLISHER = "publisher_sdk";

        public RxAdjustConfig(string appToken, string environment)
        {
            this.appToken = appToken;
            this.environment = environment;
            
            JsonMapper.RegisterExporter<RxAdjustConfig>((obj, writer) =>
            {
                writer.WriteObjectStart();
                writer.WritePropertyName("appToken");
                writer.Write(obj.appToken);
                writer.WritePropertyName("environment");
                writer.Write(obj.environment);
                writer.WritePropertyName("eventBufferingEnabled");
                writer.Write(obj.eventBufferingEnabled);
                writer.WritePropertyName("sendInBackground");
                writer.Write(obj.sendInBackground);
                writer.WritePropertyName("delayStart");
                writer.Write(obj.delayStart);
                writer.WritePropertyName("externalDeviceId");
                writer.Write(obj.externalDeviceId);
                writer.WritePropertyName("preinstallTrackingEnabled");
                writer.Write(obj.preinstallTrackingEnabled);
                writer.WritePropertyName("needsCost");
                writer.Write(obj.needsCost);
                writer.WritePropertyName("urlStrategy");
                writer.Write(obj.urlStrategy);
                writer.WritePropertyName("rxLogLevel");
                writer.Write((int)obj.rxLogLevel);
                writer.WriteObjectEnd();
            });
        }

        public void SetLogLevel(RxLogLevel rxLogLevel)
        {
            this.rxLogLevel = rxLogLevel;
        }

    }
}
