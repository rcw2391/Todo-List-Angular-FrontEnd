import { DateModel } from './calendar/date.model';
import { identifierModuleUrl } from '@angular/compiler';

export class ToDoListItem {
    constructor(public date: DateModel, public items: Array<any>) {}
}