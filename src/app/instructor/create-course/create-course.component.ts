import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  currentCourseId?: string; // Store the course ID as a string
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
      // Set the image control as required
      image: [null, Validators.required],
      // Attach custom validators to ensure at least one non-empty entry
      objectives: this.fb.array([], [this.minRequiredArrayValidator(1)]),
      prerequisites: this.fb.array([], [this.minRequiredArrayValidator(1)]),
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log("Current User:", currentUser);
    this.instructorName = currentUser?.fullName || 'Unknown Instructor';

    // Read the course ID from the route parameters.
    const courseId = this.route.snapshot.params['id'];
    if (courseId) {
      this.isEditMode = true;
      this.loadCourseForEdit(courseId);
    }
  }

  // Custom validator: requires at least `min` non-empty controls in a FormArray
  minRequiredArrayValidator(min: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const formArray = control as FormArray;
      const validItems = formArray.controls.filter(
        c => c.value && c.value.toString().trim() !== ''
      );
      return validItems.length >= min ? null : { minRequired: { valid: false } };
    };
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
        // Store the course ID as provided (do not parse it if it's not purely numeric)
        this.currentCourseId = course.id;
        this.courseForm.patchValue({
          title: course.title,
          description: course.description,
          price: course.price,
          image: course.image,
        });

        // Clear existing FormArrays
        this.objectives.clear();
        this.prerequisites.clear();

        // Populate objectives (with fallback)
        (course.objectives || []).forEach((objective: string) => {
          this.objectives.push(this.fb.control(objective, Validators.required));
        });

        // Populate prerequisites (with fallback)
        (course.prerequisites || []).forEach((prerequisite: string) => {
          this.prerequisites.push(this.fb.control(prerequisite, Validators.required));
        });
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
        // Patch the image control with the data URL
        this.courseForm.patchValue({ image: reader.result as string });
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      // If no file is selected, clear the control so validation triggers
      this.courseForm.patchValue({ image: null });
    }
  }

  // Optional: Format the price input (remove leading zeros, etc.)
  formatNumber(event: any): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    if (!isNaN(value)) {
      input.value = value.toString();
    }
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    const formValue = this.courseForm.value;
    const currentUser = this.authService.getCurrentUser();

    const courseData = {
      title: formValue.title,
      description: formValue.description,
      price: formValue.price,
      objectives: formValue.objectives.filter((obj: string) => obj),
      prerequisites: formValue.prerequisites.filter((pre: string) => pre),
      image: formValue.image,
      instructor_id: currentUser?.id,  // Ensure instructor_id is added
      instructor: currentUser?.fullName || 'Unknown Instructor'
    };

    console.log("Submitting Course Data:", courseData);

    // If in edit mode and currentCourseId is valid, update the course;
    // otherwise, create a new course.
    if (this.isEditMode && this.currentCourseId) {
      this.courseService.updateCourse(this.currentCourseId, courseData).subscribe({
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
}