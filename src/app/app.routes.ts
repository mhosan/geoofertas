import { Routes } from '@angular/router';
import { HeroComponent } from './components/hero/hero.component';
import { MapaComponent } from './components/mapa/mapa.component';
import { LlmDirectoComponent } from './components/llmDirecto/llmDirecto.component';
import { IaComponent } from './components/ia/ia.component';
import { Llm7ChatComponent } from './components/llm7-chat/llm7-chat.component';


export const routes: Routes = [
  { path: '', component: HeroComponent },
  { path: 'mapa', component: MapaComponent},
  { path: 'llm', component: LlmDirectoComponent },
  { path: 'ia', component: IaComponent },
  { path: 'chat', component: Llm7ChatComponent },
  { path: '**', redirectTo: '' }
];
