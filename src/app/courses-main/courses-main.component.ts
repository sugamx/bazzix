import { Component, OnInit, ViewChild } from '@angular/core';
import { Course, CourseService } from '../courses.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';


@Component({
  selector: 'app-courses-main',
  standalone: false,
  
  templateUrl: './courses-main.component.html',
  styleUrl: './courses-main.component.css'
})


export class CoursesMainComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchText: string = '';
  searchSubject = new Subject<string>(); // Subject for debouncing

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.fetchCourses();

    // Debounce search input
    this.searchSubject
      .pipe(
        debounceTime(300), // Wait 300ms after the user stops typing
        distinctUntilChanged() // Only emit if the search text changes
      )
      .subscribe((searchText) => {
        this.applyFilter(searchText);
      });
  }

  fetchCourses(): void {
    this.courseService.loadCourses().subscribe(
      (data) => {
        console.log('Fetched Courses:', data); // Debugging
        this.courses = data;
        this.filteredCourses = data;
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }
  

  onSearchInput(): void {
    this.searchSubject.next(this.searchText); // Emit the search text to the subject
  }

  applyFilter(searchText: string): void {
    const lowerCaseSearchText = searchText.toLowerCase();
    this.filteredCourses = this.courses.filter((course) =>
      course.title.toLowerCase().includes(lowerCaseSearchText) ||
      course.description.toLowerCase().includes(lowerCaseSearchText) ||
      course.instructor.toLowerCase().includes(lowerCaseSearchText)
    );
  }

  // Method to highlight matching text
  highlightText(text: string, searchText: string): string {
    if (!searchText) {
      return text; // Return the original text if no search text
    }

    // Create a regular expression to match the search text (case-insensitive)
    const regex = new RegExp(`(${searchText})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }
}