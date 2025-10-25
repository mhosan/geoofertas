import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../../environments/environment';
//import { ApiService } from '../../services/api-service.service'; 
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { UserMenuComponent } from '../user-menu.component';
import { SupabaseService } from '../../../services/supabase.service';


@Component({
    selector: 'app-header',
    imports: [RouterLink, RouterLinkActive, HttpClientModule, CommonModule, UserMenuComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  appName = environment.appName;
  data: any;
  mostrarCard = false;

  constructor(public supabaseService: SupabaseService) {} 

  ngOnInit() {
   
  }

  mostrarCardOn() {
    this.mostrarCard = true;
  }

  mostrarCardOff() {
    this.mostrarCard = false;
  }
}