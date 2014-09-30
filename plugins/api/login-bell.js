exports.register = function (plugin, options, next) {

    plugin.route({
        method: ['GET', 'POST'],
        path: '/login/twitter',
        config: {
            auth: 'twitter',
            pre: [{
                assign: 'user',
                method: function (request, reply) {

                    var User = request.server.plugins.models.User;
                    var twitterId = request.auth.credentials.profile.id;
                    var conditions = {
                        isActive: true,
                        'oauth.twitter': twitterId
                    };

                    User.findOne(conditions, function (err, user) {

                        if (err) {
                            return reply(err);
                        }

                        if (!user) {
                            return reply({
                                message: 'Twitter credentials not found or account is inactive.'
                            }).takeover().code(400);
                        }

                        reply(user);
                    });
                }
            },{
                assign: 'session',
                method: function (request, reply) {

                    var Session = request.server.plugins.models.Session;

                    Session.create(request.pre.user.username, function (err, session) {

                        if (err) {
                            return reply(err);
                        }

                        return reply(session);
                    });
                }
            }]
        },
        handler: function (request, reply) {

            reply({
                user: {
                    _id: request.pre.user._id,
                    username: request.pre.user.username,
                    email: request.pre.user.email,
                    roles: request.pre.user.roles
                },
                session: request.pre.session
            });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'login-bell'
};
