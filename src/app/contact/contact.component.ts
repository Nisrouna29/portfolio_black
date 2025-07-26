import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent  implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;
  showErrorMessage = false;
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      website: [''],
      message: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Initialize EmailJS with your public key
    emailjs.init("oZ1vC1bNptskKWnSn"); // Replace with your actual EmailJS public key
  }

  // Getter methods for easy access to form controls
  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get website() { return this.contactForm.get('website'); }
  get message() { return this.contactForm.get('message'); }

  // Check if field has error and is touched/dirty
  hasError(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Mark all fields as touched to show validation errors
  markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Submit form
  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      // EmailJS template parameters
      const templateParams = {
        from_name: this.contactForm.value.name,
        mail: this.contactForm.value.email,
        website: this.contactForm.value.website || 'Not provided',
        message: this.contactForm.value.message,
        to_name: 'Nesrine',
      };

      // Send email using EmailJS
      await emailjs.send(
        'service_yxffw0w', // Replace with your EmailJS service ID
        'template_iknn7x9', // Replace with your EmailJS template ID
        templateParams
      );

      // Show success message
      this.showSuccessMessage = true;
      this.showErrorMessage = false;
      this.contactForm.reset();

      // Hide success message after 5 seconds
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 5000);

    } catch (error) {
      console.error('Error sending email:', error);
      
      // Show error message
      this.showErrorMessage = true;
      this.showSuccessMessage = false;
      
      // Set specific error message based on error type
      if (error && typeof error === 'object' && 'text' in error) {
        this.errorMessage = `Failed to send message: ${(error as any).text}`;
      } else {
        this.errorMessage = 'Failed to send message. Please check your internet connection and try again.';
      }

      // Hide error message after 7 seconds
      setTimeout(() => {
        this.showErrorMessage = false;
      }, 7000);
      
    } finally {
      this.isSubmitting = false;
    }
  }
}

