import { defaultClasses, getModelForClass, prop, modelOptions, Ref, Severity } from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface FavoriteOffer extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'favoriteOffers'
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class FavoriteOfferEntity {
  @prop({
    ref: UserEntity,
    required: true,
    unique: true
  })
  public userId: Ref<UserEntity>;

  @prop({
    required: true,
    default: [],
    allowMixed: Severity.ALLOW
  })
  public items: string[];
}

export const FavoriteOfferModel = getModelForClass(FavoriteOfferEntity);
