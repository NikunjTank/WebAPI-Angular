import { Component, ViewContainerRef, ComponentRef, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { VerifyAccount, Register } from '../../../model/register';
import { UserProfileUserService } from '../../../service/user/userProfile.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';

import { SpinnerService } from '../../../service/common/spinner.service';
import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { UserComponent } from '../layout/user.component';

@Component({
    selector: 'otp-confirmation',
    templateUrl: 'otpConfirmationForProfile.component.html',
})
export class OTPConfirmationForProfileUserComponent implements IModalDialog {
    @ViewChild('close-button') closeButtonControl: ElementRef;

    register: Register;

    frmVerifyAccount: FormGroup;
    errorMessage: string;

    dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        this.register = options.data;

        this.frmVerifyAccount = this.fb.group({
            MobileOTP: [null],
            EmailOTP: [null]
        });

        if (this.register.IsSendOTPtoEmail) {
            this.frmVerifyAccount.get("EmailOTP").setValidators([Validators.required]);
        }

        if (this.register.IsSendOTPtoMobile) {
            this.frmVerifyAccount.get("MobileOTP").setValidators([Validators.required]);
        }

        this.frmVerifyAccount.updateValueAndValidity();
    }

    constructor(private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private _userService: UserProfileUserService,
        private toastr: ToastrService,
        private spinnerService: SpinnerService,
        private modalService: ModalDialogService,
        private userComponent: UserComponent,
        private viewRef: ViewContainerRef) { }

    VerifyAccount(formData: any): void {
        this.spinnerService.show();

        let userProfile = {
            "UserName": this.register.UserName,
            "FirstName": this.register.FirstName,
            "LastName": this.register.LastName,
            "Mobile": this.register.Mobile,
            "Gender": this.register.Gender,
            "CompanyName": this.register.CompanyName,
            "ProfessionalQualificationId": this.register.ProfessionalQualificationId,
            "MobileOTP": formData.value.MobileOTP,
            "EmailOTP": formData.value.EmailOTP
        };

        this._userService.updateProfile(userProfile)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.toastr.success(data.Description, Global.TOASTR_PROFILE_TITLE, { closeButton: true });
                    window.location.reload();
                    //this.userComponent.GetUserProfile();
                    //let closeButtonCT: HTMLElement = this.closeButtonControl.nativeElement as HTMLElement;
                    //closeButtonCT.click();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_PROFILE_TITLE, { closeButton: true });
                    this.errorMessage = data.Description;
                    return;
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_PROFILE_TITLE, { enableHtml: true, closeButton: true });
                    this.errorMessage = Global.ERROR_MESSAGE;
                    return;
                });
    }
}