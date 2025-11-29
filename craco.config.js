const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable source map warnings from node_modules
      webpackConfig.ignoreWarnings = [
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource &&
            warning.module.resource.includes('node_modules') &&
            warning.details &&
            warning.details.includes('source-map-loader')
          );
        },
      ];

      // Alternative: Configure source-map-loader to ignore specific packages
      webpackConfig.module.rules.forEach((rule) => {
        if (rule.use) {
          rule.use.forEach((loader) => {
            if (loader.loader && loader.loader.includes('source-map-loader')) {
              loader.options = {
                ...loader.options,
                filterSourceMappingUrl: (url, resourcePath) => {
                  // Ignore source maps from html2pdf.js
                  if (resourcePath.includes('html2pdf.js')) {
                    return false;
                  }
                  return true;
                }
              };
            }
          });
        }
      });

      return webpackConfig;
    },
  },
  jest: {
    configure: (jestConfig) => {
      jestConfig.transformIgnorePatterns = [
        'node_modules/(?!(axios|@emailjs|sweetalert2)/)'
      ];
      jestConfig.moduleNameMapping = {
        '^axios$': require.resolve('axios')
      };
      return jestConfig;
    },
  },
};
