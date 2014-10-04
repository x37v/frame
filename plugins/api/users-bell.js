exports.register = function (plugin, options, next) {

    plugin.route({
        method: ['GET', 'POST'],
        path: '/users/my/connect/twitter',
        config: {
            auth: {
                strategies: ['simple', 'twitter'], // this doesn't work
                scope: ['admin', 'account']
            }
        },
        handler: function (request, reply) {

            reply('hey there friend');
        }
    });


    next();
};


exports.register.attributes = {
    name: 'users-bell'
};
