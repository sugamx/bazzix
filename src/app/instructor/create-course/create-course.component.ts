import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../courses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-create-course',
  standalone: false,
  
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.css'
})


export class CreateCourseComponent implements OnInit {
  courseForm: FormGroup;
  isEditMode = false;
  currentCourseId?: number;
  selectedFile: File | null = null;
  instructorName: string = '';


  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private route: ActivatedRoute,
    public router: Router,
    private authService: AuthService,
  ) {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      image: [''],
      objectives: this.fb.array([]),
      prerequisites: this.fb.array([]),
    });
  }
  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log("Current User:", currentUser); // Debugging
  
    this.instructorName = currentUser?.fullName || 'Unknown Instructor';
    
    console.log("Instructor Name:", this.instructorName); // Debugging
    const courseId = this.route.snapshot.params['id'];
    if (courseId) {
      this.isEditMode = true;
      this.loadCourseForEdit(courseId);
    }
  }
  

  get objectives(): FormArray {
    return this.courseForm.get('objectives') as FormArray;
  }

  get prerequisites(): FormArray {
    return this.courseForm.get('prerequisites') as FormArray;
  }

  addObjective(): void {
    this.objectives.push(this.fb.control('', Validators.required));
  }

  removeObjective(index: number): void {
    this.objectives.removeAt(index);
  }

  addPrerequisite(): void {
    this.prerequisites.push(this.fb.control('', Validators.required));
  }

  removePrerequisite(index: number): void {
    this.prerequisites.removeAt(index);
  }

  loadCourseForEdit(courseId: string): void {
    this.courseService.getCourseById(courseId).subscribe({
      next: (course) => {
        this.currentCourseId = parseInt(course.id);
        this.courseForm.patchValue({
          title: course.title,
          description: course.description,
          price: course.price,
          image: course.image,
        });
        
        // Handle objectives with fallback
        (course.objectives || []).forEach((objective) =>
          this.objectives.push(this.fb.control(objective))
        );
        
        // Handle prerequisites with fallback
        (course.prerequisites || []).forEach((prerequisite) =>
          this.prerequisites.push(this.fb.control(prerequisite))
        );
      },
      error: (err) => {
        console.error('Failed to load course for edit', err);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.courseForm.patchValue({ image: reader.result as string });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      return;
    }
  
    const formValue = this.courseForm.value;
    const currentUser = this.authService.getCurrentUser(); // Get the logged-in user
  
    const courseData = {
      title: formValue.title,
      description: formValue.description,
      price: formValue.price,
      objectives: formValue.objectives.filter((obj: string) => obj),
      prerequisites: formValue.prerequisites.filter((pre: string) => pre),
      image: formValue.image,
      instructor_id: currentUser?.id,  // Ensure instructor_id is added
      instructor: currentUser?.fullName || 'Unknown Instructor' // Ensure instructor_name is included
    };
  
    console.log("Submitting Course Data:", courseData); // Debugging
  
    if (this.isEditMode && this.currentCourseId) {
      this.courseService.updateCourse(this.currentCourseId.toString(), courseData).subscribe({
        next: () => {
          console.log('Course updated successfully');
          this.router.navigate(['/instructor/courses']);
        },
        error: (err) => {
          console.error('Failed to update course', err);
        }
      });
    } else {
      this.courseService.createCourse(courseData).subscribe({
        next: () => {
          console.log('Course created successfully');
          this.router.navigate(['/instructor/courses']);
        },
        error: (err) => {
          console.error('Failed to create course', err);
        }
      });
    }
  }

   // Add this method
   formatNumber(event: any) {
    const input = event.target as HTMLInputElement;
    // Convert to number to remove leading zeros
    const value = Number(input.value);
    // Update the input value if it's a valid number
    if (!isNaN(value)) {
      input.value = value.toString();
    }
  }
  
}
