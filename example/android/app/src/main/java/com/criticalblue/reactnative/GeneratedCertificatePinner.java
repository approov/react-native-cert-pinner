package com.criticalblue.reactnative;

import okhttp3.CertificatePinner;

public class GeneratedCertificatePinner {
    public static CertificatePinner instance() {
        CertificatePinner.Builder builder = new CertificatePinner.Builder();

        builder.add("*.approovr.io", "sha256/oq+Uj+2TYMg13txh1pXW0/VLAkonU3TnoPr5hfxPZVc=");
        builder.add("*.approovr.io", "sha256/8Rw90Ej3Ttt8RRkrg+WYDS9n7IS03bk5bjP/UXPtaY8=");
//      builder.add("*.approovr.io", "sha256/XXXXj+2TYMg13txh1pXW0/VLAkonU3TnoPr5hfxPXXX=");
//      builder.add("*.approovr.io", "sha256/XXXX0Ej3Ttt8RRkrg+WYDS9n7IS03bk5bjP/UXPtXXX=");

        return builder.build();
    }
}
