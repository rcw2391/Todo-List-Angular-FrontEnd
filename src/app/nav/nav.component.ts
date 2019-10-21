import { Component, HostListener} from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  public innerWidth: number;
  // Handles the display of mobile nav
  mobileNav: boolean;
  displayNav: boolean = false;
  
  // Gets window size
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 768){
      this.mobileNav = true;
    } else {
      this.mobileNav = false;
    }
  }

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 768) {
      this.mobileNav = true;
    } else {
      this.mobileNav = false;
    }
  }

  // Fired on clicking logout
  onLogout() {
    this.authService.logout();
  }
}
