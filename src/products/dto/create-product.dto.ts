import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  public readonly name: string;

  @IsNumber({
    maxDecimalPlaces: 4,
  })
  @IsPositive()
  @Min(0)
  @Type(() => Number)
  public readonly price: number;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  public readonly stock?: number;

  @IsPositive()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public readonly sku?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  public readonly description?: string;
}
