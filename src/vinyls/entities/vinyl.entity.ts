import { Review } from 'src/reviews/entities/review.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity('vinyls')
export class Vinyl {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ name: 'author_name' })
    authorName: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ name: 'image_url', nullable: true })
    imageUrl: string;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @Column({ name: 'is_available', default: true })
    isAvailable: boolean;

    // Связь с отзывами
    @OneToMany(() => Review, (review) => review.vinyl)
    reviews: Review[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    averageScore?: number;
    firstReview?: any;
}

//add review later

/*
    - id (PK)
    - name
    - author_name
    - description
    - price (decimal)
    - image_url
    - stock (integer, default: 0)
    - is_available (boolean, default: true)
    - created_at
    - updated_at
    */
