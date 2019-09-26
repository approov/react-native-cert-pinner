require 'json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "CertPinner"
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']

  s.authors      = package['author']
  s.homepage     = package['repository']['url']
  s.platform     = :ios, "9.0"
  s.ios.deployment_target = '9.0'
  s.source       = { :git => "https://github.com/arifaydogmus/react-native-cert-pinner.git", :tag => "master" }
  s.source_files  = "CertPinner/**/*.{h,m}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency "TrustKit"
end
