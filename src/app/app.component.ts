import { Component, OnInit } from '@angular/core';
import { CalendarService } from './todo-list/calendar/calendar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(private calendarService: CalendarService) {}
  
  title = 'front-end';
  isLoading: boolean = false;

  ngOnInit() {
    this.calendarService.isLoading.subscribe(load => {
      this.isLoading = load;
    });
  }
}