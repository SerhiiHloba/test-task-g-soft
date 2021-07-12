import { EmailValidationService } from './../../services/email-validation.service';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss'],
  providers: [DatePipe],
})
export class ProfileEditorComponent implements OnInit {
  frameworkData = {
    angular: ['1.1.1', '1.2.1', '1.3.3'],
    react: ['2.1.2', '3.2.4', '4.3.1'],
    vue: ['3.3.1', '5.2.1', '5.1.3'],
  };
  frameworks: string[] = [];
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private emailValidation: EmailValidationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.frameworks = Object.keys(this.frameworkData);
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      framework: ['', Validators.required],
      frameworkVersion: [{ value: '', disabled: true }, Validators.required],
      email: [
        '',
        [Validators.required, Validators.email],
        this.emailAsyncValidator.bind(this),
      ],
      hobby: this.fb.array([
        this.fb.group({
          name: this.fb.control('', Validators.required),
          duration: this.fb.control('', Validators.required),
        }),
      ]),
    });
  }

  get hobby(): FormArray {
    return this.profileForm.get('hobby') as FormArray;
  }

  get email() {
    return this.profileForm.get('email');
  }

  addHobby() {
    this.hobby.push(
      this.fb.group({
        name: this.fb.control(''),
        duration: this.fb.control(''),
      })
    );
  }

  submit() {
    const formControls = this.profileForm.value;
    formControls.dateOfBirth = this.datePipe.transform(
      formControls.dateOfBirth,
      'dd-MM-yyyy'
    );
    console.log(this.profileForm.value);
    console.log('VALID', this.profileForm.valid);
    console.log('FORM', this.profileForm);
  }

  getframeworkVersion() {
    return this.frameworkData[this.profileForm.controls['framework'].value];
  }

  // emailValidator(control: FormControl): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       if (control.value === 'test2@test.test') {
  //         resolve({
  //           emailIsUsed: true,
  //         });
  //       } else {
  //         return null;
  //       }
  //     }, 2000);
  //   });
  // }

  emailAsyncValidator(control: FormControl): Observable<ValidationErrors> {
    return this.emailValidation.validateEmail(control.value);
  }

  selectedFramework() {
    if (this.profileForm.controls['framework'].valid) {
      this.profileForm.controls['frameworkVersion'].enable();
    }
  }
}
