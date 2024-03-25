import { AppDataSource } from '../data-source';
import { User } from '../entity/User.entity';
import { type UserPayload } from '../types/payload';

export default class UserService {
  private readonly userRepository;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  create(user: UserPayload): User {
    return this.userRepository.create(user);
  }

  async save(user: UserPayload): Promise<User> {
    const userObj = this.create(user);
    return await this.userRepository.save(userObj);
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
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
    await this.userRepository.save(user);

    return user;
  }
}
