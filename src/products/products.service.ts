import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  OnModuleInit,
  HttpStatus,
} from '@nestjs/common';  
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { Product } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  // Método para crear un producto
  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      return await this.product.create({
        data: createProductDto,
      });
    } catch (error) {
      this.logger.error(`Error creating product: ${error}`);
      throw new RpcException(
        {
          message: 'No se encontró el producto',
          status: HttpStatus.BAD_REQUEST,
        });
    }
  }

  // Método para obtener todos los productos con paginación
  async findAll(paginationDto: PaginationDTO) {
    const { page, limit } = paginationDto;

    try {
    const totalPages = await this.product.count({
      where: { available: true },
    });
    const lastPages = Math.ceil(totalPages / limit);

    if (page > lastPages) {
      return {
        data: [],
        meta: {
          page: page,
          total: totalPages,
          lastPage: lastPages,
        },
      };
    }

    const products = await this.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { available: true },
    });

    return {
      data: products,
      meta: {
        page: page,
        total: totalPages,
        lastPage: lastPages,
      },
    };
  } catch (error) {
    throw new RpcException(
      {
        message: 'Error al obtener los productos',
        status: HttpStatus.BAD_REQUEST,
      });
  }
}

  async findOne(id: number) {
  try {
    const product = await this.product.findFirst({
      where: { id: id },
    });
    return product;
  } catch (error) {
    throw new RpcException(
      {
        message: 'Error al actualizar el producto',
        status: HttpStatus.BAD_REQUEST,
      });
  }
  }



  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;

    try {
      return await this.product.update({
        where: { id: id },
        data: data,
      });
    } catch (error) {
      throw new RpcException(
        {
          message: 'Error al actualizar el producto',
          status: HttpStatus.BAD_REQUEST,
        });
    }
  }

  async remove(id: number) {
    try {
      const product = await this.product.update({
        where: { id: id },
        data: { available: false },
      });
      return product;
    } catch (error) {
      throw new RpcException(
        {
          message: 'No se pudo eliminar el producto',
          status: HttpStatus.BAD_REQUEST,
        });
    }
  }
}
