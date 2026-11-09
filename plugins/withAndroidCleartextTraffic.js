const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withAndroidCleartextTraffic(config) {
  return withAndroidManifest(config, (manifestConfig) => {
    const mainApplication =
      manifestConfig.modResults.manifest.application &&
      manifestConfig.modResults.manifest.application[0];

    if (mainApplication) {
      mainApplication.$ = mainApplication.$ || {};
      // Permite chamadas HTTP locais (ex.: http://192.168.0.6:3333) no APK gerado para Android 9+
      mainApplication.$['android:usesCleartextTraffic'] = 'true';
    }

    return manifestConfig;
  });
};

