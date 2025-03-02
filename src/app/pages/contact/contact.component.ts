import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ContactForm } from '../../models/contact.model';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;

  submitting$ = new BehaviorSubject<boolean>(false);
  submitted$ = new BehaviorSubject<boolean>(false);
  formError$ = new BehaviorSubject<string | null>(null);
  formSuccess$ = new BehaviorSubject<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.markFormGroupTouched(this.contactForm);
      return;
    }

    this.submitting$.next(true);
    this.formError$.next(null);

    const formData: ContactForm = this.contactForm.value;

    this.apiService.submitContactForm(formData).subscribe({
      next: (response) => {
        this.submitting$.next(false);

        if (response.success) {
          this.submitted$.next(true);
          this.formSuccess$.next(response.message);
          this.contactForm.reset();
        } else {
          this.formError$.next(response.message);
        }
      },
      error: (error) => {
        this.submitting$.next(false);
        this.formError$.next('Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer plus tard.');
        console.error('Contact form submission error:', error);
      }
    });
  }

  resetForm(): void {
    this.contactForm.reset();
    this.submitted$.next(false);
    this.formSuccess$.next(null);
    this.formError$.next(null);
  }

  // Helper method to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control: FormControl) => {
      control.markAsTouched();
    });
  }
}
