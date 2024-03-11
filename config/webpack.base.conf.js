const path = require('path');
const moment = require('moment');
const webpack = require('webpack');
const chalk = require('chalk');
const jsonFile = require('jsonfile');
const _ = require('lodash');
const find = require('find');

const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const cssnano = require('cssnano');

const helper = require('./helper');
const pkg = require('./../package.json');
const config = require(helper.DEPLOY.getBootstrapConfigPath());
const current_theme = 'dark';

const INITIAL_STYLES_INLINE_ENTRIES = [
  path.resolve(helper.PATHS.fonts, 'averta/averta-std-bold.css'),
  path.resolve(helper.PATHS.fonts, 'averta/averta-std-light.css'),
  path.resolve(helper.PATHS.fonts, 'averta/averta-std-regular.css'),
  path.resolve(helper.PATHS.fonts, 'gotham/GothamNarrow-Book.css'),
];

const optimization = {
  minimize: helper.TARGET.isProduction(),
  usedExports: true,
  splitChunks: {
    minSize: 5000,
    cacheGroups: {
      scripts: {
        name: 'tcfw-showcase-edit',
        test: /^.*(js|jsx)$/s,
        chunks: 'all',
      },
      commonStyles: {
        name: 'tcfw-showcase-edit',
        test: /^((?!_theme_).)*(less|css)$/s,
        chunks: 'all',
      },
      darkThemeStyles: {
        name: 'themes/tcfw-showcase-edit_theme_dark',
        test: /(.*?)([_.]theme[_.]dark)(.*?)(.less)$/s,
        chunks: 'all',
      },
      lightThemeStyles: {
        name: 'themes/tcfw-showcase-edit_theme_light',
        test: /(.*?)([_.]theme[_.]light)(.*?)(.less)$/s,
        chunks: 'all',
      },
    }
  }
};

//js|jsx loader
const jsxLoader = {
  test: /\.(js|jsx)?$/,
  include: [
    helper.PATHS.src,
    path.resolve(helper.PATHS.config, 'bootstrap'),
    path.resolve(helper.PATHS.root, 'node_modules/redux-thunk-routine'),
    path.resolve(helper.PATHS.root, 'node_modules/simple-abortable-promise/dist/'),
  ],
  use: [
    {
      loader: 'babel-loader',
      options: helper.BABEL_RC,
    },
  ],
};

const svgsLoader = {
  test: /\.svg$/,
  include: [
    helper.PATHS.src,
  ],
  exclude: [
    /(node_modules)/,
    helper.PATHS.fonts,
  ],
  use: [
    {
      loader: 'svg-sprite-loader',
      options: {},
    },
    {
      loader: 'svg-transform-loader',
      options: {},
    },
  ],
};

const stylesLoader = {
  test: /\.(less|css)$/,
  include: [
    helper.PATHS.src,
    ...INITIAL_STYLES_INLINE_ENTRIES,
  ],
  exclude: [
    /(node_modules)/,
  ],
  use: helper.TARGET.isDevelopment()
    ? [
      {
        loader: 'style-loader',
      },
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
        },
      },
      {
        loader: 'less-loader',
        options: {
          sourceMap: true,
        },
      },
    ]
    : [
       MiniCssExtractPlugin.loader,
       'css-loader',
        {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [
              cssnano(),
            ],
          }
        },
      },
      'less-loader',
    ],
};

