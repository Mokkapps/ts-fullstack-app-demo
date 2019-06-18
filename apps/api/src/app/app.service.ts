import { HttpService, Injectable } from '@nestjs/common';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  getData(): { message: string } {
    return { message: 'Welcome to api!' };
  }

  getDogs() {
    return this.httpService
      .get('https://dog.ceo/api/breeds/image/random/10')
      .pipe(
        map(response =>
          response.data.message.map(url => {
            return { imageUrl: url };
          })
        )
      );
  }
}
