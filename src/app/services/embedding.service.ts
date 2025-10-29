
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmbeddingService {

  constructor(private http: HttpClient) {}


  /**
   * Obtiene información sobre la tabla documents desde el endpoint externo.
   * @returns Observable<any> con la información de la tabla documents
   */
  getDocumentsInfo(): Observable<any> {
    const baseUrl = environment.apiUrl;
    const requestUrl = baseUrl ? `${baseUrl}/documents/info` : '/api/documents/info';
    return this.http.get<any>(requestUrl);
  }
  
  /**
   * Obtiene los primeros n registros de la tabla documents.
   * @param n cantidad de registros a recuperar
   * @returns Observable<any> con los primeros n documentos
   */
  getEarliestDocuments(n: number): Observable<any> {
    const baseUrl = environment.apiUrl;
    const requestUrl = baseUrl ? `${baseUrl}/documents/earliest` : '/api/documents/earliest';
    const params = new HttpParams().set('n', n.toString());
    return this.http.get<any>(requestUrl, { params });
  }


  getSingleEmbedding(text: string): Observable<any>{
    const baseUrl = environment.apiUrl;
    const requestUrl = baseUrl ? `${baseUrl}/embedding` : '/api/embedding';
    
    const params = new HttpParams().set('text', text);
    
    return this.http.post<any>(requestUrl, null, { params });
  }

  getMultiEmbedding(data: { texts: string[] }): Observable<any> {
    const baseUrl = environment.apiUrl;
    const requestUrl = baseUrl ? `${baseUrl}/embeddings` : '/api/embeddings';
    
    return this.http.post<any>(requestUrl, data);
  }
}
 