import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from 'src/users/providers/users.service';
import { RefreshTokenDto } from '../dtos/refresh-token-dto';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    /**
     * Inject jwtService
     */
    private readonly jwtService: JwtService,
    /**
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    /**
     * Inject GenerateTokensProvider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
    /**
     * Inject userService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      // verify the refresh token using jwtService
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      // Fetch user from the database
      const user = await this.usersService.findOneById(sub);
      // Generate the token
      return await this.generateTokensProvider.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
