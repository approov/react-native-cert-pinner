
package com.criticalblue.reactnative;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.modules.network.OkHttpClientProvider;

public class CertPinnerModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;

  public CertPinnerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
 }

  @Override
  public String getName() {
    return "CertPinner";
  }
}