/* eslint-disable @typescript-eslint/naming-convention */
import {Entity, model, property} from '@loopback/repository';

@model()
export class Prices extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  priceId?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  current_price: number;

  @property({
    type: 'date',
    default: () => Date.now(),
  })
  created_at?: Date;

  @property({
    type: 'date',
  })
  updated_at?: Date;

  constructor(data?: Partial<Prices>) {
    super(data);
  }
}

export interface PricesRelations {
  // describe navigational properties here
}

export type PricesWithRelations = Prices & PricesRelations;
