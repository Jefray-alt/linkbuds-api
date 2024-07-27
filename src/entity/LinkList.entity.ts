import { User } from './User.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn
} from 'typeorm';

@Entity({ name: 'link_lists' })
export class LinkList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.linkList)
  user: User;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column()
  slug: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
