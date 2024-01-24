import { PartialType } from '@nestjs/swagger';
import { CreateVariacoeDto } from './create-variacoe.dto';

export class UpdateVariacoeDto extends PartialType(CreateVariacoeDto) {}
