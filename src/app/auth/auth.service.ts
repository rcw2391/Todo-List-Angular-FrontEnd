import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface AuthResponse {
    message: string;
    token: string;
    _id: string;
}

@Injectable({providedIn: 'root'})
export class AuthService{
    constructor(private http: HttpClient, private router: Router) {}

    authToken: string;
    _id: string;
    isLoggedin: boolean = false;

    displayMessage: boolean = false;
    messageToDisplay: string = '';

    postSignUp(email: string, password: string, confirmPassword: string){
        return this.http.post<AuthResponse>('https://rhino-ware-todo-list.herokuapp.com/signup', {email: email, password: password, 
        confirmPassword: confirmPassword});
    }

    postLogin(email: string, password: string){
        return this.http.post<AuthResponse>('https://rhino-ware-todo-list.herokuapp.com/login', { email: email, password: password });
    }

    logout() {
        this.isLoggedin = false;
        this._id = '';
        this.authToken = '';
        this.router.navigate(['/auth']);
    }

    postValidate(email: string, token: string){
        return this.http.post<AuthResponse>('https://rhino-ware-todo-list.herokuapp.com/validate', {email: email, token: token});
    }

    postResetPassword(email: string){
        return this.http.post<AuthResponse>('https://rhino-ware-todo-list.herokuapp.com/resetpassword', {email: email});    
    }

    postSubmitNewPassword(email: string, password: string, confirmPassword: string, token: string){
        return this.http.post<AuthResponse>('https://rhino-ware-todo-list.herokuapp.com/verifypasswordtoken', 
        {email: email, password: password, confirmPassword: confirmPassword, token: token});
    }
}