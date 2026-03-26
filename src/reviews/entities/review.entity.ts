import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    JoinColumn
} from 'typeorm';
import { Vinyl } from '../../vinyls/entities/vinyl.entity';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ name: 'vinyl_id', type: 'uuid' })
    vinylId: string;

    @Index()
    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @ManyToOne(() => Vinyl, (vinyl) => vinyl.reviews, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'vinyl_id' })
    vinyl: Vinyl;

    @Column({ type: 'text' })
    comment: string;

    @Column({ type: 'int' })
    score: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
