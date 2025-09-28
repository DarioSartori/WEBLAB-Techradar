import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-viewer-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './viewer-login.page.html',
  styleUrls: ['./viewer-login.page.scss'],
})
export class ViewerLoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  error = '';

  submit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value as any;
    this.auth.loginViewer(email, password).subscribe({
      next: () => this.router.navigateByUrl('/viewer'),
      error: (e) => this.error = e?.error?.message || 'Login failed',
    });
  }
}
