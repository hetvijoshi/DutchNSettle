require('dotenv').config();

exports.appConfig = {
    projectId: process.env.GOOGLE_PROJECTID,
    app: {
        port: process.env.DEV_APP_PORT || 3000,
        appName: process.env.APP_NAME || '',
        env: process.env.NODE_ENV || 'development',
    },
    db: {
        url: process.env.MONGO_URL,
        db: process.env.MONGO_DATABASE,
        port: process.env.MONGO_PORT,
        mongoUser: process.env.MONGO_USERNAME,
        mongoPassword: process.env.MONGO_PASSWORD,
    },
    auth: {
        google: {
            clientID: process.env.GOOGLE_CLIENTID || '',
            clientSecret: process.env.GOOGLE_CLIENTSECRET || ''
        }
    },
    pubsub: {
        topicId: process.env.GOOGLE_PUBSUB_TOPICID
    }
};