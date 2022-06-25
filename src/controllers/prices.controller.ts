/* eslint-disable @typescript-eslint/naming-convention */
import {
  Count,
  CountSchema,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {getBitCoin} from '../helper/bitcoin-api';
import {sendEmail} from '../helper/send-email';
import {Prices} from '../models';
import {PricesRepository} from '../repositories';

export class PricesController {
  constructor(
    @repository(PricesRepository)
    public pricesRepository: PricesRepository,
  ) {}

  @post('/prices')
  @response(200, {
    description: 'Prices model instance',
    content: {'application/json': {schema: getModelSchemaRef(Prices)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Prices, {
            title: 'NewPrices',
            exclude: ['priceId'],
          }),
        },
      },
    })
    prices: Omit<Prices, 'priceId'>,
  ): Promise<Prices> {
    return this.pricesRepository.create(prices);
  }

  @get('/prices/count')
  @response(200, {
    description: 'Prices model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Prices) where?: Where<Prices>): Promise<Count> {
    return this.pricesRepository.count(where);
  }

  @get('/bitcoin/prices')
  @response(200, {
    description: 'Array of Prices model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          // items: getModelSchemaRef(Prices, {includeRelations: true}),
        },
      },
    },
  })
  async getBitCoin(): Promise<any> {
    const data: any = await getBitCoin();
    const apiArray: any[] = [];
    if (data?.length) {
      data.forEach((element: any) => {
        const payload = {
          name: element.name,
          current_price: element.current_price,
          updated_at: element.last_updated.split('T')[0],
        };
        const minPrice = process.env.minPrice;
        const maxPrice = process.env.maxPrice;
        if (minPrice && minPrice < element.current_price) {
          apiArray.push(
            sendEmail(
              `Price is going down from ${minPrice}. current price is ${element.current_price}`,
            ),
          );
        } else if (maxPrice && maxPrice > element.current_price) {
          apiArray.push(
            sendEmail(
              `Price is going up from ${maxPrice}. current price is ${element.current_price}`,
            ),
          );
        }
        apiArray.push(this.pricesRepository.create(payload));
      });
    }
    await Promise.all(apiArray);
    return this.pricesRepository.find();
  }

  @get('/api/prices/btc')
  @response(200, {
    description: 'Array of Prices model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Prices, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.query.string('date') date: Date,
    @param.query.number('offset') offset?: number,
    @param.query.number('limit') limit?: number,
  ): Promise<any> {
    const filter = {
      offset: offset,
      limit: limit,
      skip: 0,
      where: {
        updated_at: new Date(date),
      },
    };
    const result = await this.pricesRepository.find(filter);
    const nextOffset = Number(offset) + Number(limit);
    return {
      url: `http://localhost:3000/api/prices/btc?date=${date}&offset=${offset}&limit=${limit}`,
      next: `http://localhost:3000/api/prices/btc?date=${date}&offset=${nextOffset}&limit=${limit}`,
      count: result.length,
      data: result,
    };
  }

  @patch('/prices')
  @response(200, {
    description: 'Prices PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Prices, {partial: true}),
        },
      },
    })
    prices: Prices,
    @param.where(Prices) where?: Where<Prices>,
  ): Promise<Count> {
    return this.pricesRepository.updateAll(prices, where);
  }

  @get('/prices/{id}')
  @response(200, {
    description: 'Prices model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Prices, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Prices, {exclude: 'where'})
    filter?: FilterExcludingWhere<Prices>,
  ): Promise<Prices> {
    return this.pricesRepository.findById(id, filter);
  }

  @patch('/prices/{id}')
  @response(204, {
    description: 'Prices PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Prices, {partial: true}),
        },
      },
    })
    prices: Prices,
  ): Promise<void> {
    await this.pricesRepository.updateById(id, prices);
  }

  @put('/prices/{id}')
  @response(204, {
    description: 'Prices PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() prices: Prices,
  ): Promise<void> {
    await this.pricesRepository.replaceById(id, prices);
  }

  @del('/prices/{id}')
  @response(204, {
    description: 'Prices DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.pricesRepository.deleteById(id);
  }
}
