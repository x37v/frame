var Hoek = require('hoek');


exports.register = function (server, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);


    server.route({
        method: 'DELETE',
        path: options.basePath + '/logout',
        config: {
            auth: {
                mode: 'try',
                strategy: 'simple'
            }
        },
        handler: function (request, reply) {

            if (!request.auth.credentials || !request.auth.credentials.user) {
                return reply({ message: 'Session not found.' }).takeover().code(404);
            }

            var Session = request.server.plugins['hapi-mongo-models'].Session;
            var query = {
                userId: request.auth.credentials.user._id.toString()
            };

            Session.deleteMany(query, function (err, count) {

                if (err) {
                    return reply(err);
                }

                if (count === 0) {
                    return reply({ message: 'Session not found.' }).code(404);
                }

                reply({ message: 'Success.' });
            });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'logout'
};
