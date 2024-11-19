import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDTO } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database Conected');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(PaginationDTO: PaginationDTO) {
    const { page, limit } = PaginationDTO;

    const totalPages = await this.product.count({ where: { available: true } });
    const lastPages = Math.ceil(totalPages / limit);

    if (page > lastPages) {
      // pequeña validación para evitar que se salte la última página
      return {
        data: ['No hay más productos'],
        meta: {
          page: page,
          total: totalPages,
          lastPage: lastPages,
        },
      };
    } else {
      return {
        data: await this.product.findMany({
          skip: (page - 1) * limit, // skip first 10 records, es decir salta la cantidad que da el propio limit
          take: limit, // take first 10 records, es decir toma la cantidad que da el propio limit
          where: {
            available: true,
          },
        }),
        meta: {
          page: page,
          total: totalPages,
          lastPage: lastPages,
        },
      };
    }
  }

  async findOne(id: number) {
    const products = await this.product.findFirst({
      // al trabajar con bd, usar await
      where: {
        id: id,
      },
    });

    if (!products) {
      throw new NotFoundException('No se encontró el producto');
    }
    return products;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;

    try {
      return await this.product.update({
        where: {
          id: id,
        },
        data: data,
      });
    } catch (error) {
      throw new NotFoundException(
        `No se encontró el producto ${id}, error ${error}`,
      );
    }
  }

  async hard_remove(id: number) {
    // puede crear un problema de identidad referencial
    try {
      return await this.product.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`The product doesnt exists, ${error}`);
    }
  }

  async remove(id: number) {
    try {
      const product = await this.product.update({
        where: { id },
        data: {
          available: false,
        },
      });
      return product;
    } catch (error) {
      return `the product dosent exists ${error}`;
    }
  }
}
