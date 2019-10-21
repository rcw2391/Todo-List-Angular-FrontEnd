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

    // Token provided by back end
    authToken: string;
    // User ID
    _id: string;
    // Handles user logged in state
    isLoggedin: boolean = false;

    // Message to display
    displayMessage: boolean = false;
    messageToDisplay: string = '';

    // Send post request to register
    postSignUp(email: string, password: string, confirmPassword: string){
        return this.http.post<AuthResponse>('https://rhino-ware-todo-list.herokuapp.com/signup', {email: email, password: password, 
        confirmPassword: confirmPassword});
    }

    // Send post request to login
    postLogin(email: string, password: string){
        return this.http.post<AuthResponse>('https://rhino-ware-todo-list.herokuapp.com/login', { email: email, password: password });
    }

    // Logout
    logout() {
        this.isLoggedin = false;
        this._id = '';
        this.authToken = '';
        this.router.navigate(['/auth']);
    }

    // Post request to validate account
    postValidate(email: string, token: string){
        return this.http.post<AuthResponse>('https://rhino-ware-todo-list.herokuapp.com/validate', {email: email, token: token});
    }

    // Post request to reset password
    postResetPassword(email: string){
        return this.http.post<AuthResponse>('https://rhino-ware-todo-list.herokuapp.com/resetpassword', {email: email});    
    }

    // Post request to change password
    postSubmitNewPassword(email: string, password: string, confirmPassword: string, token: string){
        return this.http.post<AuthResponse>('https://rhino-ware-todo-list.herokuapp.com/verifypasswordtoken', 
        {email: email, password: password, confirmPassword: confirmPassword, token: token});
    }
}