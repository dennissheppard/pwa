module.exports = {
    staticFileGlobs: [
        'styles/**.css',
        'libs/styles/**.css',
        'libs/scripts/**.js',
        '**.html',
        'images/**.*',
        'scripts/**.js'
    ],
    runtimeCaching: [{
        urlPattern: '/*',
        options: {
            origin: 'openlibrary.org',
            cache: {
              maxEntries: 20,
              maxAgeSeconds: 60 * 60 * 24 * 14
            }
        },
        handler: 'cacheFirst'
    }, {
        urlPattern: '/*',
        options: {
            origin: 'firebaseio.com'
        },
        handler: 'networkFirst'
    }, {
        urlPattern: '/*',
        options: {
            origin: 'googleapis.com'
        },
        handler: 'cacheFirst'
    }],
    importScripts: [
        'service-worker.extension.js',
        'scripts/pirate-manager.js',
        'libs/scripts/localforage.min.js'
    ]
};