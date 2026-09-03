#
# Be sure to run `pod lib lint RXPushSDK.podspec' to ensure this is a
# valid spec before submitting.
#
# Any lines starting with a # are optional, but their use is encouraged
# To learn more about a Podspec see https://guides.cocoapods.org/syntax/podspec.html
#

Pod::Spec.new do |s|
  s.name             = 'RXLanguageKit'
  s.version          = '1.1.7'
  s.summary          = 'ruixue toolkit framework.'

# This description is used to generate tags and improve searc results.
#   * Think: What does it do? Why did you write it? What is the focus?
#   * Try to keep it short, snappy and to the point.
#   * Write the description between the DESC delimiters below.
#   * Finally, don't worry about the indent, CocoaPods strips it!

  s.description      = <<-DESC
TODO: Add long description of the pod here.
                       DESC

  s.homepage         = 'https://github.com/ruixueyun/RXLanguageKit'
  # s.screenshots     = 'www.example.com/screenshots_1', 'www.example.com/screenshots_2'
  #s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'ruixue' => 'xingdonghai@weile.com' }
  s.source           = { :git => 'https://github.com/ruixueyun/RXLanguageKit.git', :tag => s.version.to_s }
  # s.social_media_url = 'https://twitter.com/<TWITTER_USERNAME>'

  s.ios.deployment_target = '12.0'

   #s.source_files = '*.framework/Headers/*.{h,m,plist}'
      #s.source_files = '*.framework'
  
   s.vendored_frameworks = '*.framework'
  
  # s.resource_bundles = {
  #   'RXSDK' => ['RXSDK/Assets/*.png']
  # }
  
  s.pod_target_xcconfig = { 'VALID_ARCHS' => 'x86_64 armv7 arm64' }

end