const skeletonLoader = {
  test: /\.(js|jsx)$/,
  include: helper.PATHS.src,
  exclude: [
    /(node_modules)/, /*, /(.*?)([_.]theme[_.])(.*?)(.less)/*/
  ],
  use: [
    {
      loader: 'skeleton-loader',
      options: {
        procedure: function (content, options, callback) {

          const file_folder = this.context;

          const file_fullname = path.basename(this.resourcePath);
          const importRegexp = /import.*less';/;
          const matchesPromise = new Promise((resolve, reject) => {
            const matches = content.match(importRegexp);
            const lessFileImport = !_.isEmpty(matches) && matches.find(item => {
              return item.match(/\.(less)/);
            });

            if (lessFileImport) {
              const lessFileFullname = path.basename(this.resourcePath);
              const lessFileName = path.parse(lessFileFullname).name;
              const themeLessRegExp = new RegExp(`(.*?)(${lessFileName}[_.]theme[_.])(.*?)(.less)` + '$');


              find.file(themeLessRegExp, this.context, (files) => {
                const themes_files = files.map(file => {
                  return file.replace(file_folder, './').replace(/\\/g, '/');
                });


                const _replacement = themes_files.map((file) => {
                  const _matches = themeLessRegExp.exec(file);
                  const _matched_theme_name = _matches[3];
                  if (_matched_theme_name) {
                    //async-lazy
                    if (helper.MODE.isStandalone()) {
                      //language=JavaScript
                      return `
                      ((theme_name) => {
                          switch (theme_name) {
                              case('${_matched_theme_name}'): {
                                  import(
                                      /* webpackChunkName: "lazy/lazy.widget.styles_theme_${_matched_theme_name}" */
                                      /* webpackMode: "lazy" */
                                      '${file}'
                                      ).then((style) => { style && style.use && style.use(); });
                                  break;
                              }

                              default: {
                                  break;
                              }
                          }

                      })(
                          "${current_theme}"
                      );
                  `;
                    }

                    //NON-asyc-lazy
                    if (helper.MODE.isIntegrated()) {
                      //language=JavaScript
                      return `import '${file}';`;
                    }
                  }

                  return '';
                });

                const _initialLessImport = matches[0];
                const _content = content.replace(_initialLessImport, `${_initialLessImport}${_replacement.join(' ')}`);

                resolve(_content);
              });
            } else {
              resolve(content);
            }
          });

          matchesPromise.then((_content) => {
            callback(null, _content);
          });

        },
      },
    },
  ],
};

const fontsLoader = {
  test: /\.(eot|svg|ttf|woff|woff2|svg)$/,
  include: helper.PATHS.fonts,
  use: [
    {
      loader: 'file-loader',
      options:
      helper.MODE.isIntegrated()
        ?
        {
          publicPath: (url, resourcePath, context) => {
            const path = resourcePath.replace(`${helper.PATHS.assets}/`, '');
            const fullPath = `${config.cdnUrl}${path}`;

            return fullPath;
          },
          name: 'fonts/[name].[ext]',
        }
        :
        {
          outputPath: 'assets/fonts',
        },
    },
  ],
}

const webpackConfig = {
  entry: {},
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.css',
      '.less',
    ],
    alias: {
      '@': helper.PATHS.src,
      config: helper.DEPLOY.getBootstrapConfigPath(),
      store: path.join(helper.PATHS.src, 'store/store.js'),
    }
  },
  optimization,
  mode: helper.TARGET.isDevelopment() ? 'development' : 'production',
  devtool: helper.DEVTOOL,
  target: ['web', 'es5'],
  module: {
    rules: [
      jsxLoader,
      stylesLoader,
      svgsLoader,
      fontsLoader,
      skeletonLoader,
    ]
  },
  plugins: [
  ],
};


// ------------------------------------
// Conditional Entry Points
// ------------------------------------
if (helper.TARGET.isDevelopment()) {
  Object.assign(webpackConfig, {
    entry: {
      polyfills: ['@babel/polyfill'],
      widget: [
        helper.ENTRY_POINTS.index,
      ],
      styles: [
        ...INITIAL_STYLES_INLINE_ENTRIES,
        helper.ENTRY_POINTS.standalone_styles,
      ],
      svgs: [
        ...helper.ENTRY_POINTS.svgs,
      ],
    },
  });
} else if (helper.TARGET.isProduction() || helper.TARGET.isStats()) {
  if (helper.MODE.isStandalone()) {
    Object.assign(webpackConfig, {
      entry: {
        widget: [
          ...helper.ENTRY_POINTS.svgs,
          ...INITIAL_STYLES_INLINE_ENTRIES,
          helper.ENTRY_POINTS.standalone_styles,
          helper.ENTRY_POINTS.index,
        ]
      },
    });
  }

  if (helper.MODE.isIntegrated()) {
    Object.assign(webpackConfig, {
      entry: {
        'tcfw-showcase-edit': [
          'react-beautiful-dnd',
          ...helper.ENTRY_POINTS.svgs,
          ...INITIAL_STYLES_INLINE_ENTRIES,
          helper.ENTRY_POINTS.integrated_styles,
          helper.ENTRY_POINTS.index,
        ]
      },
    });
  }
}

