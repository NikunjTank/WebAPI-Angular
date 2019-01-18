import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GetUserProfileRequest, UserProfile } from '../../../model/userProfile';
import { GetSubscriptionRequest } from '../../../model/subscription';
import { SubscriptionAdminService } from '../../../service/admin/subscription.service';
import { UserProfileAdminService } from '../../../service/admin/userProfile.service';
import { CommonFieldService } from '../../../service/common/commonField.service';
import { DropDown } from '../../../common/dropDown';
import { GetCommonFieldRequest } from '../../../model/commonField';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';

import { ModalDialogService } from 'ngx-modal-dialog';
import { OTPConfirmationForProfileAdminComponent } from './otpConfirmationForProfile.component';

@Component({
    selector: 'my-app',
    templateUrl: './userProfile.component.html'
})

export class UserProfileAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _subscriptionService: SubscriptionAdminService,
        private _userProfileService: UserProfileAdminService,
        private viewRef: ViewContainerRef,
        private spinnerService: SpinnerService,
        private _commonFieldService: CommonFieldService,
        private modalService: ModalDialogService) { }

    _global: Global = new Global();

    userProfile: any = {};
    subscriptions: any[];
    userId: number = 0;
    isSubscriptionAdded: boolean = false;
    professionalQualifications: DropDown[] = [];
    userName: string;
    mobile: string;
    isSubmitedUserProfile: boolean = false;

    frmProfile: FormGroup;
    errorMessage: string;
    successMessage: string;

    minDate: any = { year: 1970, month: 1, day: 1 };
    minStartDate: any = { year: 1970, month: 1, day: 1 };
    isPaymentDatePicker: boolean = false;

    frmSubscription: FormGroup;
    msg: string;

    subscriptionHistories: any[];
    frmSubscriptionHistory: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number = 1;
    pageSize: number;
    pageSizes: number[];

    drpPageSize: number;

    sortingSubscriptionHistoryField: string;
    sortingSubscriptionHistoryDirection: string;
    colourCode: any = { "Active": "#32CD32", "Expired": "#FF0000", "No Subscription": "#666600", "Pending": "#0000FF" }

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let userId = this._global.decryptValue(params['userId']);

            if (userId) {
                this.userId = parseInt(userId);
                this.GetUserProfile();
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/userprofiles'], {
                        queryParams: {
                            sortingUserProfileField: params["sortingUserProfileField"], sortingUserProfileDirection: params["sortingUserProfileDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                        }
                    });
                });
            }
        });

        this.frmProfile = this.formBuilder.group({
            UserId: [this.userId],
            UserName: ['', Validators.compose([Validators.required, Validators.email])],
            FirstName: ['', Validators.required],
            LastName: ['', Validators.required],
            Mobile: ['', Validators.required],
            Gender: ['', Validators.required],
            CompanyName: [''],
            ProfessionalQualificationId: ['', Validators.required]
        });

        this.frmSubscription = this.formBuilder.group({
            SubscriptionId: [''],
            StartDate: ['', Validators.required],
            PaymentDate: ['', Validators.required],
            UserId: [this.userId]
        });

        this.pageSizes = Global.PAGE_SIZES;
        this.pageSize = this.pageSizes[0];
        this.drpPageSize = this.pageSize;

        this.frmSubscriptionHistory = this.formBuilder.group({
            SearchText: [this.searchText]
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
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_USER_PROFILE_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_USER_PROFILE_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetUserProfile(): void {
        this.spinnerService.show();

        let getUserProfileRequest = new GetUserProfileRequest();
        getUserProfileRequest.UserId = this.userId;

        this._userProfileService.getUserProfile(getUserProfileRequest)
            .subscribe(data => {
                //this.spinnerService.hide();
                this.GetSubscriptionHistory(this.searchText, this.currentPage, this.pageSizes[0]);

                if (data.Status == Global.API_SUCCESS) {
                    //this.userProfile = data.Response[0];
                    this.frmProfile.setValue({
                        UserId: data.Response[0].UserId,
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
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_USER_PROFILE_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_USER_PROFILE_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    SendOTP(formData: any): void {
        this.spinnerService.show();

        let isSendOTPtoMobile = (formData.value.Mobile != this.mobile);
        let isSendOTPtoEmail = (formData.value.UserName != this.userName);

        var userProfile = {
            UserId: formData.value.UserId,
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

        this._userProfileService.sendOTPForUserProfile(userProfile)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.toastr.success(data.Description, Global.TOASTR_ADMIN_USER_PROFILE_TITLE, { closeButton: true });
                    this.OpenDialog(userProfile);
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_USER_PROFILE_TITLE, { closeButton: true });
                    this.errorMessage = data.Description;
                    return;
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_USER_PROFILE_TITLE, { enableHtml: true, closeButton: true });
                    this.errorMessage = Global.ERROR_MESSAGE;
                    return;
                });
    }

    OnSubmitUpdateProfile(formData: any): void {
        this.isSubmitedUserProfile = true;
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
            "UserId": formData.value.UserId,
            "UserName": formData.value.UserName,
            "FirstName": formData.value.FirstName,
            "LastName": formData.value.LastName,
            "Mobile": formData.value.Mobile,
            "Gender": formData.value.Gender,
            "CompanyName": formData.value.CompanyName,
            "ProfessionalQualificationId": formData.value.ProfessionalQualificationId
        };

        this._userProfileService.updateProfile(user)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.toastr.success(data.Description, Global.TOASTR_ADMIN_USER_PROFILE_TITLE, { closeButton: true });
                    this.successMessage = data.Description;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_USER_PROFILE_TITLE, { closeButton: true });
                    this.errorMessage = data.Description;
                    return;
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_USER_PROFILE_TITLE, { enableHtml: true, closeButton: true });
                    this.errorMessage = Global.ERROR_MESSAGE;
                    return;
                });
    }

    OpenDialog(user) {
        this.modalService.openDialog(this.viewRef, {
            title: "OTP Confirmation",
            settings: {
                footerClass: "hide"
            },
            childComponent: OTPConfirmationForProfileAdminComponent,
            data: user
        });
    }

    GetSubscriptionHistory(searchText?: string, pageNumber?: number, pageSize?: number) {
        this.spinnerService.show();

        let getSubscriptionRequest = new GetSubscriptionRequest();
        getSubscriptionRequest.UserId = this.userId;
        getSubscriptionRequest.SearchText = searchText;
        getSubscriptionRequest.IsActive = null;
        getSubscriptionRequest.OrderBy = this.sortingSubscriptionHistoryField;
        getSubscriptionRequest.OrderByDirection = this.sortingSubscriptionHistoryDirection;
        getSubscriptionRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getSubscriptionRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._subscriptionService.getSubscription(getSubscriptionRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.subscriptionHistories = data.Response;

                if (!this.subscriptions || this.subscriptions.length <= 0)
                    this.subscriptions = data.Response;

                if (this.subscriptions && this.subscriptions.length > 0) {
                    if (this.subscriptions[0].StartDate)
                        this.isSubscriptionAdded = true;
                }
            }, error => this.msg = <any>error);
    }

    SearchSubscriptionHistory(formData) {
        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.GetSubscriptionHistory(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetSubscriptionHistory(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.GetSubscriptionHistory(this.searchText, null, this.pageSize);
    }

    OnSubscriptionHistorySort(fieldName) {
        this.sortingSubscriptionHistoryDirection = (this.sortingSubscriptionHistoryField == fieldName) ? (this.sortingSubscriptionHistoryDirection == "A") ? "D" : "A" : "A";
        this.sortingSubscriptionHistoryField = fieldName;

        this.GetSubscriptionHistory(this.searchText, this.currentPage, this.pageSize);
    }

    GetStartMinimumDate() {
        let currentReceiptDate: any = new Date(this.frmSubscription.value.PaymentDate.year + '-' + this.frmSubscription.value.PaymentDate.month + '-' + this.frmSubscription.value.PaymentDate.day);
        let day: any = 60 * 60 * 24 * 1000;
        return new Date(currentReceiptDate.getTime());
    }

    OnChangePaymentDate() {
        let newStartMinimumDate: Date = this.GetStartMinimumDate();
        this.minStartDate = { year: newStartMinimumDate.getFullYear(), month: newStartMinimumDate.getMonth() + 1, day: newStartMinimumDate.getDate() };
        this.frmSubscription.get("StartDate").setValue(null);
        this.frmSubscription.updateValueAndValidity();
    }

    SaveSubscription(formData) {
        this.spinnerService.show();
        
        formData.value.SubscriptionId = this.subscriptions[0].SubscriptionId;
        formData.value.StartDate = (formData.value.StartDate != null) ? formData.value.StartDate.year + "/" + formData.value.StartDate.month + "/" + formData.value.StartDate.day : null;
        formData.value.PaymentDate = (formData.value.PaymentDate != null) ? formData.value.PaymentDate.year + "/" + formData.value.PaymentDate.month + "/" + formData.value.PaymentDate.day : null;

        this._subscriptionService.updateSubscription(formData.value)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.activatedRoute.queryParams.subscribe(params => {
                        this.router.navigate(['/admin/secure/userprofiles'], {
                            queryParams: {
                                sortingUserProfileField: params["sortingUserProfileField"], sortingUserProfileDirection: params["sortingUserProfileDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                            }
                        }).then(() => {
                            this.toastr.success(data.Description, Global.TOASTR_SUBSCRIPTION_TITLE, { closeButton: true });
                        });
                    });
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_SUBSCRIPTION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_SUBSCRIPTION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    ClearStartDate() {
        this.frmSubscription.get("StartDate").setValue("");
        this.frmSubscription.updateValueAndValidity();
    }

    ClearPaymentDate() {
        this.frmSubscription.get("PaymentDate").setValue("");
        this.frmSubscription.updateValueAndValidity();
    }

    OnSubmitSubscription(formData: any) {
        this.isSubmited = true;

        if (this.frmSubscription.valid) {
            this.SaveSubscription(formData);
        }
    }

    CancelSubscription() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/userprofiles'], {
                queryParams: {
                    sortingUserProfileField: params["sortingUserProfileField"], sortingUserProfileDirection: params["sortingUserProfileDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
