import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Put, 
  UseGuards,
  ParseIntPipe
} from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createConcertDto: CreateConcertDto) {
    return this.concertsService.create(createConcertDto);
  }

  @Get()
  findAll() {
    return this.concertsService.findAll();
  }

  @Get('upcoming')
  findUpcoming() {
    return this.concertsService.findUpcoming();
  }

  @Get('past')
  findPast() {
    return this.concertsService.findPast();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.concertsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateConcertDto: UpdateConcertDto
  ) {
    return this.concertsService.update(id, updateConcertDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.concertsService.remove(id);
  }
}
