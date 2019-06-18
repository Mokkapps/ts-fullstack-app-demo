import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dog } from '@ts-fullstack-app/data';

@Component({
  selector: 'ts-fullstack-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  dog$: Observable<Dog[]>;

  constructor(private http: HttpClient) {
    this.dog$ = this.http.get<Dog[]>('/api/dogs');
  }
}
