import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Vinyl } from '../../vinyls/entities/vinyl.entity';

@Entity('purchases')
export class Purchase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({ name: 'vinyl_id', type: 'uuid' })
    vinylId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Vinyl)
    @JoinColumn({ name: 'vinyl_id' })
    vinyl: Vinyl;

    @Column({ name: 'stripe_payment_intent_id', unique: true })
    stripePaymentIntentId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column()
    currency: string;

    @Column({ default: 'pending' })
    status: string; // 'pending', 'succeeded', 'failed', 'refunded'

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
