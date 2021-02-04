var knex = require('knex')({
    client: 'mysql',

    connection: {
        host: '192.168.88.218',
        port: 33060,
        user: 'root',
        password: 'example',
        database: 'todo'
    }   

});

module.exports = knex