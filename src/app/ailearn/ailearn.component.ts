import { Component } from '@angular/core';
import { AIService } from '../ai.service';
import { Course } from '../courses.service';

@Component({
  selector: 'app-ailearn',
  standalone: false,
  
  templateUrl: './ailearn.component.html',
  styleUrl: './ailearn.component.css'
})

export class AILearnComponent {
userInput = '';
  messages: {content: string, isAI: boolean}[] = [];
  isLoading = false;
  recommendedCourses: Course[] = [];

  constructor(private aiService: AIService) {}

  async submitQuery() {
    if (!this.userInput.trim()) return;

    this.messages.push({ content: this.userInput, isAI: false });
    const currentInput = this.userInput;
    this.userInput = '';
    this.isLoading = true;

    try {
      const result = await this.aiService.getCourseRecommendations(currentInput);
      this.messages.push({ content: result.response, isAI: true });
      this.recommendedCourses = result.courses;
    } catch (error) {
      this.messages.push({ content: 'Sorry, there was an error processing your request.', isAI: true });
    }

    this.isLoading = false;
  }
}
