import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmbeddingService {

  constructor(private http: HttpClient) {}

  getEmbedding(text: string): Observable<any> {
    const baseUrl = environment.apiUrl;
    const requestUrl = baseUrl ? `${baseUrl}/embedding` : '/api/embedding';
    
    const params = new HttpParams().set('text', text);
    
    return this.http.post<any>(requestUrl, null, { params });
  }
}
