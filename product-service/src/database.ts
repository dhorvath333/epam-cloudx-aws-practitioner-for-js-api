import { Pool } from 'pg';

export function getDataBase() {
    const { RDS_HOSTNAME, RDS_DATABASE, RDS_PORT, RDS_USERNAME, RDS_PASSWORD } = process.env;

    const pool = new Pool({
        host: RDS_HOSTNAME,
        database: RDS_DATABASE,
        port: RDS_PORT,
        user: RDS_USERNAME,
        password: RDS_PASSWORD,
    });

    return pool;
}