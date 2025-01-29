
import { DataService } from '../data.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-manage-items',
  standalone: false,
  
  templateUrl: './manage-items.component.html',
  styleUrl: './manage-items.component.css'
})


export class ManageItemsComponent implements OnInit {
  items: any[] = []; // Array to store fetched items
  selectedItem: any = null; // Variable to store the selected item for editing

  constructor(private dataService: DataService) {}

  // Implement the ngOnInit method
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

  // Method to select an item for editing
  onEdit(item: any): void {
    this.selectedItem = { ...item }; // Create a copy of the selected item
  }

  // Method to update an item
  onUpdate(): void {
    if (this.selectedItem) {
      this.dataService.updateItem(this.selectedItem.id, this.selectedItem).subscribe(
        (response) => {
          console.log('Item updated:', response);
          this.fetchItems(); // Refresh the list after updating
          this.selectedItem = null; // Clear the selected item
        },
        (error) => {
          console.error('Error updating item:', error);
        }
      );
    }
  }

  // Method to delete an item
  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.dataService.deleteItem(id).subscribe(
        (response) => {
          console.log('Item deleted:', response);
          this.fetchItems(); // Refresh the list after deleting
        },
        (error) => {
          console.error('Error deleting item:', error);
        }
      );
    }
  }
}