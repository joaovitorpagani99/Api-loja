import { Injectable } from '@nestjs/common';
import { CreateVariacoeDto } from '../dto/create-variacoe.dto';
import { UpdateVariacoeDto } from '../dto/update-variacoe.dto';

@Injectable()
export class VariacoesService {
  create(createVariacoeDto: CreateVariacoeDto) {
    return 'This action adds a new variacoe';
  }

  findAll() {
    return `This action returns all variacoes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} variacoe`;
  }

  update(id: number, updateVariacoeDto: UpdateVariacoeDto) {
    return `This action updates a #${id} variacoe`;
  }

  remove(id: number) {
    return `This action removes a #${id} variacoe`;
  }
}
