import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    RouterOutlet,
    CommonModule
  ]
})
export class AppComponent {
  title = 'martilleros';
  showFooter = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        // Oculta el footer solo en la ruta 'frappe'
        this.showFooter = !event.urlAfterRedirects.startsWith('/frappe');
      }
    });
  }
}
