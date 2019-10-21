import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  // Handles Errors
  isError: boolean = false;
  errorMessage: string = '';
  // Token for reset
  token: string = '';

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];
  }

  // Fired on submitting form
  onSubmit(form: NgForm){
    this.authService.postSubmitNewPassword(form.value.email, form.value.password, form.value.confirmPassword, 
      this.token).subscribe(responseData => {
        this.authService.displayMessage = true;
        this.authService.messageToDisplay = responseData.message;
        this.router.navigate(['/auth']);  
      }, error => {
        this.isError = true;
        this.errorMessage = error.error.message;
      });
  }
}
