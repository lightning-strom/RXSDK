#
# Be sure to run `pod lib lint RXSDK.podspec' to ensure this is a
# valid spec before submitting.
#
# Any lines starting with a # are optional, but their use is encouraged
# To learn more about a Podspec see https://guides.cocoapods.org/syntax/podspec.html
#

Pod::Spec.new do |s|
  s.name             = 'RXBDASignalSDK'
  s.version          = '3.8.1'
  s.summary          = 'ruixue RXBDASignalSDK framework.'

# This description is used to generate tags and improve searc results.
#   * Think: What does it do? Why did you write it? What is the focus?
#   * Try to keep it short, snappy and to the point.
#   * Write the description between the DESC delimiters below.
#   * Finally, don't worry about the indent, CocoaPods strips it!

  s.description      = <<-DESC
TODO: Add long description of the pod here.
                       DESC

  s.homepage         = 'https://github.com/ruixueyun/RXBDASignalSDK'
  # s.screenshots     = 'www.example.com/screenshots_1', 'www.example.com/screenshots_2'
  #s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'ruixue' => 'xingdonghai@weile.com' }
  s.source           = { :git => 'https://github.com/ruixueyun/RXBDASignalSDK.git', :tag => s.version.to_s }

  s.ios.deployment_target = '12.0'
  
   s.vendored_frameworks = '*.framework'
  
  # s.resource_bundles = {
  #   'RXSDK' => ['RXSDK/Assets/*.png']
  # }
  
  s.pod_target_xcconfig = { 'VALID_ARCHS' => 'x86_64 armv7 arm64' }
  
#
  s.platform = :ios, '12.0'
  s.dependency 'BDASignalSDK'
  s.dependency 'Protobuf'
  
end
