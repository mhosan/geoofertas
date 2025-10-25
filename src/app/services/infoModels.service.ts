import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InfoModel } from '../models/llmModels';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InfoModelsService {

  constructor(private http: HttpClient) {}

  getModelInfo(): Observable<InfoModel> {
    const baseUrl = environment.apiUrl;
    const requestUrl = baseUrl ? `${baseUrl}/model-info` : '/api/model-info';
    return this.http.get<InfoModel>(requestUrl);
  }
}