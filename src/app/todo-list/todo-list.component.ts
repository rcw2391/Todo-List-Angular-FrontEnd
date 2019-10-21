import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { DateModel } from './calendar/date.model';
import { CalendarService } from './calendar/calendar.service';
import { ToDoListItem } from './todo-list-item.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, AfterViewChecked{
  // Currently selecte date
  selectedDate: DateModel;
  // Determines if a date is selected
  isDateSelected: Boolean = false;
  // Determines if a todo list item is selected
  isItemSelected: Boolean = false;
  // Index of to do list item in array
  editItemIndex: number;
  // Element for selected item
  selectedItemElement: ElementRef;
  // Error handling
  isError = false;
  displayError = '';
  // Determines if an item is being editted
  isEdit: boolean = false;

  // Elements for to do inputs
  @ViewChild('editItem', {static: false}) editItem: ElementRef;
  @ViewChild('addItemInput', {static: false}) addItemInput: ElementRef;
  
  // Array of todo lists
  toDoLists: ToDoListItem[] = [];

  // Currently selected list
  itemList: ToDoListItem;

  constructor(private calendarService: CalendarService, private router: Router, private http: HttpClient,
    private authService: AuthService) { }
  ngOnInit() {;
    this.calendarService.toDoListArray.subscribe((toDo: ToDoListItem[]) => {
      this.toDoLists = toDo;
      this.getToDoList();
    });  
    this.calendarService.selectedDate.subscribe((date: DateModel) => {
      this.selectedDate = date;
      this.isDateSelected = true;
      this.itemList = new ToDoListItem(this.selectedDate, []);
      this.getToDoList();
    });
  }

  // Get to do lists
  getToDoList() {
    if (this.isDateSelected){
      let tempItem: ToDoListItem;

      let tempIndex: number = -1;

      tempIndex = this.toDoLists.findIndex(item => {
        return this.toDateString(item.date) === this.toDateString(this.selectedDate);
      });

      if (tempIndex >= 0) {
        this.itemList = this.toDoLists[tempIndex];
      } else {
        this.itemList = new ToDoListItem(this.selectedDate, [])
      }
    }    
  }

  // Return custom string for date
  toDateString(date: DateModel): string {
    return date.date.toString() + date.day.toString() + date.month.toString() + date.year.toString();
  }

  ngAfterViewChecked() {
    if (document.getElementById('item' + 0)) {
      for (let i = 0; i < this.itemList.items.length; i++) {
        if (this.itemList.items[i].completed === true) {
          document.getElementById('item' + i).classList.add("completed");
        }
      }
    }
  }

  // Return the month
  getMonth(position: number){
    return this.calendarService.getMonth(position);
  }

  // Return the day
  getDay(position: number) {
    return this.calendarService.getDay(position);
  }

  // Fired on editing an item
  onEditItem(position: number) {
    this.calendarService.isEditingItem.emit(true);
    this.isItemSelected = true;
    this.itemList.date = this.selectedDate;
    this.editItemIndex = position;
    this.isEdit = true;
    this.addItemInput.nativeElement.value = this.itemList.items[position].item;
  }

  // Fired on closing the edit item window
  onClose() {
    this.isItemSelected = false;
    this.editItem.nativeElement.parentElement.style.visibility = 'hidden';
    this.calendarService.isEditingItem.emit(false);
  }

  // Fired on saving an edited item
  onSaveEditItem() {
    const regex = /[^\w\s]/g;
    if (this.addItemInput.nativeElement.value.length > 50 || regex.test(this.addItemInput.nativeElement.value)) {
      this.isError = true;
      this.displayError = 'Todo Items must be alphanumeric and can be no longer than 50 characters.';
      return;
    }
    this.isError = false;    
    this.itemList.items[this.editItemIndex].item = this.addItemInput.nativeElement.value;
    this.isItemSelected = false;
    this.calendarService.isEditingItem.emit(false);
    this.isEdit = false;
    this.addItemInput.nativeElement.value = '';
    if (this.editItem.nativeElement.value.length < 1) {
      this.onRemoveItem(this.editItemIndex);
    }
  }

  // Fired on completing an item
  onFinishItem(position: number) {
    if (document.getElementById('item' + position).classList.contains("completed")) {
      document.getElementById('item' + position).classList.remove("completed");
      this.itemList.items[position].completed = false;  
    } else {
        this.itemList.items[position].completed = true;
        document.getElementById('item' + position).classList.add("completed");
    }
  }

  // Fired on removing an item
  onRemoveItem(position: number){
    this.itemList.items.splice(position, 1);
    let itemIndex = this.toDoLists.findIndex(item => {
      return this.toDateString(item.date) === this.toDateString(this.selectedDate);
    });
    if (itemIndex >= 0) {
      this.toDoLists[itemIndex] = this.itemList;
    } else {
      this.toDoLists.push(this.itemList);
    }
  }

  // Fired on adding an item
  onAddItem(){
    if (this.addItemInput.nativeElement.value.length < 1){
      return;
    }
    if (this.isEdit){
      this.onSaveEditItem();
      return;
    }
    const regex = /^\w^\s/g;
    this.addItemInput = new ElementRef(document.getElementById('addItemInput'));
    if (this.addItemInput.nativeElement.value.length > 50 || regex.test(this.addItemInput.nativeElement.value)){
      this.isError = true;
      this.displayError = 'Todo Items must be alphanumeric and can be no longer than 50 characters.';
      return;
    }
    if (this.itemList.items.length < 1) {
      this.itemList = new ToDoListItem(this.selectedDate, [{item: this.addItemInput.nativeElement.value, completed: false}]);
    } else {
        this.itemList.items.push({item: this.addItemInput.nativeElement.value, completed: false});
    }
    let itemIndex = this.toDoLists.findIndex(item => {
      return this.toDateString(item.date) === this.toDateString(this.selectedDate);
    });
    if (itemIndex >= 0) {
      this.toDoLists[itemIndex] = this.itemList;
    } else {
      this.toDoLists.push(this.itemList);
    }
    this.addItemInput.nativeElement.value = '';
    this.isError = false;
  }

  // Fired on clicking save
  onSaveList() {
    let itemIndex = this.toDoLists.findIndex(item => {
      return this.toDateString(item.date) === this.toDateString(this.selectedDate);
    });
    if (itemIndex >= 0){
      this.toDoLists[itemIndex] = this.itemList;
    } else {
      this.toDoLists.push(this.itemList);
    }
    this.calendarService.postItems(this.toDoLists, this.authService._id, this.authService.authToken)
      .subscribe(result => {
        console.log(result);
        this.isError = false;
        this.calendarService.loadNewSave.emit(true);
      }, error => {
        console.log(error);
          if (error.error.message === 'Todo Items must be alphanumeric and can be no longer than 50 characters.') {
            this.isError = true;
            this.displayError = error.error.message;
          }
      });
  }
}
