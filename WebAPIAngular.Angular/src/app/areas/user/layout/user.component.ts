import { Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Global } from '../../../common/global';
import { ToastrService } from 'ngx-toastr';

import { UserProfile, GetUserProfileRequest } from '../../../model/userProfile';
import { SpinnerService } from '../../../service/common/spinner.service';
import { AccountService } from '../../../service/common/account.service';
import { UserProfileUserService } from '../../../service/user/userProfile.service';
import { GetCommonFieldRequest } from '../../../model/commonField';
import { CommonFieldService } from '../../../service/common/commonField.service';
import { FEMAModulesUserComponent } from '../../../areas/user/fEMAModule/fEMAModules.component';
import { GetSubscriptionRequest } from '../../../model/subscription';
import { SubscriptionUserService } from '../../../service/user/subscription.service';
import { SupportTicketUserService } from '../../../service/user/supportTicket.service';
import { LatesNewsService } from '../../../service/common/latesNews.service';
import { DropDown } from '../../../common/dropDown';

import { ModalDialogService } from 'ngx-modal-dialog';
import { SubscriptionPopupUserComponent } from '../../../areas/user/subscription/subscriptionPopup.component';

@Component({
    selector: 'app-public',
    templateUrl: './user.component.html',
    styleUrls: [
        '../../../../assets/css/bootstrap-user.min.css',
        '../../../../assets/css/style-user.css',
        '../../../../assets/css/responsive-user.css',
        '../../../../assets/css/font-awesome-user.min.css',
        '../../../../assets/css/fm.scrollator.jquery.css',
        '../../../../assets/css/sidemenu.css'
    ],
    encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {

    constructor(private formBuilder: FormBuilder,
        private _accountService: AccountService,
        private toastr: ToastrService,
        public router: Router,
        private vcr: ViewContainerRef,
        private activatedRoute: ActivatedRoute,
        private _supportTicketService: SupportTicketUserService,
        private _userProfileService: UserProfileUserService,
        private _latesNewsService: LatesNewsService,
        private _commonFieldService: CommonFieldService,
        private _subscriptionService: SubscriptionUserService,
        private spinnerService: SpinnerService,
        private modalDialogService: ModalDialogService) { }

    _global: Global = new Global();

    userProfile: UserProfile = new UserProfile();
    fEMAModules: any;
    latestNews: any = [];
    fEMAModuleId: number = 1;
    msg: string;
    isSidebarOpened: boolean = true;

    isOpenChat: boolean = false;
    departments: DropDown[] = [];
    frmSupportTicket: FormGroup;
    isSubmited: boolean = false;
    isSuccessSupportTicketCreated: boolean = false;

    ngOnInit() {
        document.addEventListener('contextmenu', event => event.preventDefault());
        
        this.frmSupportTicket = this.formBuilder.group({
            DepartmentId: ['', Validators.required],
            Query: ['', Validators.required]
        });

        if (this.IsLoggedIn()) {
            this.GetUserProfile();
            this.GetDepartment();
            this.GetLatesNews();

            this.activatedRoute.queryParams.subscribe(params => {
                this.fEMAModuleId = (params["fEMAModuleId"]) ? parseInt(params["fEMAModuleId"]) : this.fEMAModuleId;
            });

            return true;
        }
        else {
            this.router.navigate(['user/login']);
            return false;
        }
    }

    GetLatesNews() {
        this.spinnerService.show();

        this._latesNewsService.getLatesNews()
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    let marqueeWidth = document.querySelector('.marquee').clientWidth;
                    let mainWidth = (marqueeWidth >= 900) ? Math.round(marqueeWidth / 8.2) :
                        (marqueeWidth >= 800) ? Math.round(marqueeWidth / 9) :
                            (marqueeWidth >= 420) ? Math.round(marqueeWidth / 10) :
                                (marqueeWidth >= 400) ? Math.round(marqueeWidth / 12) :
                                    (marqueeWidth >= 360) ? Math.round(marqueeWidth / 13) :
                                        (marqueeWidth >= 340) ? Math.round(marqueeWidth / 15) :
                                            (marqueeWidth >= 330) ? Math.round(marqueeWidth / 16) : Math.round(marqueeWidth / 20);
                    let dot = " . . .";

                    data.Response.forEach(item => {
                        let number = (item.Number.length <= mainWidth) ? item.Number : item.Number.substring(0, mainWidth) + dot;
                        let name = (item.Name.length <= (mainWidth - item.Number.length)) ? item.Name : item.Name.substring(0, (mainWidth - item.Number.length)) + dot;
                        let pdfPath = (item.CategoryId == Global.LATEST_NEWS_ID_NOTIFICATION) ? Global.NOTIFICATION_PDF_FILEPATH :
                            (item.CategoryId == Global.LATEST_NEWS_ID_AP_DIR_CIRCULAR) ? Global.APDIRCIRCULAR_PDF_FILEPATH :
                                (item.CategoryId == Global.LATEST_NEWS_ID_PRESS_NOTE) ? Global.PRESSNOTE_PDF_FILEPATH :
                                    (item.CategoryId == Global.LATEST_NEWS_ID_MASTER_DIRECTION) ? Global.MASTERDIRECTION_PDF_FILEPATH :
                                        (item.CategoryId == Global.LATEST_NEWS_ID_COMPOUNDING_ORDER) ? Global.RBI_COMPOUNDING_ORDER_PDF_FILEPATH : '';

                        this.latestNews.push({ Number: number, Name: (name != dot) ? name : '', PDFPath: pdfPath + item.PDF });
                    });
                }
                else {
                    this.toastr.error(data.Description, Global.TOASTR_LATEST_NEWS_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_LATEST_NEWS_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    OpenLatestNewsPDF(pdfPath) {
        let getSubscriptionRequest = new GetSubscriptionRequest();
        getSubscriptionRequest.UserId = parseInt(this._global.getCookie(Global.USER_ID));

        this._subscriptionService.getSubscription(getSubscriptionRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Response.length > 0 && data.Response[0].IsExpired == false && data.Response[0].IsActive == true) {
                    if (data.Response[0].StartDate)
                        this._global.setCookie(Global.IS_SUBSCRIBED, true, 365);
                    else
                        this._global.deleteCookie(Global.IS_SUBSCRIBED);
                } else {
                    this._global.deleteCookie(Global.IS_SUBSCRIBED);
                }

                if (this._global.getCookie(Global.IS_SUBSCRIBED)) {
                    window.open(pdfPath, '_blank');
                } else {
                    this.OpenSubscribePopup();
                }
            }, error => this.msg = <any>error);
    }

    OpenSubscribePopup() {
        this.modalDialogService.openDialog(this.vcr, {
            settings: {
                headerClass: "hide",
                footerClass: "no-pad",
                contentClass: "subscribe-modal-content modal-content"
            },
            actionButtons: [{
                text: "x", buttonClass: "pointer-cursor close-button"
            }],
            childComponent: SubscriptionPopupUserComponent
        });
    }

    GetDepartment() {
        this.spinnerService.show();

        let getCommonFieldRequest = new GetCommonFieldRequest();
        getCommonFieldRequest.FieldTypeName = Global.COMMON_FIELD_SUPPORT_TICKET_DEPARTMENT;

        this._commonFieldService.getCommonField(getCommonFieldRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.departments = [];

                if (data.Status == Global.API_SUCCESS) {
                    this.departments.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.departments.push({ Value: item.FieldId, Text: item.FieldName });
                    });
                }
                else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUPPORT_TICKET_CHAT_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUPPORT_TICKET_CHAT_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    IsLoggedIn() {
        if (this._global.getUserToken() && Number(this._global.getRoleId()) == Global.USER_ROLEID)
            return true;
        return false;
    }

    CheckIsSubscribed() {
        let getSubscriptionRequest = new GetSubscriptionRequest();
        getSubscriptionRequest.UserId = parseInt(this._global.getCookie(Global.USER_ID));

        this._subscriptionService.getSubscription(getSubscriptionRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Response.length > 0 && data.Response[0].IsExpired == false && data.Response[0].IsActive == true) {
                    if (data.Response[0].StartDate)
                        this._global.setCookie(Global.IS_SUBSCRIBED, true, 365);
                    else
                        this._global.deleteCookie(Global.IS_SUBSCRIBED);
                } else {
                    this._global.deleteCookie(Global.IS_SUBSCRIBED);
                }

                if (this._global.getCookie(Global.IS_SUBSCRIBED)) {
                    this.GetFEMAModule();
                }
            }, error => this.msg = <any>error);
    }

    Logout(): void {
        this.spinnerService.show();

        this._accountService.logoutUser()
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this._global.deleteUserToken();
                    this.router.navigate(['/']);
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_LOGOUT_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_LOGOUT_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetUserProfile(): void {
        this.spinnerService.show();

        let getUserProfileRequest = new GetUserProfileRequest();

        this._userProfileService.getUserProfile(getUserProfileRequest)
            .subscribe(data => {
                this.CheckIsSubscribed();

                if (data.Status == Global.API_SUCCESS) {
                    this.userProfile = data.Response[0];
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_USER_PROFILE_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_USER_PROFILE_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetFEMAModule(): void {
        this.spinnerService.show();

        let getCommonFieldRequest = new GetCommonFieldRequest();
        getCommonFieldRequest.FieldTypeName = Global.COMMON_FIELD_FEMA_MODULE;

        this._commonFieldService.getCommonField(getCommonFieldRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.fEMAModules = data.Response;
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FEMA_MODULE_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    OnClickFEMAModule(fEMAModuleId) {
        this.fEMAModuleId = fEMAModuleId;
        this.router.navigate(['user/secure/femamodules'], {
            queryParams: { fEMAModuleId: fEMAModuleId }
        });
    }

    SaveSupportTicket(formData) {
        this.isSuccessSupportTicketCreated = false;

        this.spinnerService.show();

        this._supportTicketService.addSupportTicket(formData.value)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.isSubmited = false;
                    this.frmSupportTicket.reset();
                    this.frmSupportTicket.get("DepartmentId").setValue("");
                    this.isSuccessSupportTicketCreated = true;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUPPORT_TICKET_CHAT_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUPPORT_TICKET_CHAT_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    OnSubmitSupportTicket(formData: any) {
        this.isSubmited = true;

        if (this.frmSupportTicket.valid) {
            this.SaveSupportTicket(formData);
        }
    }

    CreateNewSupportTicket() {
        this.isSubmited = false;
        this.frmSupportTicket.reset();
        this.frmSupportTicket.get("DepartmentId").setValue("");
        this.isSuccessSupportTicketCreated = false;
    }

    OpenChatBox() {
        this.isOpenChat = !this.isOpenChat;
    }

    CloseChatBox() {
        this.isOpenChat = !this.isOpenChat;
    }

    //keyframes(steps: AnimationStyleMetadata[]): AnimationKeyframesSequenceMetadata;
}