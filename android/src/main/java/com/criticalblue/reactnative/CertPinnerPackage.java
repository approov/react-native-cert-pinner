
package com.criticalblue.reactnative;

import android.util.Log;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.bridge.JavaScriptModule;

import okhttp3.CertificatePinner;

public class CertPinnerPackage implements ReactPackage {
    private static final String TAG = "CertPinnerPackage";

    public CertPinnerPackage() {
        // create custom certificate pinner.
        // needs to use reflection so that class can be generated
        // outside the package library

        CertificatePinner certificatePinner = null;
        try {
            Class noparams[] = {};
            Class clazz = Class.forName("com.criticalblue.reactnative.GeneratedCertificatePinner");
            Method method = clazz.getDeclaredMethod("instance", noparams);
            certificatePinner = (CertificatePinner) method.invoke(null);
            Log.i(TAG, "Generated Certficate Pinner in use");
        } catch(Exception e){
            Log.e(TAG, "No Generated Certficate Pinner found - likely a pinset configuration error");
            Log.w(TAG, "CERTIFICATE PINNING NOT BEING USED");
        }

        OkHttpClientProvider.setOkHttpClientFactory(new PinnedClientFactory(certificatePinner));
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
      return Arrays.<NativeModule>asList(new CertPinnerModule(reactContext));
    }

    // Deprecated from RN 0.47
    public List<Class<? extends JavaScriptModule>> createJSModules() {
      return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
      return Collections.emptyList();
    }
}