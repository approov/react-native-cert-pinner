
# react-native-cert-pinner

This package manages TLS certificate pinning in react-native for Android and iOS.

## Getting started

`$ npm install react-native-cert-pinner --save`

### Mostly automatic installation

`$ react-native link react-native-cert-pinner`

### Manual installation

#### iOS

Add the following line to the project targets in your `Podfile`:

```
pod 'TrustKit', '~> 1.4.2'
```

Then run pod install.

#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`
  - Add `import com.criticalblue.reactnative.CertPinnerPackage;` to the imports at the top of the file
  - Add `new CertPinnerPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-cert-pinner'
  	project(':react-native-cert-pinner').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-cert-pinner/android')
  	``` 
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-cert-pinner')
  	```

## Usage

To use the react-native networking utilities, like `fetch()`, certificate pinning must be done in the native app before the app's react-native javascript is run.

Unlike typical installed packages, there is no need to require any modules in the javascript. Everything is setup and enforced inside the native module.

### Certificate Pinning Configuration

A `pinset` utility is provided to help configure the native modules for pinning.

The default setup assumes you are running in your project's home directory. The default configuration file is `./pinset.json`, and the default native android project is assumed to be located at `./android`. Both these locations may be overriden on the command line.

#### Command Help

To get help:

```
$ npx pinset -h

    pinset [command] [options]

      init ..... initialize pinset configuration
      gen ...... generate pinset configuration
      version .. show package version
      help ..... show help menu for a command
```

or for a sub-command:

```
$ npx pinset help gen

    pinset gen [options] [config]

      --android, -a <path> .. path to Android project (defaults to './android')
      --ios, -i <path> ...... path to iOS project (defaults to './ios')
      --force, -f ........... always overwrite existing configuration

      config ................ configuration file - defaults to 'pinset.json'
```

#### Initialization

The first step is to generate a starter configuration:

```
$ npx pinset init
```

This command will not overwrite an existing configuration file unless the `--force` flag is used.

#### Lookup

Next, determine which URLs you want to pin, and determine each certificate's public key hash. A convenient utility is provided by __Report URI__ at [https://report-uri.com/home/pkp_hash](https://report-uri.com/home/pkp_hash). Enter a URL to see the current chain of certificate hashes.

Enter the desired public key hashes into the `pinset.json` file:

```json
{
  "domains": {
    "*.approov.io": {
      "pins": [
        "sha256/0000000000000000000000000000000000000000000",
        "sha256/1111111111111111111111111111111111111111111"
      ]
    },
    "*.criticalblue.com": {
      "pins": [
        "sha256/2222222222222222222222222222222222222222222",
        "sha256/3333333333333333333333333333333333333333333"
      ]
    }
  }
}
```

Domains starting with`*.` will include all subdomains.

It is recommended to select multiple hashes with at least one of them being from an intermediate certificate.

#### Generation

Once the configuration is set, generate the native project sources:

```
$ npx pinset gen
Reading config file './pinset.json'.
Updating java file './android/app/src/main/java/com/criticalblue/reactnative/GeneratedCertificatePinner.java'.
Updating plist file './ios/example/info.plist'.
```

Build and run the react-native app, for example:

```
$ react-native run-ios
```

#### Updates

To update the certificate pins, edit the configuration file, regenerate the native sources, and rebuild the app.

Note, there is no way to update the pin sets from javascript while the app is running.

### Certificate Security

If you consider publishing hashes of public key certificates to be a security breach, you may want to remove or ignore the pinset configuration and generated fines from your repository.

To ignore the default files in a git repository, add to `.gitignore`:

```
# default configuration file
./pinset.json

# default generated android source
./android/app/src/main/java/com/criticalblue/reactnative/GeneratedCertificatePinner.java
./ios/<your project here>/info.plist
```

## Future Enhancements

- Automatically regenerate native source files whenever the pin set configuration changes.
- Add source regeneration and git ignores to the mostly automatic react-native linking step.
- Add certificate lookup to the `pinset` utility.
- Better secure pinset information within the app.
