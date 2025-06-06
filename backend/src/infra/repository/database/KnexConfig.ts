// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export const development = {
    client: 'mysql2',
    connection: {
        user: 'root',
        password: 'root1',
        host: 'localhost',
        port: 3306,
        database: 'db_splash'
    }
};
export const staging = {
    client: 'postgresql',
    connection: {
        database: 'my_db',
        user: 'username',
        password: 'password'
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: 'knex_migrations'
    }
};
export const production = {
    client: 'postgresql',
    connection: {
        database: 'my_db',
        user: 'username',
        password: 'password'
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: 'knex_migrations'
    }
};