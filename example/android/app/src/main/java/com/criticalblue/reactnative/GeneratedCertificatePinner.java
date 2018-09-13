package com.criticalblue.reactnative;

import okhttp3.CertificatePinner;

public class GeneratedCertificatePinner {
    public static CertificatePinner instance() {
        CertificatePinner.Builder builder = new CertificatePinner.Builder();

        builder.add("*.approovr.io", "sha256/0000000000000000000000000000000000000000000=");
        builder.add("*.approovr.io", "sha256/1111111111111111111111111111111111111111111=");
        builder.add("*.approovr.io", "sha256/oq+Uj+2TYMg13txh1pXW0/VLAkonU3TnoPr5hfxPZVc=");
        builder.add("*.approovr.io", "sha256/8Rw90Ej3Ttt8RRkrg+WYDS9n7IS03bk5bjP/UXPtaY8=");

        return builder.build();
    }
}
