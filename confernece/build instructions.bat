cordova build --release android
cd platforms\android\build\outputs\apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore android-release-unsigned.apk alias_name
zipalign -v 4 android-release-unsigned.apk cremaCafe.apk