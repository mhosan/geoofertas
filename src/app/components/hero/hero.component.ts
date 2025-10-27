import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoModel } from '../../models/llmModels';
import { InfoModelsService } from '../../../app/services/infoModels.service';
import { EmbeddingService } from '../../services/embedding.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  infoModel: InfoModel | undefined;
  infoModelHealth: any;
  showContentInfo = false;
  showContentHealth = false;
  showContentEmbeddingSingle = false;
  embeddingText: string = '';
  embeddingResult: any;
  showContentEmbeddingMulti = false;
  multiEmbeddingText: string = '{\n  "texts": [\n    "Texto Uno",\n    "Texto Dos"\n  ]\n}';
  multiEmbeddingResult: any;
  multiEmbeddingError: string | null = null;

  constructor(private infoModelsService: InfoModelsService, private embeddingService: EmbeddingService) { }

  modelInfo(): void {
    this.infoModelsService.getModelInfo().subscribe(data => {
      this.infoModel = data;
      console.log(this.infoModel);
    });
  }

  modelHealth(): void {
    this.infoModelsService.getModelHealth().subscribe(data => {
      this.infoModelHealth = data;
      console.log(this.infoModelHealth);
    });
  }
 
  getEmbedding(): void {
    if (!this.embeddingText.trim()) {
      alert('El texto para el embedding no puede estar vacío.');
      return;
    }
    this.embeddingService.getSingleEmbedding(this.embeddingText).subscribe(data => {
      this.embeddingResult = data;
      console.log('Embedding:', data);
    });
  }

  getMultiEmbedding(): void {
    this.multiEmbeddingError = null;
    if (!this.multiEmbeddingText.trim()) {
      this.multiEmbeddingError = 'El texto para el multi-embedding no puede estar vacío.';
      return;
    }
    try {
      const data = JSON.parse(this.multiEmbeddingText);
      this.embeddingService.getMultiEmbedding(data).subscribe(result => {
        this.multiEmbeddingResult = result;
        console.log('Multi-Embedding:', result);
      });
    } catch (error) {
      this.multiEmbeddingError = 'Error al parsear el JSON. Asegúrese de que el formato es correcto.';
      console.error('Error al parsear el JSON:', error);
    }
  }

  toggleCardInfo() {
    this.showContentInfo = !this.showContentInfo;
  }
  toggleCardHealth() {
    this.showContentHealth = !this.showContentHealth;
  }
  toggleCardEmbeddingSingle() {
    this.showContentEmbeddingSingle = !this.showContentEmbeddingSingle;
  }
  toggleCardEmbeddingMulti() {
    this.showContentEmbeddingMulti = !this.showContentEmbeddingMulti;
  }

}
