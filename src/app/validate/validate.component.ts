import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.css']
})
export class ValidateComponent implements OnInit {
  token: string = '';
  isError: boolean = false;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit() {
  this.token = this.route.snapshot.params['token'];
  }

  onSubmit(form: NgForm){
    this.authService.postValidate(form.value.email, this.token).subscribe(responseData => {
      if (responseData.message === 'Validation succeeded, please login to continue.') {
        this.authService.displayMessage = true;
        this.authService.messageToDisplay = responseData.message;
        this.router.navigate(['/auth']);  
      }
    }, error => {
      this.isError = true;
      this.errorMessage = error.error.message;
    });
  }
}
