const fs = require('fs-extra');
const rimraf = require('rimraf');

const webpack = require('webpack');
const path = require('path');
const debug = require('debug')('app:bin:compile');
const webpackConfig = require('./webpack.build.conf.js');

const helper = require('./helper');

const fail_on_warning = false;

// Wrapper around webpack to promisify its compiler and supply friendly logging
const webpackCompiler = (webpackConfig) =>
    new Promise((resolve, reject) => {
        const compiler = webpack(webpackConfig);
        
        compiler.run((err, stats) => {
            if (err) {
                console.log('Webpack compiler encountered a fatal error.', err);
                return reject(err);
            }
            
            const jsonStats = stats.toJson();
            console.log('Webpack compile completed.');
            console.log(stats.toString(helper.STATS));
            
            if (jsonStats.errors.length > 0) {
                console.log('Webpack compiler encountered errors.');
                console.log(jsonStats.errors.join('\n'));
                return reject(new Error('Webpack compiler encountered errors'));
            } else if (jsonStats.warnings.length > 0) {
                console.log('Webpack compiler encountered warnings.');
                console.log(jsonStats.warnings.join('\n'));
            } else {
                console.log('No errors or warnings encountered.');
            }
            resolve(jsonStats);
        });
    });

const compile = () => {
    console.log('Starting compiler.');
    return Promise.resolve()
        .then(() => webpackCompiler(webpackConfig))
        .then(stats => {
            if (stats.warnings.length && fail_on_warning) {
                throw new Error('Config set to fail on warning, exiting with status code "1".');
            }
            
            console.log('Copying static assets to dist folder.');
            fs.copySync(helper.PATHS.static, helper.PATHS.dist);
            
            //CUSTOM REMOVE
            //cleanup after build some chunks
            if (helper.TARGET.isProduction()) {
                console.log('Cleanup unused assets..');
                if (helper.MODE.isStandalone()) {
                    //Removing Manifest
                    {
                        const manifest_chunk_name = stats.assetsByChunkName[ 'manifest' ];
                        const file_path = path.join(helper.PATHS.dist, manifest_chunk_name);
                        if (fs.existsSync(file_path)) {
                            console.log('Removing inlined webpack manifest file: ', manifest_chunk_name);
                            fs.unlinkSync(file_path);
                        }
                    }
                } else if (helper.MODE.isIntegrated()) {
                    //Removing lazy standalone folder
                    {
                        console.log('Removing "lazy/" standalone folder');
                        rimraf.sync(path.join(helper.PATHS.dist, 'lazy'));
                    }
                }
            }
            
        })
        .then(() => {
            console.log('Compilation completed successfully.');
        })
        .catch((err) => {
            console.log('Compiler encountered an error.', err);
            process.exit(1);
        });
};

compile();
