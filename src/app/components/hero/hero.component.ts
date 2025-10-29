
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
  earliestDocuments: any[] = [];
  latestDocuments: any[] = [];
  documentsRange: any[] = [];
  earliestDocumentsCount: number = 5;
  latestDocumentsCount: number = 5;
  documentsRangeStartId: number = 0;
  documentsRangeEndId: number = 0;
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
  documentsInfo: any = null;

  constructor(private infoModelsService: InfoModelsService, private embeddingService: EmbeddingService) {
    // Cargar la info de documents al inicializar el componente
    this.loadDocumentsInfo();
    // Cargar los primeros n documentos al inicializar el componente
    //this.loadEarliestDocuments();
  }

  // Método para obtener un rango de documentos
  loadDocumentsRange(startId: number, endId: number): void {
    this.embeddingService.getDocumentsRange(startId, endId).subscribe({
      next: (data) => {
        this.documentsRange = Array.isArray(data.documents_range) ? data.documents_range : [];
      },
      error: (err) => {
        this.documentsRange = [];
      }
    });
  }

  // Método para obtener la info de documents
  loadDocumentsInfo(): void {
    this.embeddingService.getDocumentsInfo().subscribe({
      next: (data) => {
        this.documentsInfo = data;
      },
      error: (err) => {
        this.documentsInfo = { error: 'No se pudo obtener la información.' };
      }
    });
  }

  // Método para obtener los primeros n documentos
  loadEarliestDocuments(n: number = 5): void {
    this.embeddingService.getEarliestDocuments(n).subscribe({
      next: (data) => {
        this.earliestDocuments = Array.isArray(data.earliest_documents) ? data.earliest_documents : [];
      },
      error: (err) => {
        this.earliestDocuments = [];
      }
    });
  }

  // Método para obtener los ultimos n documentos
  loadLatestDocuments(n: number = 5): void {
    this.embeddingService.getLatestDocuments(n).subscribe({
      next: (data) => {
        this.latestDocuments = Array.isArray(data.latest_documents) ? data.latest_documents : [];
      },
      error: (err) => {
        this.latestDocuments = [];
      }
    });
  }

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

  // Manejador mínimo para el botón de Multi-Embedding.
  // Valida la entrada 'raw' (texto que el usuario pone en el textarea),
  // construye this.multiEmbeddingText como JSON válido y llama a getMultiEmbedding().
  handleMultiEmbedding(raw: string): void {
    this.multiEmbeddingError = null;
    if (!raw || !raw.trim()) {
      this.multiEmbeddingError = 'El texto para el multi-embedding no puede estar vacío.';
      return;
    }
    // Normalizar: aceptar entradas como: "A", "B"  -> "A","B"
    // - Separar por coma
    // - Trim en cada elemento
    // - Asegurar que cada elemento esté entre comillas dobles (si no, envolverlas)
    const parts = raw.split(',').map(p => p.trim()).filter(p => p.length > 0);
    const normalizedParts = parts.map(p => {
      // si ya está entre comillas dobles, dejar
      if (p.startsWith('"') && p.endsWith('"')) return p;
      // si está entre comillas simples, convertir a dobles
      if (p.startsWith("'") && p.endsWith("'")) {
        const inner = p.slice(1, -1).replace(/"/g, '\\"');
        return '"' + inner + '"';
      }
      // si no tiene comillas, escapar dobles internas y envolver
      const escaped = p.replace(/"/g, '\\"');
      return '"' + escaped + '"';
    });
    this.multiEmbeddingText = '{"texts":[' + normalizedParts.join(',') + ']}';
    this.getMultiEmbedding();
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
