import Adjust from '@adjustcom/adjust-web-sdk'

class SdkAdjust {
  constructor() {
  }

  public init() {
    // const attribution = Adjust.getAttribution()
    Adjust.initSdk({
      appToken: 'a7tay9toq29s',
      environment: 'sandbox',
      logLevel: 'verbose',
      attributionCallback: function(e, attribution) {
        console.log('Adid:' + attribution.adid)
        console.log('TrackerToken: ' + attribution.tracker_token)
        console.log('TrackerName: ' + attribution.tracker_name)
        console.log('Network:' + attribution.network)
        console.log('Campaign:' + attribution.campaign)
        console.log('Adgroup:' + attribution.adgroup)
        console.log('Creative:' + attribution.creative)
        console.log('ClickLabel: ' + attribution.click_label)
        console.log('AtributionState: ' + attribution.state)
      }
    })
  }

  public stop() {
    Adjust.stop()
  }

  public restart() {
    Adjust.restart()
  }

  public getAttribution() {
    const attribution = Adjust.getAttribution()
    console.log(attribution)
  }

  public trackEvent() {
    Adjust.trackEvent({
      eventToken: 'a7tay9toq29s',
      revenue: 100,
      currency: 'CNY'
    })
  }

  public addGlobalCallbackParameters() {
    Adjust.addGlobalCallbackParameters([
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2' }
    ])
  }
}

export default SdkAdjust
