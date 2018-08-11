
# react-native-cert-pinner

## Getting started

`$ npm install react-native-cert-pinner --save`

### Mostly automatic installation

`$ react-native link react-native-cert-pinner`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-cert-pinner` and add `CertPinner.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libCertPinner.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.criticalblue.reactnative.CertPinnerPackage;` to the imports at the top of the file
  - Add `new CertPinnerPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-cert-pinner'
  	project(':react-native-cert-pinner').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-cert-pinner/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-cert-pinner')
  	```


## Usage
```javascript
import CertPinner from 'react-native-cert-pinner';

// TODO: What to do with the module?
CertPinner;
```
  