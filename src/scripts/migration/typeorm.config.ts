import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { SeedVinyls1743000000000 } from './1743000000000-SeedVinyls';

config();

export default new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'vinyl_shop',

    entities: [],

    migrations: [SeedVinyls1743000000000],
    synchronize: false
});
