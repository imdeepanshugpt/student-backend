import {Entity, model, property} from '@loopback/repository';
import {v4 as uuidv4} from 'uuid';

@model()
export class Users extends Entity {
  @property({
    type: 'string',
    id: true,
    default: () => uuidv4(),
  })
  userId?: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  role: string;

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelations {
  // describe navigational properties here
}

export type UsersWithRelations = Users & UsersRelations;
