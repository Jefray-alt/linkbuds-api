import { LinkList } from './LinkList.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne
} from 'typeorm';

@Entity({ name: 'links' })
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => LinkList, (linkList) => linkList.links)
  linkList: LinkList;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
