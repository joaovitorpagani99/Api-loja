import { LojaService } from 'src/loja/service/loja.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEntregaDto } from '../dto/create-entrega.dto';
import { UpdateEntregaDto } from '../dto/update-entrega.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Entrega } from '../entities/entrega.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EntregaService {
  constructor(
    @InjectRepository(Entrega)
    private readonly entregaRepository: Repository<Entrega>,
    private readonly lojaService: LojaService,
  ) { }


  public async create(createEntregaDto: CreateEntregaDto) {
    try {
      await this.entregaRepository.save(createEntregaDto);
      return createEntregaDto;
    } catch (error) {
      throw new BadRequestException('Erro ao criar entrega.')
    }
  }

  public async findAll(idLoja: string) {
    const loja = await this.lojaService.findById(+idLoja);
    const entregas = await this.entregaRepository.find({
      where: { loja: { id: loja.id } },
      relations: ['loja', 'usuario', 'entregador'],
    });
    if (entregas.length === 0) {
      throw new NotFoundException('Nenhuma entrega encontrada');
    }
    return entregas;
  }

  public async findByID(id: number) {
    try {
      const entrega = await this.entregaRepository.findOne({
        where: { id },
      });
      if (!entrega) throw new NotFoundException('Entrega não encontrada')

      return entrega;
    } catch (error) {
      throw new BadRequestException('Erro ao buscar entrega.')
    }
  }

  public async update(id: number, updateEntregaDto: UpdateEntregaDto) {
    const updateEntrega = await this.entregaRepository.update(id, updateEntregaDto);
    if (updateEntrega.affected === 0) {
      throw new NotFoundException('Entrega não encontrada');
    }
    return await this.entregaRepository.findOne({
      where: { id },
    });
  }
}
