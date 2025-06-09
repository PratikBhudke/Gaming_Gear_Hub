import { Component, OnInit, HostListener, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faDiscord,
  faYoutube,
  faTwitch,
  faCcVisa,
  faCcMastercard,
  faCcAmex,
  faCcApplePay,
  faCcPaypal
} from '@fortawesome/free-brands-svg-icons';
import { 
  faGamepad, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  
  // Icons
  // Social Icons
  faGamepad = faGamepad;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faMapMarkerAlt = faMapMarkerAlt;
  faArrowUp = faArrowUp;
  
  // Brand Icons
  faFacebook = faFacebookF;
  faTwitter = faTwitter;
  faInstagram = faInstagram;
  faDiscord = faDiscord;
  faYoutube = faYoutube;
  faTwitch = faTwitch;
  
  // Payment Icons
  faCcVisa = faCcVisa;
  faCcMastercard = faCcMastercard;
  faCcAmex = faCcAmex;
  faCcApplePay = faCcApplePay;
  faCcPaypal = faCcPaypal;
  
  // Back to top button state
  showBackToTop = false;
  private isBrowser: boolean;
  
  @ViewChild('backToTop', { static: false }) backToTopButton!: ElementRef;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.checkScroll();
    }
  }
  
  // Check scroll position to show/hide back to top button
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      this.checkScroll();
    }
  }
  
  private checkScroll() {
    if (this.isBrowser) {
      this.showBackToTop = window.pageYOffset > 300;
      if (this.backToTopButton) {
        const button = this.backToTopButton.nativeElement;
        if (this.showBackToTop) {
          button.classList.add('visible');
        } else {
          button.classList.remove('visible');
        }
      }
    }
  }
  
  // Scroll to top of the page
  scrollToTop() {
    if (this.isBrowser) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
}
