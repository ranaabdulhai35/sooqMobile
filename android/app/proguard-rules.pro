# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

-keep class com.google.android.gms.maps.** { *; }
-keep interface com.google.android.gms.maps.** { *; }
-keep class com.google.maps.android.** { *; }

# Keep rules for MyFatoorah SDK
-keep class com.myfatoorah.sdk.** { *; }

# Keep MyFatoorah SDK classes and methods
-keep class com.myfatoorah.** { *; }
-keep class com.myfatoorahreactnative.** { *; }
-keepattributes *Annotation*

# Keep model classes used by MyFatoorah SDK
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# Keep any Parcelable implementations (if used)
-keepclassmembers class * implements android.os.Parcelable {
  public static final android.os.Parcelable$Creator *;
}


