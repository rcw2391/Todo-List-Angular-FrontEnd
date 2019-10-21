import { Component, OnInit, AfterViewChecked} from '@angular/core';
import { DateModel } from './date.model';
import { CalendarService } from './calendar.service';

import { HttpClient } from '@angular/common/http';
import { ToDoListItem } from '../todo-list-item.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit, AfterViewChecked {
  
  // Calendar state management
  loadNewSave: boolean = false;
  isFreshLoad: boolean = true;
  isEditing: boolean = false;

  // Current date
  date: Date;
  month: string;
  year: number;
  // The first day on the calendar
  startingDayOnCalendar: DateModel;
  // The next day on the calendar
  nextDayOnCalendar: DateModel;
  // Currently selected month
  currentMonth: number;
  // The number of days in each month
  daysInMonths = {
    0: 31,
    1: 28,
    2: 31,
    3: 30,
    4: 31,
    5: 30,
    6: 31,
    7: 31,
    8: 30,
    9: 31,
    10: 30,
    11: 31
  }
  // Days of the week
  week: string[] = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ];

  
  // Display days on calendar
  weekOne: DateModel[] = [];
  weekTwo: DateModel[] = [];
  weekThree: DateModel[] = [];
  weekFour: DateModel[] = [];
  weekFive: DateModel[] = [];
  weekSix: DateModel[] = [];

  // To do list
  toDoArray: ToDoListItem[] = [];

  // Previously selected day
  previouslySelected: DateModel;

  constructor(private calendarService: CalendarService, private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    this.date = new Date();
    this.currentMonth = this.date.getMonth();
    this.month = this.calendarService.getMonth(this.currentMonth);
    this.year = this.date.getFullYear();
    this.generateCalendarDates();
    this.generateItems();
    this.calendarService.loadNewSave.subscribe((result: boolean) => {
      this.calendarService.isLoading.emit(true);
      this.generateItems();
    });
    this.calendarService.isEditingItem.subscribe((result: boolean) => {
      this.isEditing = result;
    });
  }

  ngAfterViewChecked() {
    if (!this.isFreshLoad && (document.getElementById(this.previouslySelected.date.toString() + this.previouslySelected.month + this.previouslySelected.year))){
      document.getElementById(this.previouslySelected.date.toString() + this.previouslySelected.month + this.previouslySelected.year).classList.add('dateSelected');
    }
    for (let toDo of this.toDoArray) {
      if (document.getElementById(toDo.date.date.toString() + toDo.date.month.toString() + toDo.date.year.toString())) {
        document.getElementById(toDo.date.date.toString() + toDo.date.month.toString() + toDo.date.year.toString()).classList.add('hasList');
      }
      if (toDo.items.length < 1) {
        if (document.getElementById(toDo.date.date.toString() + toDo.date.month.toString() + toDo.date.year.toString())){
          document.getElementById(toDo.date.date.toString() + toDo.date.month.toString() + toDo.date.year.toString()).classList.remove('hasList');
        }
      }
    }     
  }

  // Retrieve to do list for a day
  generateItems() {
    this.calendarService.getItems().subscribe((result: {todo: ToDoListItem[]}) => {
      let tempTodo: ToDoListItem;
      this.toDoArray = [];
      if (result.todo.length > 0) {
        for (let toDo of result.todo) {
          tempTodo = new ToDoListItem(toDo.date, toDo.items);
          this.toDoArray.push(tempTodo);
        }
      }
      this.calendarService.toDoListArray.emit(this.toDoArray);
      this.calendarService.isLoading.emit(false);
      this.loadNewSave = false;
      for (let toDo of this.toDoArray){
        if (document.getElementById(toDo.date.date.toString() + toDo.date.month.toString() + toDo.date.year.toString())) {
          document.getElementById(toDo.date.date.toString() + toDo.date.month.toString() + toDo.date.year.toString()).classList.add('hasList');
        }
        if (toDo.items.length < 1){
          document.getElementById(toDo.date.date.toString() + toDo.date.month.toString() + toDo.date.year.toString()).classList.remove('hasList');
        }  
      }      
    });
  }

  // Toggle to the next month
  nextMonth() {
    if (this.currentMonth === 11) {
      this.year += 1;
      this.currentMonth = 0;
    } else {
      this.currentMonth += 1;
    }
    this.month = this.calendarService.getMonth(this.currentMonth);
    this.generateCalendarDates();
  }

  // Toggle to the previous month
  previousMonth() {
    if (this.currentMonth === 0){
      this.year -= 1;
      this.currentMonth = 11;
    } else {
      this.currentMonth -= 1;
    }
    this.month = this.calendarService.getMonth(this.currentMonth);
    this.generateCalendarDates();
  }

  // Toggle year
  nextYear() {
    this.year += 1;
    this.generateCalendarDates();
  }

  previousYear() {
    this.year -= 1;
    this.generateCalendarDates();
  }

  // Get the first day to display on calendar
  getStartingDay() {
    if (this.year % 4 === 0) {
      this.daysInMonths[1] = 29;
    } else {
      this.daysInMonths[1] = 28;
    }
    this.date.setFullYear(this.year);
    this.date.setMonth(this.currentMonth);
    this.date.setDate(1);
    const startDay = this.date.getDay();
    if (startDay === 0) {
      this.startingDayOnCalendar = new DateModel(1, 0, this.currentMonth, this.year);
    } else {
      const startMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
      const startYear = this.currentMonth === 0 ? this.year - 1 : this.year;
      const startDate = this.daysInMonths[startMonth] - this.date.getDay() + 1;
      const firstDay = 0;
      this.startingDayOnCalendar = new DateModel(startDate, firstDay, startMonth, startYear);
    }
    this.calendarService.previouslySelectedDate = this.startingDayOnCalendar;
  }

  // Get the next day to display for calendar
  getNextDay(currentDay: DateModel) {
    let nextDayDay: number;
    let nextDayDate: number;
    let nextDayMonth: number;
    let nextDayYear: number;
    if(currentDay.day === 6){
      nextDayDay = 0;
    } else {
      nextDayDay = currentDay.day + 1;
    }
    if (currentDay.date === this.daysInMonths[currentDay.month]){
      nextDayDate = 1;
      if (currentDay.month === 11) {
        nextDayYear = this.year + 1;
        nextDayMonth = 0;
      } else {
        nextDayMonth = currentDay.month + 1;
        nextDayYear = currentDay.year;
      }
    } else {
      nextDayDate = currentDay.date + 1;
      nextDayMonth = currentDay.month;
      nextDayYear = currentDay.year;
    }
    this.nextDayOnCalendar = new DateModel(nextDayDate, nextDayDay, nextDayMonth, nextDayYear);
  }

  // Generate the dates for the calendar
  generateCalendarDates() {
    this.getStartingDay();
    if (this.weekOne.length === 0){
      for (let i = 0; i < 42; i++) {
        if (i === 0) {
          this.nextDayOnCalendar = this.startingDayOnCalendar;
          this.weekOne.push(this.startingDayOnCalendar);
        } else {
          this.getNextDay(this.nextDayOnCalendar);
          if(i !== 0 && i < 7){
            this.weekOne.push(this.nextDayOnCalendar);
          }
          if(i >= 7 && i < 14) {
            this.weekTwo.push(this.nextDayOnCalendar);
          }
          if(i >= 14 && i < 21) {
            this.weekThree.push(this.nextDayOnCalendar);
          }
          if (i >= 21 && i < 28) {
            this.weekFour.push(this.nextDayOnCalendar);
          }
          if (i >= 28 && i < 35) {
            this.weekFive.push(this.nextDayOnCalendar);
          }
          if (i >= 35 && i < 42) {
            this.weekSix.push(this.nextDayOnCalendar);
          }
        }
      }
    } else {
      for (let i = 0; i < 42; i++) {
        if (i === 0) {
          this.weekOne[i] = this.startingDayOnCalendar;
          this.nextDayOnCalendar = this.startingDayOnCalendar;
        } else {
          this.getNextDay(this.nextDayOnCalendar);
          if (i !== 0 && i < 7) {
            this.weekOne[i] = this.nextDayOnCalendar;
          }
          if (i >= 7 && i < 14) {
            this.weekTwo[i-7] = this.nextDayOnCalendar;
          }
          if (i >= 14 && i < 21) {
            this.weekThree[i-14] = this.nextDayOnCalendar;
          }
          if (i >= 21 && i < 28) {
            this.weekFour[i-21] = this.nextDayOnCalendar;
          }
          if (i >= 28 && i < 35) {
            this.weekFive[i-28] = this.nextDayOnCalendar;
          }
          if (i >= 35 && i < 42) {
            this.weekSix[i-35] = this.nextDayOnCalendar;
          }
        }
      }
    }
  }

  // Fired on selecting a day on the calendar
  onDate(date: DateModel){
    if (!this.isEditing) {
      if (!this.isFreshLoad && document.getElementById(this.previouslySelected.date.toString() + this.previouslySelected.month + this.previouslySelected.year)) {
        document.getElementById(this.previouslySelected.date.toString() + this.previouslySelected.month + this.previouslySelected.year).classList.remove('dateSelected');
      }
      this.isFreshLoad = false;
      if (date.month < this.currentMonth && date.month !== 0 || (date.month === 0 && this.currentMonth === 1)) {
        this.previousMonth();
      } else if (date.month === 11 && this.currentMonth === 0) {
        this.previousMonth();
      }
      if (date.month > this.currentMonth) {
        this.nextMonth();
      } else if (date.month === 0 && this.currentMonth === 11) {
        this.nextMonth();
      }
      this.calendarService.previouslySelectedDate = date;
      this.previouslySelected = date;
      this.calendarService.selectedDate.emit(date);
      document.getElementById(date.date.toString() + date.month + date.year).classList.add('dateSelected');
    }
  }
}
