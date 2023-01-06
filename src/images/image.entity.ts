import { Entity, ManyToOne, PrimaryKey, Property } from 'mikro-orm';
import { configuration } from 'configuration';
import { BlobEntityType } from './blob.entity.type';
import { UserEntity } from '../users/user.entity';

@Entity({ tableName: 'images' })
export class ImageEntity {
  @PrimaryKey()
  id!: number;

  @Property({ persist: false })
  get image(): string {
    const publicUrl = configuration().publicUrl;
    return `${publicUrl}/api/images/${this.id}.${this.mimetype.split('/')[1]}`;
  }

  @Property({ type: BlobEntityType, hidden: true })
  data: Buffer;

  @Property({ hidden: true })
  mimetype: string;

  @Property({ hidden: true })
  size: number;

  @ManyToOne({ hidden: true })
  user: UserEntity;

  getPublicImageUrl(publicUrl: string) {
    return `${publicUrl}/api/images/${this.id}.${this.mimetype.split('/')[1]}`;
  }
}
