module.exports = (api, options) => {
  api.chainWebpack(webpackConfig => {
    const name = api.service.pkg.name

    // the pwa plugin hooks on to html-webpack-plugin
    // and injects icons, manifest links & other PWA related tags into <head>
    webpackConfig
      .plugin('pwa')
        .use(require('./lib/HtmlPwaPlugin'), [Object.assign({
          name
        }, options.pwa)])

    // generate /service-worker.js in production mode
    if (process.env.NODE_ENV === 'production') {
      webpackConfig
        .plugin('workbox')
          .use(require('workbox-webpack-plugin').GenerateSW, [{
            cacheId: name,
            importWorkboxFrom: 'cdn',
            exclude: [
              new RegExp('\.map$'),
              new RegExp('img/icons/'),
              new RegExp('favicon\.ico$'),
              new RegExp('manifest\.json$')
            ]
          }])
    }
  })

  // install dev server middleware for resetting service worker during dev
  const createNoopServiceWorkerMiddleware = require('./lib/noopServiceWorkerMiddleware')
  api.configureDevServer(app => {
    app.use(createNoopServiceWorkerMiddleware())
  })
}
