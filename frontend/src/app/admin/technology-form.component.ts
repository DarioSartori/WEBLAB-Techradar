import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Tech } from '../services/technologies.api';

@Component({
  standalone: true,
  selector: 'app-technology-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './technology-form.component.html',
  styleUrl: './technology-form.component.scss',
})
export class TechnologyFormComponent implements OnInit, OnChanges {
  @Input() value: Partial<Tech> | null = null;
  @Input() showClassificationFields = false;
  @Input() submitLabel = 'Save';

  @Output() save = new EventEmitter<{
    name: string;
    category: Tech['category'];
    techDescription: string;
    ring?: NonNullable<Tech['ring']>;
    ringDescription?: string;
  }>();

  form!: FormGroup;

  readonly CATEGORY_OPTIONS: Tech['category'][] = [
    'Techniques',
    'Platforms',
    'Tools',
    'LanguagesFrameworks',
  ];

  readonly RING_OPTIONS: NonNullable<Tech['ring']>[] = [
    'Assess',
    'Trial',
    'Adopt',
    'Hold',
  ];

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      category: ['', [Validators.required]],
      techDescription: ['', [Validators.required, Validators.minLength(1)]],
      ring: [''],
      ringDescription: [''],
    });

    if (this.value) this.form.patchValue(this.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.form && this.value) {
      this.form.patchValue(this.value);
    }
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;

    const payload: any = {
      name: v.name,
      category: v.category,
      techDescription: v.techDescription,
    };
    
    if (this.showClassificationFields) {
      if (v.ring) payload.ring = v.ring as NonNullable<Tech['ring']>;
      if (v.ringDescription)
        payload.ringDescription = v.ringDescription as string;
    }
    this.save.emit(payload);
  }
}
