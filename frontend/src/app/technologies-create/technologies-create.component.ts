import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-technologies-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './technologies-create.component.html',
  styleUrls: ['./technologies-create.component.scss'],
})
export class TechnologiesCreateComponent {
  form: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      ring: ['', Validators.required],
      techDescription: ['', Validators.required],
      ringDescription: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.http.post('/api/technologies', this.form.value).subscribe({
      next: () => alert('Gespeichert!'),
      error: (e) =>
        (this.error = e?.error?.message ?? 'Save fehlgeschlagen'),
    });
  }
}
