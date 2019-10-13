import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { CalendarService } from '../todo-list/calendar/calendar.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLogin: boolean = false;
  isError: boolean = false;
  errorMessage: string = '';
  isRegistered: boolean = false;
  displayMessage: boolean = false;
  messageToDisplay: string = '';

  constructor(private authService: AuthService, private router: Router, private calendarService: CalendarService) { }

  ngOnInit() {
    this.displayMessage = this.authService.displayMessage;
    this.messageToDisplay = this.authService.messageToDisplay;
    if (this.messageToDisplay.includes('please login')){
      this.isLogin = true;
    }
  }

  onSwitch() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm){
    this.calendarService.isLoading.emit(true);
    this.isRegistered = false;
    this.displayMessage = false;
    this.authService.displayMessage = false;
    if (!this.isLogin){
      if (form.value.password !== form.value.confirmPassword){
        this.isError = true;
        this.errorMessage = 'Passwords must match!';
        this.calendarService.isLoading.emit(false);
        return;
      }
    }
    if (this.isLogin){
      this.authService.postLogin(form.value.email, form.value.password).subscribe(responseData => {
        if (responseData.message === 'Login Success') {
          this.authService._id = responseData._id;
          this.authService.authToken = responseData.token;
          this.authService.isLoggedin = true;
          this.calendarService.isLoading.emit(false);
          this.router.navigate(['../todo-list']);
          form.reset();
        }
      }, error => {
        if (error.status === 401){
          this.isError = true;
          this.errorMessage = error.error.message;
        } 
        if (error.status === 429) {
          this.isError = true;
          this.errorMessage = 'Too many login attempts. Please try again in an hour.';
        }
        if (error.status >= 500) {
          this.isError=true;
          this.errorMessage="Server error. Please try again later."
        }
          this.calendarService.isLoading.emit(false);
      });
    } else {
      this.authService.postSignUp(form.value.email, form.value.password, form.value.confirmPassword).subscribe(responseData => {
        if (responseData.message === 'Successfully registered user.') {
          this.isRegistered = true;
          this.calendarService.isLoading.emit(false);
          form.reset();
        }
      }, error => {
        this.isError = true;
        this.errorMessage = error.error.message;
          this.calendarService.isLoading.emit(false);
      }); 
    } 
  }

  onResetPassword(form: NgForm){
    this.calendarService.isLoading.emit(true);
    this.isError = false;
    this.authService.postResetPassword(form.value.email).subscribe(responseData => {
      this.displayMessage = true;
      this.messageToDisplay = responseData.message;
      this.calendarService.isLoading.emit(false);
    }, error => {
      this.isError = true;
      this.errorMessage = error.error.message;
        this.calendarService.isLoading.emit(false);
    });
  }
}
