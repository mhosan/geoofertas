import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoModel } from '../../models/llmModels';
import { InfoModelsService } from '../../../app/services/infoModels.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  infoModel: InfoModel | undefined;
  infoModelHealth: any;
  showContent = false;

  constructor(private infoModelsService: InfoModelsService) { }

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

  toggleCard() {
    this.showContent = !this.showContent;
  }

}
