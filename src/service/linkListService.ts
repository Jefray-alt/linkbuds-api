import { AppDataSource } from '../data-source';
import { Link } from '../entity/Link.entity';
import { LinkList } from '../entity/LinkList.entity';
import { type LinkListPayload } from '../types/payload';
import { BadRequestErrror } from '../utils/errors';

export default class linkListService {
  private readonly linkListRepository;
  private readonly linkRepository;

  constructor() {
    this.linkListRepository = AppDataSource.getRepository(LinkList);
    this.linkRepository = AppDataSource.getRepository(Link);
  }

  async create(linkList: LinkListPayload): Promise<LinkList> {
    const linkListQB = this.linkListRepository.createQueryBuilder('linkList');
    const isLinkListExists = await linkListQB
      .select()
      .where('linkList.slug = :slug', { slug: linkList.slug })
      .andWhere('linkList.user = :user', { user: linkList.user.id })
      .getOne();

    if (isLinkListExists !== null) {
      throw new BadRequestErrror(
        `Slug ${linkList.slug} already exists for user ${linkList.user.id}`
      );
    }
    return this.linkListRepository.create(linkList);
  }

  async save(linkList: LinkListPayload): Promise<LinkList> {
    const linkListObj = await this.create(linkList);
    return await this.linkListRepository.save(linkListObj);
  }

  async findByUser(userId: string, page: number = 1): Promise<LinkList[]> {
    const take = 10;
    const skip = (page - 1) * take;
    const linkListQB = this.linkListRepository.createQueryBuilder('linkList');
    return await linkListQB
      .select()
      .where('linkList.userId = :userId', { userId })
      .take(10)
      .skip(skip)
      .getMany();
  }

  async findOneBySlug(userId: string, slug: string): Promise<LinkList | null> {
    const linkListQB = this.linkListRepository.createQueryBuilder('linkList');
    return await linkListQB
      .select()
      .where('linkList.userId = :userId', { userId })
      .andWhere('linkList.slug = :slug', { slug })
      .getOne();
  }

  async softDeleteBySlug(userId: string, slug: string): Promise<number> {
    const linkListQB = this.linkListRepository.createQueryBuilder('linkList');
    const result = await linkListQB
      .softDelete()
      .where('userId = :userId', { userId })
      .andWhere('slug = :slug', { slug })
      .execute();

    if (
      result.affected === 0 ||
      result.affected === null ||
      result.affected === undefined
    ) {
      return 0;
    }

    return result.affected;
  }

  async updateBySlug(userId: string, link: LinkList): Promise<LinkList | null> {
    const linkListQB = this.linkListRepository.createQueryBuilder('linkList');
    await linkListQB
      .update()
      .set({ ...link })
      .where('slug = :slug', { slug: link.slug })
      .execute();

    return await this.findOneBySlug(userId, link.slug);
  }
}
