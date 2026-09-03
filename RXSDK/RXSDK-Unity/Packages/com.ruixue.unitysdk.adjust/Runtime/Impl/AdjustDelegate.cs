namespace RuiXue.Adjust
{
    public delegate void OnAttributionChangedDelegate(RxAdjustAttribution attribution);
    public delegate void OnFinishedEventTrackingSucceededDelegate(RxAdjustEventSuccess eventSuccessResponseData);
    public delegate void OnFinishedEventTrackingFailedDelegate(RxAdjustEventFailure rxAdjustEventFailure);
    public delegate void OnFinishedSessionTrackingSucceededDelegate(RxAdjustSessionSuccess rxAdjustSessionSuccess);
    public delegate void OnFinishedSessionTrackingFailedDelegate(RxAdjustSessionFailure rxAdjustSessionFailure);
    public delegate bool LaunchReceivedDeeplinkDelegate(string deeplink);
}