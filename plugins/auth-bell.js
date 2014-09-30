var config = require('../config');


exports.register = function (plugin, options, next) {

    plugin.servers.forEach(function (server) {

        server.auth.strategy('twitter', 'bell', {
            provider: 'twitter',
            password: config.get('/cookiePassword'),
            clientId: config.get('/oauth/twitter/key'),
            clientSecret: config.get('/oauth/twitter/secret'),
            isSecure: false
        });
    });


    next();
};


exports.register.attributes = {
    name: 'auth-bell'
};
