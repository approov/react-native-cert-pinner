package com.criticalblue.reactnative;

import com.facebook.react.modules.network.OkHttpClientFactory;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.react.modules.network.ReactCookieJarContainer;

import java.util.concurrent.TimeUnit;

import okhttp3.CertificatePinner;
import okhttp3.OkHttpClient;

public class PinnedClientFactory implements OkHttpClientFactory {
    private CertificatePinner certificatePinner;

    public PinnedClientFactory(CertificatePinner certificatePinner) {
        this.certificatePinner = certificatePinner;
    }

    @Override
    public OkHttpClient createNewNetworkModuleClient() {
        OkHttpClient.Builder client = new OkHttpClient.Builder()
                .connectTimeout(0, TimeUnit.MILLISECONDS)
                .readTimeout(0, TimeUnit.MILLISECONDS)
                .writeTimeout(0, TimeUnit.MILLISECONDS)
                .cookieJar(new ReactCookieJarContainer());

        if (certificatePinner != null) {
            client.certificatePinner(certificatePinner);
        }
        

        return OkHttpClientProvider.enableTls12OnPreLollipop(client).build();
    }
}

// end of file
