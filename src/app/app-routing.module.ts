import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { ValidateComponent } from './validate/validate.component';
import { ResetComponent } from './reset/reset.component';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'todo-list', canActivate: [AuthGuard], component: TodoListComponent},
    {path: 'auth', component: AuthComponent},
    {path: 'validate/:token', component: ValidateComponent},
    {path: 'reset/:token', component: ResetComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}