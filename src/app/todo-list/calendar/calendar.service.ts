import { EventEmitter, Injectable } from '@angular/core';

import { DateModel } from './date.model';
import { ToDoListItem } from '../todo-list-item.model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class CalendarService {
    constructor(private http: HttpClient, private authService: AuthService){}
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
    private days: string[] = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];
    selectedDate = new EventEmitter<DateModel>();

    toDoListArray = new EventEmitter<ToDoListItem[]>();

    loadNewSave = new EventEmitter<boolean>();

    previouslySelectedDate: DateModel;

    isEditingItem = new EventEmitter<boolean>();

    getMonth(position: number){
        return this.months[position];
    }

    getDay(position: number){
        return this.days[position];
    }

    getItems(){
        return this.http.get<{ todo: ToDoListItem[] }>('https://rhino-ware-todo-list.herokuapp.com/todo-list', 
        {headers: new HttpHeaders({'token': this.authService.authToken, '_id': this.authService._id})});
    }

    postItems(itemsToPost: ToDoListItem[], id: string, token: string) {
        const request = {items: itemsToPost, _id: id, token: token};
        return this.http.post('https://rhino-ware-todo-list.herokuapp.com/todo-list', request);
    }
}