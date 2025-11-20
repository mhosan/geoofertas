
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
  showEarliestTable: boolean = true;
  showLatestTable: boolean = true;
  showDocumentsRangeTable: boolean = false;
  earliestDocuments: any[] = [];
  latestDocuments: any[] = [];
  documentsRange: any[] = [];
  earliestDocumentsCount: number = 5;
  latestDocumentsCount: number = 5;
  documentsRangeStartId: number = 0;
  documentsRangeCount: number = 5;
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
  activeTabId: string = 'primeros-tab-pane';
  searchResults: any[] = [];
  searchQuery: string = '';
  searchLimit: number = 5;
  showSearchResults: boolean = false;

  constructor(private infoModelsService: InfoModelsService, private embeddingService: EmbeddingService) {
    // Cargar la info de documents al inicializar el componente
    this.loadDocumentsInfo();
  }

  setActiveTab(tabId: string): void {
    this.activeTabId = tabId;
  }

  closeDocumentsTabs(): void {
    switch (this.activeTabId) {
      case 'primeros-tab-pane':
        this.earliestDocuments = [];
        this.showEarliestTable = false;
        break;
      case 'ultimos-tab-pane':
        this.latestDocuments = [];
        this.showLatestTable = false;
        break;
      case 'rango-tab-pane':
        this.documentsRange = [];
        this.showDocumentsRangeTable = false;
        break;
    }
  }

  // Método para obtener un rango de documentos a partir de un ID inicial
  loadDocumentsRange(startId: number, count: number): void {
    this.embeddingService.getDocumentsRange(startId, count).subscribe({
      next: (data) => {
        this.documentsRange = Array.isArray(data.documents_range) ? data.documents_range : [];
        this.showDocumentsRangeTable = true;
      },
      error: (err) => {
        this.documentsRange = [];
        this.showDocumentsRangeTable = true;
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
        this.showEarliestTable = true;
      },
      error: (err) => {
        this.earliestDocuments = [];
        this.showEarliestTable = true;
      }
    });

  }

  // Método para obtener los ultimos n documentos
  loadLatestDocuments(n: number = 5): void {
    this.embeddingService.getLatestDocuments(n).subscribe({
      next: (data) => {
        this.latestDocuments = Array.isArray(data.latest_documents) ? data.latest_documents : [];
        this.showLatestTable = true;
      },
      error: (err) => {
        this.latestDocuments = [];
        this.showLatestTable = true;
      }
    });
  }

  /*************************************************************************
   * Borra un embedding por su ID.
   * @param id 
   * @returns 
   ************************************************************************/
  deleteEmbeddingById(id: number): void {
    if (!confirm(`¿Está seguro de que desea eliminar el embedding con ID ${id}?`)) {
      return;
    }
    this.embeddingService.deleteEmbeddingById(id).subscribe({
      next: (data) => {
        alert(`Embedding con ID ${id} eliminado correctamente.`);
      },
      error: (err) => {
        alert(`Error al eliminar el embedding con ID ${id}.`);
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

  searchEmbedding(): void {

    if (!this.searchQuery.trim()) {
      alert('El texto para la búsqueda no puede estar vacío.');
      return;
    }
    this.embeddingService.searchEmbedding(this.searchQuery, this.searchLimit).subscribe({
      next: (data) => {
        this.searchResults = data.results;
        this.showSearchResults = true;
      },
      error: (err) => {
        console.error('Error en la búsqueda:', err);
        this.searchResults = [];
        this.showSearchResults = false;
      }
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
  toggleCardEmbeddingMulti() {
    this.showContentEmbeddingMulti = !this.showContentEmbeddingMulti;
  }

}
