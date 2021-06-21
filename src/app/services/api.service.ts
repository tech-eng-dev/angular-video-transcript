import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IVideo } from '../types/response';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.backendApiUrl + '/angular-test';

  constructor(
    private http: HttpClient
  ) { }

  fetchVideo(): Observable<IVideo> {
    return this.http.get<IVideo>(`${this.baseUrl}/video.json`);
  }
}