// ------------------------------------
// Conditional Externals
// ------------------------------------
 if (helper.TARGET.isProduction() || helper.TARGET.isStats()) {
  if (helper.MODE.isIntegrated()) {
    Object.assign(webpackConfig, {
      externals:
        Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })
          .reduce((accumulator, dependency, version) => {
            if (dependency !== 'react-beautiful-dnd') {
              accumulator[dependency] = dependency;
            }
            return accumulator;
          }, {}),
    });
  }
}

// ------------------------------------
// Conditional Output
// ------------------------------------
if (helper.TARGET.isDevelopment()) {
  Object.assign(webpackConfig, {
    output: {
      path: '/',
      filename: '[name].js',
    },
  });
} else if (helper.TARGET.isProduction() || helper.TARGET.isStats()) {
  if (helper.MODE.isStandalone()) {
    Object.assign(webpackConfig, {
      output: {
        path: helper.PATHS.dist,
        publicPath: helper.PATHS.dist_prefix,
        filename: `[name].${helper.COMPILER_HASH_TYPE}.js`,
        chunkFilename: `[name].${helper.COMPILER_HASH_TYPE}.js`,
      },
    });
  }
  if (helper.MODE.isIntegrated()) {
    Object.assign(webpackConfig, {
      output: {
        path: helper.PATHS.dist,
        filename: `[name].js`,
        chunkFilename: `[name].js`,
        libraryTarget: 'umd',
        library: 'tcfw-showcase-edit',
      },
    });
  }
}

//Output themes CSS to files
if (helper.MODE.isIntegrated()) {
  webpackConfig.plugins.push(new MiniCssExtractPlugin());
}

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins.push(new ProgressBarPlugin({
    format: chalk.cyan.bold('  build [:bar] ') + chalk.green.bold(':percent') + ' (:elapsed seconds)' + chalk.gray.bold(' :msg... '),
  }));
  webpackConfig.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // saves ~100k from build
);


// ------------------------------------
// Plugins - Conditional Index
// ------------------------------------
if (helper.MODE.isStandalone()) {
  webpackConfig.plugins.push(new HtmlWebpackPlugin({
    template: `ejs-compiled-loader!${path.join(helper.PATHS.src, 'index.ejs')}`,
    filename: 'index.html',
    title: 'Show case',
    inject: 'body',
    minify: helper.MINIFY ? {
      removeComments: true,
      collapseWhitespace: true,
    } : false,
  }));
}

// Setting DefinePlugin affects React library size!
webpackConfig.plugins.push(new webpack.DefinePlugin({
  'process.env.NODE_ENV': helper.TARGET.isDevelopment() ?
    JSON.stringify('development') :
    JSON.stringify('production'),

  'process.env.MODE': helper.MODE.isStandalone() ?
    JSON.stringify('standalone') :
    JSON.stringify('integrated'),
  APP_VERSION: JSON.stringify(pkg.version),
  config: JSON.stringify(require(helper.DEPLOY.getBootstrapConfigPath())),
}));


// ------------------------------------
// Conditional Plugins
// ------------------------------------
if (helper.TARGET.isDevelopment()) {
  webpackConfig.plugins.push(new SpriteLoaderPlugin({ plainSprite: true }));
}

// ------------------------------------
// Distribute
// ------------------------------------
if (helper.MODE.isIntegrated()) {
  webpackConfig.plugins.push(
    new WebpackShellPluginNext({
      onBuildEnd: stats => {
        //Create package.json
        jsonFile.writeFileSync(
          path.join(helper.PATHS.dist, 'package.json'),
          {
            "name": pkg.private_prefix + pkg.name,
            "version": pkg.version,
            "peerDependencies": _.chain(pkg.peerDependencies)
              .reduce((accumulator, version, dependency_name) => {
                if (
                  (dependency_name.indexOf('redux-devtools') < 0) &&
                  (dependency_name.indexOf('react-notification-system') < 0) &&
                  (dependency_name.indexOf('pusher-js') < 0) &&
                  (dependency_name.indexOf('axios') < 0)
                ) {
                  accumulator[dependency_name] = version;
                }
                return accumulator;
              }, {})
              .value(),
            main: './tcfw-showcase-edit.js',
          },
          { spaces: 4, EOL: '\r\n' }
        );
      }
    })
  );
}

module.exports = webpackConfig;
