import { Component } from '@angular/core';

@Component({
  selector: 'app-featured-section',
  standalone: false,
  
  templateUrl: './featured-section.component.html',
  styleUrl: './featured-section.component.css'
})
export class FeaturedSectionComponent {
  brands = ['zapier', 'Spotify', 'zoom', 'amazon', 'Adobe', 'Notion', 'NETFLIX'];
}
