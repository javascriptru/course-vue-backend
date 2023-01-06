import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from 'mikro-orm';
import { MeetupEntity } from '../meetups/entities/meetup.entity';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { createHash } from 'crypto';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Entity({ tableName: 'users' })
export class UserEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  fullname!: string;

  @Property()
  @Unique()
  email!: string;

  @Property()
  @Exclude()
  password!: string;

  @Exclude()
  @OneToMany(
    () => MeetupEntity,
    (meetup) => meetup.organizer,
  )
  meetups = new Collection<MeetupEntity>(this);

  @Property({ persist: false })
  @Expose()
  get avatar(): string {
    if (!this.email) {
      return undefined;
    }
    const emailHash = createHash('md5')
      .update(this.email)
      .digest('hex');
    const size = 28;
    return `https://www.gravatar.com/avatar/${emailHash}?s=${size}&d=identicon`;
  }

  setPassword(password: string) {
    this.password = this.passwordHash(password);
  }

  checkPassword(password: string) {
    return this.password === this.passwordHash(password);
  }

  // TODO: Make password store more secure
  // Using email as salt is also not secure.
  // Hmac with secret key would be better than hash.
  private passwordHash(password) {
    // sha256(password + sha256(email))
    const salt = this.email;
    const saltHash = createHash('sha256')
      .update(salt)
      .digest('hex');
    return createHash('sha256')
      .update(password + saltHash)
      .digest('hex');
  }

  constructor(registerUserDto: RegisterUserDto) {
    this.fullname = registerUserDto.fullname;
    this.email = registerUserDto.email;
    this.setPassword(registerUserDto.password);
  }
}
