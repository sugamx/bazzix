import { Component } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-item',
  standalone: false,
  
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {
  registrationData = {
    name: '',
    email: ''
  };
  items: any[] = []; // Array to store fetched items
  ngOnInit(): void {
    this.fetchItems(); // Fetch items when the component initializes
  }

  // Method to fetch items
  fetchItems(): void {
    this.dataService.getItems().subscribe(
      (data) => {
        this.items = data; // Store fetched data
      },
      (error) => {
        console.error('Error fetching items:', error);
      }
    );
  }

  constructor(private dataService: DataService) {}

  onSubmit() {
    this.dataService.addItem(this.registrationData).subscribe(response => {
      console.log('Registration Data added:', response);
    });
  }
}
