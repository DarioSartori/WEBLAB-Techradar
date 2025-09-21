import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-technology-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './technology-form.component.html',
  styleUrl: './technology-form.component.scss',
})
export class TechnologyFormComponent {
  private fb = inject(FormBuilder);

  private _published = false;
  @Input() set published(v: boolean) {
    this._published = !!v;
    const ring = this.form.get('ring');
    const ringDesc = this.form.get('ringDescription');

    if (this._published) {
      ring?.setValidators([Validators.required]);
      ringDesc?.setValidators([Validators.required]);
    } else {
      ring?.clearValidators();
      ringDesc?.clearValidators();
    }
    ring?.updateValueAndValidity({ emitEvent: false });
    ringDesc?.updateValueAndValidity({ emitEvent: false });
  }
  get published() {
    return this._published;
  }

  @Output() save = new EventEmitter<any>();

  form = inject(FormBuilder).group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    ring: [''],
    techDescription: ['', [Validators.required]],
    ringDescription: [''],
  });

  @Input() set initial(val: any) {
    if (!val) return;
    this.form.patchValue(
      {
        name: val.name ?? '',
        category: val.category ?? '',
        ring: val.ring ?? '',
        techDescription: val.techDescription ?? '',
        ringDescription: val.ringDescription ?? '',
      },
      { emitEvent: false }
    );
  }

  submit() {
    if (this.form.valid) this.save.emit(this.form.value);
  }
}
