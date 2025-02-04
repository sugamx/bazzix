import { Injectable } from '@angular/core';
import { Course, CourseService } from './courses.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { firstValueFrom, map } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})


export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private courseService: CourseService) {
    this.genAI = new GoogleGenerativeAI(environment.API_URL);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async getCourseRecommendations(prompt: string): Promise<{response: string, courses: Course[]}> {
    try {
      // Ensure courses are loaded first
      await firstValueFrom(this.courseService.loadCourses(true));
      
      const courses = await firstValueFrom(
        this.courseService.courses$.pipe(
          map(courses => courses) // Limit to first 10 courses
        )
      );

      if (!courses || courses.length === 0) {
        throw new Error('No courses available');
      }

      const contextPrompt = `Given these available courses:
      ${courses.map(c => `- ${c.title}: ${c.description}`).join('\n')}
      
      The user asks: "${prompt}". 
      You should give more information about the courses. 
      You have to solve any doubts the user may have about the courses.
      You have to become a tutor for user
      If they have asking any questions OR quries regarding the educational thing, you should respond with the relevant information.
      If users asks anything other than courses, you should respond "Please ask about courses only."
      Recommend relevant courses from the list of available courses even if one key word matches like title or descriptions. 

      Respond EXACTLY in this format:
      [Answer]:"your answer"
      [Recommended Courses]: Comma-separated course titles

     
      `;

      console.log('Sending prompt:', contextPrompt);

      const result = await this.model.generateContent(contextPrompt);
      const responseText = result.response.text();
      console.log('AI Response:', responseText);
      
      const recommendedTitles = this.extractCourseTitles(responseText);
      console.log('Parsed Titles:', recommendedTitles);

      const recommendedCourses = courses.filter(c => 
        recommendedTitles.some(title => 
          c.title.toLowerCase().includes(title.toLowerCase())
        )
      );

      return {
        response: responseText,
        courses: recommendedCourses
      };
    } catch (error) {
      console.error('AI Error:', error);
      return {
        response: 'Sorry, I encountered an error. Please try again later.',
        courses: []
      };
    }
  }

  private extractCourseTitles(response: string): string[] {
    // More flexible parsing
    const lines = response.split('\n');
    const coursesLine = lines.find(line => line.startsWith('[Recommended Courses]:'));
    
    if (coursesLine) {
      const titlesPart = coursesLine.split(':')[1].trim();
      return titlesPart.split(',').map(title => title.trim());
    }
    
    // Fallback: Look for course titles in the response
    const courseMatches = response.match(/([A-Z][a-zA-Z0-9\s]+)(?=\s*[:-]|\.|$)/g);
    return courseMatches ? courseMatches.map(title => title.trim()) : [];
  }
}