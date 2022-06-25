import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Prices, PricesRelations} from '../models';

export class PricesRepository extends DefaultCrudRepository<
  Prices,
  typeof Prices.prototype.priceId,
  PricesRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(Prices, dataSource);
  }
}
