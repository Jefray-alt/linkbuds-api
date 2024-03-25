import { SALT_ROUNDS } from '../config/constants';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User.entity';
import { type UserPayload } from '../types/payload';
import bcrypt from 'bcrypt';

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

    const encryptedRefreshToken = await bcrypt.hash(
      refreshToken,
      bcrypt.genSaltSync(SALT_ROUNDS)
    );
    user.refreshToken = encryptedRefreshToken;
    await this.userRepository.save(user);

    return user;
  }
}
