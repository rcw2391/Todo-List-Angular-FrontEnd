import { DateModel } from './calendar/date.model';

// Model for items in a to do list

export class ToDoListItem {
    constructor(public date: DateModel, public items: Array<any>) {}
}