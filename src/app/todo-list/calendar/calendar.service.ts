import { EventEmitter, Injectable } from '@angular/core';

import { DateModel } from './date.model';
import { ToDoListItem } from '../todo-list-item.model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class CalendarService {
    constructor(private http: HttpClient, private authService: AuthService){}
    // Months array
    private months: string[] = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    // Days of the week array
    private days: string[] = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    // Select a date on the calendar event
    selectedDate = new EventEmitter<DateModel>();

    // Publish to do list event
    toDoListArray = new EventEmitter<ToDoListItem[]>();

    // State management for loading a new list
    loadNewSave = new EventEmitter<boolean>();

    // View management
    previouslySelectedDate: DateModel;

    // Fired if an item is being editted
    isEditingItem = new EventEmitter<boolean>();

    // Fired when waiting response from back end
    isLoading = new EventEmitter<boolean>();

    // Retrieve month from array
    getMonth(position: number){
        return this.months[position];
    }

    // Retrieve day of the week from array
    getDay(position: number){
        return this.days[position];
    }

    // Retrieve items from back end
    getItems(){
        return this.http.get<{ todo: ToDoListItem[] }>('https://rhino-ware-todo-list.herokuapp.com/todo-list', 
        {headers: new HttpHeaders({'token': this.authService.authToken, '_id': this.authService._id})});
    }

    // Post items to back end
    postItems(itemsToPost: ToDoListItem[], id: string, token: string) {
        const request = {items: itemsToPost, _id: id, token: token};
        return this.http.post('https://rhino-ware-todo-list.herokuapp.com/todo-list', request);
    }
}