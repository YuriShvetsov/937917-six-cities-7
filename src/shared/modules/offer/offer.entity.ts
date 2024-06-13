import {defaultClasses, getModelForClass, prop, modelOptions, Ref, Severity } from '@typegoose/typegoose';

import { HousingType, Location } from '../../types/index.js';
import { CityEntity } from '../city/index.js';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, default: '', trim: true })
  public title: string;

  @prop({ required: true, default: '', trim: true })
  public description: string;

  @prop({ required: false })
  public publishedAt: Date;

  @prop({
    ref: CityEntity,
    required: true
  })
  public cityId: Ref<CityEntity>;

  @prop({ required: true })
  public previewImage: string;

  @prop({ required: true, allowMixed: Severity.ALLOW })
  public images: string[];

  @prop({ required: true, default: false })
  public isPremium: boolean;

  @prop({ required: true, default: 0 })
  public rating: number;

  @prop({
    type: () => String,
    enum: HousingType,
    required: true
  })
  public housingType: HousingType;

  @prop({ required: true })
  public roomCount: number;

  @prop({ required: true })
  public guestCount: number;

  @prop({ required: true })
  public price: number;

  @prop({ required: true, allowMixed: Severity.ALLOW })
  public facilities: string[];

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId: Ref<UserEntity>;

  @prop({ required: true, allowMixed: Severity.ALLOW })
  public location: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
