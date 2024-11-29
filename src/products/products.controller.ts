import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  /**
   * Endpoint to create a product via microservice message pattern.
   * @param createProductDto - Data Transfer Object for creating a new product.
   * @returns Product created response.
   */
  @MessagePattern({ cmd: 'create_product' })
  create(@Payload() createProductDto: CreateProductDto) {
    this.logger.log('Creating product');
    return this.productsService.create(createProductDto);
  }

  /**
   * Endpoint to find all products with pagination via microservice message pattern.
   * @param paginationDTO - Pagination data (page, limit).
   * @returns List of products with pagination metadata.
   */
  @MessagePattern({ cmd: 'find_all_products' })
  findAll(@Payload() paginationDTO: PaginationDTO) {
    this.logger.log('Fetching all products with pagination');
    return this.productsService.findAll(paginationDTO);
  }

  /**
   * Endpoint to find a product by ID via microservice message pattern.
   * @param id - ID of the product to retrieve.
   * @returns The product with the specified ID.
   */
  @MessagePattern({ cmd: 'find_one_product' })
  findOne(@Payload('id') id: string) {
    this.logger.log(`Fetching product with ID: ${id}`);
    return this.productsService.findOne(+id); // Mantener el ID como string
  }

  /**
   * Endpoint to update a product by ID via microservice message pattern.
   * @param updateProductDto - Data Transfer Object for updating a product.
   * @returns The updated product.
   */
  @MessagePattern({ cmd: 'update_one_product' })
  update(@Payload() updateProductDto: UpdateProductDto) {
    this.logger.log(`Updating product with ID: ${updateProductDto.id}`);
    return this.productsService.update(+updateProductDto.id, updateProductDto);
  }

  /**
   * Endpoint to soft-delete a product by ID via microservice message pattern.
   * @param id - ID of the product to soft-delete.
   * @returns The updated product with available flag set to false.
   */
  @MessagePattern({ cmd: 'delete_one_product' })
  remove(@Payload() id: string) {
    this.logger.log(`Removing product with ID: ${id}`);
    return this.productsService.remove(+id);
  }
}
