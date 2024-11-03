import { createPool } from 'mysql2';
import { Kysely, MysqlDialect } from 'kysely';

const dialect = new MysqlDialect({
    pool: createPool({
        database: 'creative_fabrica',
        host: 'database-1.c964qs46yibj.us-west-2.rds.amazonaws.com',
        user: 'admin',
        password: process.env.DB_PASSWORD,
        port: 3306,
        connectionLimit: 10,
    }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<any>({
    dialect,
    log: ['query', 'error'],
});
