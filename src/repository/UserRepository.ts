import { AppDataSource } from '../data-source';
import { User } from '../entity/User.entity';
import { type UserPayload } from '../types/payload';

export default class UserRepository {
  private readonly userInstance;
  constructor() {
    this.userInstance = AppDataSource.getRepository(User);
  }

  create(user: UserPayload): User {
    return this.userInstance.create(user);
  }

  async save(user: UserPayload): Promise<User> {
    const userObj = this.create(user);
    return await this.userInstance.save(userObj);
  }

  async findById(id: string): Promise<User | null> {
    return await this.userInstance.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userInstance.findOne({ where: { email } });
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string
  ): Promise<User | null> {
    const user = await this.findById(id);

    if (user === null) {
      return null;
    }

    user.refreshToken = refreshToken;
    await this.userInstance.save(user);

    return user;
  }
}
