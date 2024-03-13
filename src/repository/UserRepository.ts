import { AppDataSource } from '../data-source';
import { User } from '../entity/User.entity';
import { type UserPayload } from '../types/payload';

export default class UserRepository {
  private readonly userInstance;
  constructor() {
    this.userInstance = AppDataSource.getRepository(User);
  }

  async save(user: UserPayload): Promise<User> {
    const userObj = this.userInstance.create(user);
    return await this.userInstance.save(userObj);
  }
}
