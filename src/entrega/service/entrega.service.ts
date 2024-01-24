import { Injectable } from '@nestjs/common';
import { CreateEntregaDto } from '../dto/create-entrega.dto';
import { UpdateEntregaDto } from '../dto/update-entrega.dto';

@Injectable()
export class EntregaService {
  create(createEntregaDto: CreateEntregaDto) {
    return 'This action adds a new entrega';
  }

  findAll() {
    return `This action returns all entrega`;
  }

  findOne(id: number) {
    return `This action returns a #${id} entrega`;
  }

  update(id: number, updateEntregaDto: UpdateEntregaDto) {
    return `This action updates a #${id} entrega`;
  }

  remove(id: number) {
    return `This action removes a #${id} entrega`;
  }
}
