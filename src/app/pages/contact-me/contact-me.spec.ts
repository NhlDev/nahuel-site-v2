import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideZoneChangeDetection } from '@angular/core';

import { ContactMe } from './contact-me';

describe('ContactMe', () => {
  let component: ContactMe;
  let fixture: ComponentFixture<ContactMe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIcon,
        MatSnackBarModule,
        ContactMe,
      ],
      providers: [provideZoneChangeDetection({ eventCoalescing: true })],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ContactMe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
