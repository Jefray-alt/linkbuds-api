import { SALT_ROUNDS } from '../config/constants';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User.entity';
import { type UserPayload } from '../types/payload';
import bcrypt from 'bcrypt';
import { type FindOptionsSelect } from 'typeorm';

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

  async findById(
    id: string,
    options?: FindOptionsSelect<User>
  ): Promise<User | null> {
    return await this.userRepository.findOne({
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
        refreshToken: false,
        ...options
      },
      where: { id }
    });
  }

  async findByEmail(
    email: string,
    options?: FindOptionsSelect<User>
  ): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
        refreshToken: false,
        ...options
      }
    });
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string
  ): Promise<User | null> {
    const user = await this.findById(id, { refreshToken: true });

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
