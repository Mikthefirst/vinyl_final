/* eslint-disable quotes */
import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuid } from 'uuid';

export class SeedVinyls1743000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const now = new Date();

        const existingVinyls = (await queryRunner.query(
            `SELECT COUNT(*) as count FROM vinyls`
        )) as Array<{ count: string }>;
        const count =
            existingVinyls.length > 0 ? parseInt(existingVinyls[0].count) : 0;

        if (count > 0) {
            console.log(
                `Found ${count} existing vinyl records. Skipping seed.`
            );
            return;
        }

        const vinyls = [
            ['Abbey Road', 'The Beatles', 29.99],
            ['The Dark Side of the Moon', 'Pink Floyd', 34.99],
            ['Led Zeppelin IV', 'Led Zeppelin', 32.99],
            ['Hotel California', 'Eagles', 27.99],
            ['Back in Black', 'AC/DC', 28.99],
            ['The Wall', 'Pink Floyd', 36.99],
            ['Rumours', 'Fleetwood Mac', 31.99],
            ['Nevermind', 'Nirvana', 26.99],
            ['Ten', 'Pearl Jam', 25.99],
            ['OK Computer', 'Radiohead', 32.99],
            ['In Rainbows', 'Radiohead', 31.99],
            ['Is This It', 'The Strokes', 26.99],
            ['Discovery', 'Daft Punk', 34.99],
            ['Random Access Memories', 'Daft Punk', 36.99],
            ['Immunity', 'Jon Hopkins', 31.99],
            ['Thriller', 'Michael Jackson', 29.99],
            ['Bad', 'Michael Jackson', 27.99],
            ['Purple Rain', 'Prince', 28.99],
            ['Like a Prayer', 'Madonna', 24.99],
            ['Kind of Blue', 'Miles Davis', 33.99],
            ['A Love Supreme', 'John Coltrane', 35.99],
            ['Time Out', 'Dave Brubeck', 29.99],
            ['Blue Train', 'John Coltrane', 31.99],
            ['Getz/Gilberto', 'Stan Getz & João Gilberto', 27.99],
            ['Illmatic', 'Nas', 26.99],
            ['To Pimp a Butterfly', 'Kendrick Lamar', 34.99],
            ['Good Kid, M.A.A.D City', 'Kendrick Lamar', 32.99],
            ['My Beautiful Dark Twisted Fantasy', 'Kanye West', 35.99],
            ['Channel Orange', 'Frank Ocean', 30.99],
            ['Lemonade', 'Beyoncé', 33.99],
            ['Back to Black', 'Amy Winehouse', 27.99],
            ['Songs in the Key of Life', 'Stevie Wonder', 32.99],
            ['Whats Going On', 'Marvin Gaye', 28.99],
            ['Funeral', 'Arcade Fire', 28.99],
            ['Turn on the Bright Lights', 'Interpol', 25.99],
            ['Cross', 'Justice', 29.99],
            ['Selected Ambient Works 85-92', 'Aphex Twin', 33.99],
            ['Texas Flood', 'Stevie Ray Vaughan', 29.99],
            ['The Complete Recordings', 'Robert Johnson', 38.99],
            ['Im Your Man', 'Leonard Cohen', 27.99]
        ];

        // Генерация VALUES
        const values: any[] = [];
        const placeholders: string[] = [];

        vinyls.forEach((v, index) => {
            const baseIndex = index * 10;

            const id = uuid();

            values.push(
                id, // id
                v[0], // name
                v[1], // author_name
                null, // description
                v[2], // price
                null, // image_url
                50, // stock
                true, // is_available
                now, // created_at
                now // updated_at
            );

            placeholders.push(
                `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7}, $${baseIndex + 8}, $${baseIndex + 9}, $${baseIndex + 10})`
            );
        });

        await queryRunner.query(
            `
            INSERT INTO vinyls 
            (id, name, author_name, description, price, image_url, stock, is_available, created_at, updated_at)
            VALUES ${placeholders.join(',')}
            `,
            values
        );

        console.log(`Seeded ${vinyls.length} vinyl records`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM vinyls WHERE name IN (
                'Abbey Road','The Dark Side of the Moon','Led Zeppelin IV',
                'Hotel California','Back in Black','The Wall','Rumours',
                'Nevermind','Ten','OK Computer','In Rainbows','Is This It',
                'Discovery','Random Access Memories','Immunity','Thriller',
                'Bad','Purple Rain','Like a Prayer','Kind of Blue',
                'A Love Supreme','Time Out','Blue Train','Getz/Gilberto',
                'Illmatic','To Pimp a Butterfly','Good Kid, M.A.A.D City',
                'My Beautiful Dark Twisted Fantasy','Channel Orange','Lemonade',
                'Back to Black','Songs in the Key of Life','Whats Going On',
                'Funeral','Turn on the Bright Lights','Cross',
                'Selected Ambient Works 85-92','Texas Flood',
                'The Complete Recordings','Im Your Man'
            )
        `);

        console.log('Seed rollback completed');
    }
}
