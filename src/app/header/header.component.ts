import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isResponsive = false;

  toggleResponsive() {
    this.isResponsive = !this.isResponsive;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth > 810) {
      this.isResponsive = false;
    }
  }
  downloadCv() {
    const link = document.createElement('a');
    link.href = '/cv/cv.pdf'; // Adjust the path to your CV file
    link.download = 'NesrineGhribiResume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
