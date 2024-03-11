const fs = require('fs');

module.exports = {
  plugins: {
    autoprefixer: {},
    cssnano: {},
    'css-mqpacker': {},
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      stage: 2,
      browsers:['> 1% and last 2 versions'],
    },
   /* doiuse: {
      browsers:['> 1% and last 2 versions'],
      ignore: ['flexbox', 'outline'],
      onFeatureUsage: function (usageInfo) {
        console.log(usageInfo.message)
      }
    },*/
    'postcss-assets': {
      relative: true,
      loadPaths: ['src/assets/images', 'src/assets/images/icons']
    },
    /*'postcss-class-name-shortener': {
      callback: map => {
        return new Promise(((resolve, reject) => {
          fs.writeFile('./dist/map.json', JSON.stringify(map), err => {
            if (err) reject(err);
            else resolve();
          });
        }))
      }
    },*/
    'immutable-css': {}
  },
};
