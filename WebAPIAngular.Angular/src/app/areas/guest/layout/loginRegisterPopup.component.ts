import { Component, ComponentRef, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Login } from '../../../model/login';
import { AccountService } from '../../../service/common/account.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';

import { SpinnerService } from '../../../service/common/spinner.service';
import { GetCommonFieldRequest } from '../../../model/commonField';
import { DropDown } from '../../../common/dropDown';
import { GetSubscriptionRequest } from '../../../model/subscription';
import { CommonFieldService } from '../../../service/common/commonField.service';
import { SubscriptionUserService } from '../../../service/user/subscription.service';

import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';

@Component({
    selector: 'app-public',
    templateUrl: './loginRegisterPopup.component.html'
})
export class LoginRegisterPopupGuestComponent {
    @ViewChild('login') loginControl: ElementRef;
    @ViewChild('register') registerControl: ElementRef;

    dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        options.actionButtons = [{
            text: "x", buttonClass: "waves-effect ml-auto close-button pointer-cursor"
        }];
        
        if (options.data == 'register') {
            let registerCT: HTMLElement = this.registerControl.nativeElement as HTMLElement;
            registerCT.click();
        }
    }

    constructor(private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private _accountService: AccountService,
        private toastr: ToastrService,
        vcr: ViewContainerRef,
        private _commonFieldService: CommonFieldService,
        private _subscriptionService: SubscriptionUserService,
        private spinnerService: SpinnerService) { }

    login: Login;
    returnUrl: string;
    isLogin: boolean = true;
    frmLogin: FormGroup;
    mobileOTP: boolean = true;
    errorMessageRegister: string;
    successMessageRegister: string;
    errorMessageVerifyAccount: string;
    successMessageVerifyAccount: string;
    _global: Global = new Global();
    professionalQualifications: DropDown[] = [];
    msg: string;

    frmRegister: FormGroup;
    frmVerifyAccount: FormGroup;

    isSubmited: boolean = false;
    isVerifyAccountSubmited: boolean = false;

    isRegistered: boolean = false;

    ngOnInit(): void {
        this.frmLogin = this.fb.group({
            Mobile: ['', Validators.required],
            MobileOTP: ['']
        });

        this.frmRegister = this.fb.group({
            RoleId: [''],
            UserName: ['', Validators.compose([Validators.required, Validators.email])],
            Mobile: ['', Validators.required],
            FirstName: ['', Validators.required],
            LastName: ['', Validators.required],
            Gender: ['', Validators.required],
            CompanyName: ['', Validators.required],
            ProfessionalQualificationId: ['', Validators.required]
        });

        this.frmVerifyAccount = this.fb.group({
            UserName: [''],
            Mobile: [''],
            MobileOTP: ['', Validators.required],
            EmailOTP: ['', Validators.required]
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    GetProfessionalQualification(): void {
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
                }
                else {
                    this.toastr.error(data.Description, Global.COMMON_FIELD_PROFESSIONAL_QUALIFICATION, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_REGISTER_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    SendOTP(formData: any): void {
        this.errorMessageRegister = "";
        this.successMessageRegister = "";

        if (formData.value.Mobile) {
            this.spinnerService.show();
            this.successMessageRegister = "";
            this.errorMessageRegister = "";

            let sendOTP = {
                "Mobile": formData.value.Mobile
            }

            this._accountService.sendOTPForLogin(sendOTP)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.frmLogin.get("MobileOTP").setValidators([Validators.required]);
                        this.frmLogin.get('MobileOTP').updateValueAndValidity();

                        //this.toastr.success(data.Description, Global.TOASTR_LOGIN_TITLE, { closeButton: true });
                        this.successMessageRegister = data.Description;

                        this.mobileOTP = false;
                    } else {
                        this.errorMessageRegister = data.Description;
                        return;
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.errorMessageRegister = Global.ERROR_MESSAGE;
                        return;
                    });
        }
    }

    Login(formData: any): void {
        this.errorMessageRegister = "";
        this.successMessageRegister = "";

        if (formData.value.Mobile && formData.value.MobileOTP) {
            this.spinnerService.show();
            this.successMessageRegister = "";
            this.errorMessageRegister = "";

            let user = {
                "Mobile": formData.value.Mobile,
                "MobileOTP": formData.value.MobileOTP,
                "LoginFrom": "WEB"
            };

            this._accountService.loginWithMobile(user)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this._global.setUserToken(data.Response.UserId, data.Response.Token, data.Response.RoleId);

                        //if (this.returnUrl == "/") {
                        if (data.Response.RoleId == Global.USER_ROLEID) {
                            //let getSubscriptionRequest = new GetSubscriptionRequest();
                            //getSubscriptionRequest.UserId = data.Response.UserId;

                            //this._subscriptionService.getSubscription(getSubscriptionRequest)
                            //    .subscribe(data => {
                            //        this.spinnerService.hide();

                            //        if (data.Response.length > 0) {
                            //            if (data.Response[0].StartDate) {
                            //                this._global.setCookie(Global.IS_SUBSCRIBED, true, 365);
                            //            }
                            //        }

                            //        this.router.navigate(['/user/secure/femamodules']);
                            //    }, error => this.msg = <any>error);
                            this.router.navigate(['/user/secure/femamodules']);
                        }
                        else {
                            data.Description = "Invalid credentials"
                            this.toastr.error(data.Description, Global.TOASTR_LOGIN_TITLE, { closeButton: true });
                            this.errorMessageRegister = data.Description;
                        }
                        //}
                        //else
                        //    this.router.navigateByUrl(this.returnUrl);

                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_LOGIN_TITLE, { closeButton: true });
                        this.errorMessageRegister = data.Description;
                        return;
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_LOGIN_TITLE, { enableHtml: true, closeButton: true });
                        this.errorMessageRegister = Global.ERROR_MESSAGE;
                        return;
                    });
        }
    }

    Register(formData: any): void {
        this.isRegistered = false;

        this.errorMessageRegister = "";
        this.successMessageRegister = "";
        this.errorMessageVerifyAccount = "";
        this.successMessageVerifyAccount = "";

        this.isSubmited = true;

        if (this.frmRegister.valid) {
            this.spinnerService.show();

            let user = {
                "RoleId": Global.USER_ROLEID,
                "UserName": formData.value.UserName,
                "Mobile": formData.value.Mobile,
                "FirstName": formData.value.FirstName,
                "LastName": formData.value.LastName,
                "Gender": formData.value.Gender,
                "CompanyName": formData.value.CompanyName,
                "ProfessionalQualificationId": formData.value.ProfessionalQualificationId
            };

            this._accountService.userRegister(user)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {

                        this.frmVerifyAccount.get("UserName").setValue(formData.value.UserName);
                        this.frmVerifyAccount.get("Mobile").setValue(formData.value.Mobile);
                        this.frmVerifyAccount.updateValueAndValidity();

                        this.successMessageVerifyAccount = data.Description;
                        this.isRegistered = true;
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_REGISTER_TITLE, { closeButton: true });
                        this.errorMessageRegister = data.Description;
                        return;
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_REGISTER_TITLE, { enableHtml: true, closeButton: true });
                        this.errorMessageRegister = Global.ERROR_MESSAGE;
                        return;
                    });
        }
    }

    VerifyAccount(formData: any): void {
        this.errorMessageRegister = "";
        this.successMessageRegister = "";
        this.errorMessageVerifyAccount = "";
        this.successMessageVerifyAccount = "";

        this.isVerifyAccountSubmited = true;

        this.spinnerService.show();

        let user = {
            "UserName": formData.value.UserName,
            "Mobile": formData.value.Mobile,
            "MobileOTP": formData.value.MobileOTP,
            "EmailOTP": formData.value.EmailOTP
        };

        this._accountService.verifyAccountForMobile(user)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.frmRegister.reset();
                    this.frmVerifyAccount.reset();
                    this.frmRegister.get("Gender").setValue("");
                    this.frmRegister.updateValueAndValidity();
                    this.frmVerifyAccount.updateValueAndValidity();

                    this.isSubmited = false;
                    this.isRegistered = false;

                    let loginCT: HTMLElement = this.loginControl.nativeElement as HTMLElement;
                    loginCT.click();

                    this.successMessageRegister = data.Description;
                    this.toastr.success(data.Description, Global.TOASTR_REGISTER_TITLE, { closeButton: true });
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_REGISTER_TITLE, { closeButton: true });
                    this.errorMessageVerifyAccount = data.Description;
                    return;
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_REGISTER_TITLE, { enableHtml: true, closeButton: true });
                this.errorMessageVerifyAccount = Global.ERROR_MESSAGE;
                return;
            });
    }

    OnClickLoginRegister(value) {
        this.errorMessageRegister = "";
        this.successMessageRegister = "";
        this.errorMessageVerifyAccount = "";
        this.successMessageVerifyAccount = "";

        this.isLogin = (value == "login") ? true : false;

        if (!this.isLogin)
            this.GetProfessionalQualification();
    }
}