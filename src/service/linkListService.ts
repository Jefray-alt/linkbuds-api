import { AppDataSource } from '../data-source';
import { Link } from '../entity/Link.entity';
import { LinkList } from '../entity/LinkList.entity';
import { type LinkListPayload } from '../types/payload';

export default class linkListService {
  private readonly linkListRepository;

  constructor() {
    this.linkListRepository = AppDataSource.getRepository(LinkList);
  }

  create(linkList: LinkListPayload): LinkList {
    const createdLink = this.linkListRepository.create(linkList);
    if (linkList.link !== undefined) {
      const links = linkList.link.map((item) => {
        const link = new Link();
        link.url = item.url;
        link.name = item.name;
        return link;
      });

      createdLink.links = links;
    }
    return createdLink;
  }

  async save(linkList: LinkListPayload): Promise<LinkList> {
    const linkListObj = this.create(linkList);
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
      .leftJoinAndSelect('linkList.links', 'link')
      .where('linkList.userId = :userId', { userId })
      .andWhere('linkList.slug = :slug', { slug })
      .getOne();
  }
}
