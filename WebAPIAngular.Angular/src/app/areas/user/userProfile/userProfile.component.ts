import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserProfile, GetUserProfileRequest } from '../../../model/userProfile';
import { UserProfileUserService } from '../../../service/user/userProfile.service';
import { Global } from '../../../common/global';

import { SpinnerService } from '../../../service/common/spinner.service';
import { CommonFieldService } from '../../../service/common/commonField.service';
import { DropDown } from '../../../common/dropDown';
import { GetCommonFieldRequest } from '../../../model/commonField';

import { ModalDialogService } from 'ngx-modal-dialog';
import { OTPConfirmationForProfileUserComponent } from './otpConfirmationForProfile.component';
import { UserComponent } from '../layout/user.component';

@Component({
    selector: 'app-profile',
    templateUrl: './userProfile.component.html'
})

export class UserProfileUserComponent {

    constructor(private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private _userService: UserProfileUserService,
        private _commonFieldService: CommonFieldService,
        private toastr: ToastrService,
        private viewRef: ViewContainerRef,
        private spinnerService: SpinnerService,
        private userComponent: UserComponent,
        private modalService: ModalDialogService) { }

    userName: string;
    mobile: string;

    profile: UserProfile;
    frmProfile: FormGroup;
    errorMessage: string;
    successMessage: string;
    _global: Global = new Global();
    professionalQualifications: DropDown[] = [];

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.GetProfile();

        this.frmProfile = this.fb.group({
            UserName: ['', Validators.compose([Validators.required, Validators.email])],
            FirstName: ['', Validators.required],
            LastName: ['', Validators.required],
            Mobile: ['', Validators.required],
            Gender: ['', Validators.required],
            CompanyName: [''],
            ProfessionalQualificationId: ['', Validators.required]
        });
    }

    GetProfessionalQualification(profileData): void {
        this.spinnerService.show();

        let getCommonFieldRequest = new GetCommonFieldRequest();
        getCommonFieldRequest.FieldTypeName = Global.COMMON_FIELD_PROFESSIONAL_QUALIFICATION;

        this._commonFieldService.getCommonField(getCommonFieldRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.professionalQualifications = [];

                if (data.Status == Global.API_SUCCESS) {
                    this.professionalQualifications.push({ Value: "", Text: "Professional Qualification" });

                    data.Response.forEach(item => {
                        this.professionalQualifications.push({ Value: item.FieldId, Text: item.FieldName });
                    });

                    this.frmProfile.get("ProfessionalQualificationId").setValue(profileData.ProfessionalQualificationId);
                    this.frmProfile.updateValueAndValidity();
                }
                else {
                    this.toastr.error(data.Description, Global.TOASTR_PROFILE_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_PROFILE_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetProfile(): void {
        this.spinnerService.show();

        let getProfileRequest = new GetUserProfileRequest();

        this._userService.getUserProfile(getProfileRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.frmProfile.setValue({
                        UserName: data.Response[0].UserName,
                        FirstName: data.Response[0].FirstName,
                        LastName: data.Response[0].LastName,
                        Mobile: data.Response[0].Mobile,
                        Gender: data.Response[0].Gender,
                        CompanyName: data.Response[0].CompanyName,
                        ProfessionalQualificationId: data.Response[0].ProfessionalQualificationId
                    });

                    this.GetProfessionalQualification(data.Response[0]);

                    this.userName = data.Response[0].UserName;
                    this.mobile = data.Response[0].Mobile;
                } else {
                    this.spinnerService.hide();
                    this.toastr.error(data.Description, Global.TOASTR_PROFILE_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_PROFILE_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SendOTP(formData: any): void {
        this.spinnerService.show();

        let isSendOTPtoMobile = (formData.value.Mobile != this.mobile);
        let isSendOTPtoEmail = (formData.value.UserName != this.userName);

        var userProfile = {
            UserName: formData.value.UserName,
            FirstName: formData.value.FirstName,
            LastName: formData.value.LastName,
            Mobile: formData.value.Mobile,
            Gender: formData.value.Gender,
            CompanyName: formData.value.CompanyName,
            ProfessionalQualificationId: formData.value.ProfessionalQualificationId,
            IsSendOTPtoMobile: isSendOTPtoMobile,
            IsSendOTPtoEmail: isSendOTPtoEmail
        }

        this._userService.sendOTPForUserProfile(userProfile)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.toastr.success(data.Description, Global.TOASTR_PROFILE_TITLE, { closeButton: true });
                    this.OpenDialog(userProfile);
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

    OnSubmitUpdateProfile(formData: any): void {
        this.isSubmited = true;
        this.errorMessage = "";
        this.successMessage = "";
        
        if (this.frmProfile.valid) {
            if (formData.value.UserName != this.userName || formData.value.Mobile != this.mobile) {
                let message = (formData.value.UserName != this.userName) ? "You are going to change your email.\nYour new email will be as '" + formData.value.UserName + "'.\nAre you sure, You want to change your email?\n\n" : "";
                message += (formData.value.Mobile != this.mobile) ? "You are going to change your mobile.\nYour new mobile will be as '" + formData.value.Mobile + "'.\nAre you sure, You want to change your mobile?" : "";

                let confirmBox = confirm(message);

                if (confirmBox) {
                    this.SendOTP(formData);
                }
            } else {
                this.UpdateProfile(formData);
            }
        }
    }

    UpdateProfile(formData: any): void {
        this.spinnerService.show();

        let user = {
            "UserName": formData.value.UserName,
            "FirstName": formData.value.FirstName,
            "LastName": formData.value.LastName,
            "Mobile": formData.value.Mobile,
            "Gender": formData.value.Gender,
            "CompanyName": formData.value.CompanyName,
            "ProfessionalQualificationId": formData.value.ProfessionalQualificationId
        };

        this._userService.updateProfile(user)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.userComponent.GetUserProfile();
                    this.toastr.success(data.Description, Global.TOASTR_PROFILE_TITLE, { closeButton: true });
                    this.successMessage = data.Description;
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

    OpenDialog(user) {
        this.modalService.openDialog(this.viewRef, {
            settings: {
                headerClass: "hide",
                footerClass: "no-pad",
                contentClass: "otp-confirm-modal-content modal-content"
            },
            actionButtons: [{
                text: "x", buttonClass: "pointer-cursor close-button"
            }],
            childComponent: OTPConfirmationForProfileUserComponent,
            data: user
        });
    }
}
