module.exports = {
    dev: {
        sessionSecret: 'developmentSessionSecret',
        db: {
            name: 'anOutlandishDatabase',
            host: 'localhost',
            username: '',
            password: ''
        }
    },

    prod: {
        sessionSecret: 'productionSessionSecret',
        db: {
            name: 'anOutlandishDatabase',
            host: 'productionHost',
            username: 'productionDatabaseUsername',
            password: 'productionDatabasePassword'
        }
    }
};