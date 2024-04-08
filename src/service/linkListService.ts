import { AppDataSource } from '../data-source';
import { LinkList } from '../entity/LinkList.entity';
import { type LinkListPayload } from '../types/payload';

export default class linkListService {
  private readonly linListRepository;

  constructor() {
    this.linListRepository = AppDataSource.getRepository(LinkList);
  }

  create(linkList: LinkListPayload): LinkList {
    return this.linListRepository.create(linkList);
  }

  async save(linkList: LinkListPayload): Promise<LinkList> {
    const linkListObj = this.create(linkList);
    return await this.linListRepository.save(linkListObj);
  }
}
