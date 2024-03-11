const express = require('express');
const path = require('path');
const debug = require('debug');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const history = require('connect-history-api-fallback');

//onst api_mock_files_router = require('./api_mock/api_files');
//const api_mock_users_router = require('./api_mock/api_users');

const webpackConfig = require('./webpack.base.conf.js');

const helper = require('./helper');

if (helper.TARGET.isDevelopment()) {

    const app = express();

    app.use(history({
        htmlAcceptHeaders: ['text/html'/*, 'application/xhtml+xml'*/],
    }));

    // Apply gzip compression
    app.use(compression());

    //Parse
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    const compiler = webpack(webpackConfig);

    console.log('Enabling webpack dev middleware');

    const webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, {
        publicPath: '/',
    });
    app.use(webpackDevMiddlewareInstance);


    app.use(express.static(helper.PATHS.static));
    app.use(express.static(helper.PATHS.src));


    app.listen(helper.ENV.port);

    console.log(`Server is now running at http://${helper.ENV.host}:${helper.ENV.port}`);
}
