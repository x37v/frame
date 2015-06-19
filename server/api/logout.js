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

            Session.findByIdAndDelete(request.auth.credentials.session._id, function (err, session) {

                if (err) {
                    return reply(err);
                }

                if (!session) {
                    return reply({ message: 'Session not found.' }).code(404);
                }

                if (request.auth.session)
                  request.auth.session.clear();
                reply({ message: 'Success.' });
            });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'logout'
};
