import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { Dog } from '@ts-fullstack-app/data';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('dogs')
  getDogs(): Observable<Dog[]> {
    return this.appService.getDogs();
  }
}
