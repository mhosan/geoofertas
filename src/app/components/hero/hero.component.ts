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
  showContentEmbeddingSingle = true;
  embeddingText: string = '';
  embeddingResult: any;

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
      console.log('El texto para el embedding no puede estar vacío.');
      return;
    }
    this.embeddingService.getEmbedding(this.embeddingText).subscribe(data => {
      this.embeddingResult = data;
      console.log('Embedding:', data);
    });
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

}
