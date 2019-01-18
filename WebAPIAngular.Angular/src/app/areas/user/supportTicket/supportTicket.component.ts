import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { DropDown } from '../../../common/dropDown';


import { SupportTicket, GetSupportTicketRequest } from '../../../model/supportTicket';
import { SupportTicketReply, GetSupportTicketReplyRequest } from '../../../model/supportTicketReply';
import { SubTopic } from '../../../model/authorWriteUpDetail';
import { SupportTicketSubTopic, GetSupportTicketSubTopicRequest } from '../../../model/supportTicketSubTopic';
import { GetCommonFieldRequest } from '../../../model/commonField';

import { SupportTicketUserService } from '../../../service/user/supportTicket.service';
import { SupportTicketReplyUserService } from '../../../service/user/supportTicketReply.service';
import { SupportTicketSubTopicUserService } from '../../../service/user/supportTicketSubTopic.service';
import { AuthorWriteUpDetailUserService } from '../../../service/user/authorWriteUpDetail.service';
import { CommonFieldService } from '../../../service/common/commonField.service';

import { GetSubscriptionRequest } from '../../../model/subscription';
import { SubscriptionUserService } from '../../../service/user/subscription.service';
import { SubscriptionPopupUserComponent } from '../../../areas/user/subscription/subscriptionPopup.component';
import { ModalDialogService } from 'ngx-modal-dialog';

@Component({
    selector: 'my-app',
    templateUrl: './supportTicket.component.html'
})

export class SupportTicketUserComponent implements OnInit {

    topics: DropDown[] = [];
    subTopics: DropDown[] = [];
    supportTickets: SupportTicket[];

    frmSupportTicket: FormGroup;

    isSubmited: boolean = false;
    moduleTab: string = 'postquery';

    totalRecords: number;
    currentPage: number = 1;
    pageSize: number = Global.USER_PAGE_SIZE;

    selectedTopicId: string = "";
    isOnlyMyQuery: boolean;
    msg: string;

    _global: Global = new Global();

    ngOnInit(): void {
        this.frmSupportTicket = this.formBuilder.group({
            TopicId: ['', Validators.required],
            SubTopicId: ['', Validators.required],
            QueryTitle: ['', Validators.required],
            Query: ['', Validators.required],
            IsCheckedTermAndCondition: ['', Validators.required]
        });

        this.CheckIsSubscribed();
    }

    constructor(private formBuilder: FormBuilder,
        private spinnerService: SpinnerService,
        private toastr: ToastrService,
        private router: Router,
        private vcr: ViewContainerRef,
        private _commonFieldService: CommonFieldService,
        private _authorWriteUpDetailService: AuthorWriteUpDetailUserService,
        private _supportTicketService: SupportTicketUserService,
        private _supportTicketReplyService: SupportTicketReplyUserService,
        private _supportTicketSubTopicService: SupportTicketSubTopicUserService,
        private _subscriptionService: SubscriptionUserService,
        private modalService: ModalDialogService) { }

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
                    if (this._global.getCookie("ViewQuery")) {
                        this._global.deleteCookie("ViewQuery");
                        this.OnClickModuleTab("viewquery");
                    }

                    this.GetTopic();
                } else {
                    this.OpenSubscribePopup();
                }
            }, error => this.msg = <any>error);
    }

    OpenSubscribePopup() {
        let t_this = this;
        this.modalService.openDialog(this.vcr, {
            settings: {
                headerClass: "hide",
                footerClass: "no-pad",
                contentClass: "subscribe-modal-content modal-content"
            },
            actionButtons: [{
                text: "x", buttonClass: "pointer-cursor font-20px close-button", onAction() {
                    t_this.router.navigate(['/user/secure/subscription']);
                }
            }],
            childComponent: SubscriptionPopupUserComponent
        });
    }

    GetTopic() {
        this.spinnerService.show();

        let getCommonFieldRequest = new GetCommonFieldRequest();
        getCommonFieldRequest.FieldTypeName = Global.COMMON_FIELD_FEMA_MODULE;

        this._commonFieldService.getCommonField(getCommonFieldRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.topics = [];

                if (data.Status == Global.API_SUCCESS) {
                    this.topics.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.topics.push({ Value: item.FieldId, Text: item.FieldName });
                    });
                }
                else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUPPORT_TICKET_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUPPORT_TICKET_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetSubTopic() {
        this.spinnerService.show();

        let getSupportTicketSubTopicRequest = new GetSupportTicketSubTopicRequest();
        getSupportTicketSubTopicRequest.FEMAModuleId = parseInt(this.frmSupportTicket.get("TopicId").value)

        this._supportTicketSubTopicService.getSupportTicketSubTopic(getSupportTicketSubTopicRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.subTopics = [];

                if (data.Status == Global.API_SUCCESS) {
                    this.subTopics.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.subTopics.push({ Value: item.SupportTicketSubTopicId, Text: item.SupportTicketSubTopicName });
                    });
                }
                else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUPPORT_TICKET_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUPPORT_TICKET_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    OnChangeTopic() {
        this.subTopics = [];

        if (this.frmSupportTicket.get("TopicId").value) {
            this.GetSubTopic();
        }
    }

    GetSupportTicket(pageNumber?: number): void {
        this.spinnerService.show();

        let getSupportTicketRequest = new GetSupportTicketRequest();
        getSupportTicketRequest.IsCurrentUser = this.isOnlyMyQuery;
        getSupportTicketRequest.IsForPostQuery = true;
        getSupportTicketRequest.TopicId = (this.selectedTopicId) ? parseInt(this.selectedTopicId) : null;
        getSupportTicketRequest.IsActive = null;
        getSupportTicketRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getSupportTicketRequest.PageSize = this.pageSize;

        this._supportTicketService.getSupportTicket(getSupportTicketRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.supportTickets = data.Response;

                this.pageSize = getSupportTicketRequest.PageSize;
                this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUPPORT_TICKET_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GoSupportTicketReply(supportTicketId) {
        this.router.navigate(['/user/secure/postqueryreply/' + this._global.encryptValue(supportTicketId)]);
    }

    OnChangeSupportTicketParameter() {
        this.currentPage = 1;

        this.GetSupportTicket(this.currentPage);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetSupportTicket(pageNumber);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.GetSupportTicket(null);
    }

    SaveSupportTicket(formData) {
        this.spinnerService.show();

        this._supportTicketService.addSupportTicket(formData.value)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.isSubmited = false;
                    this.frmSupportTicket.reset();
                    this.frmSupportTicket.get("TopicId").setValue("");
                    this.frmSupportTicket.get("SubTopicId").setValue("");

                    this.toastr.success(data.Description, Global.TOASTR_ADMIN_SUPPORT_TICKET_TITLE, { closeButton: true });
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUPPORT_TICKET_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUPPORT_TICKET_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    OnSubmitSupportTicket(formData: any) {
        this.isSubmited = true;

        if (this.frmSupportTicket.valid) {
            this.SaveSupportTicket(formData);
        }
    }

    OnClickModuleTab(moduleTab) {
        this.moduleTab = moduleTab;
        
        if (moduleTab == 'viewquery')
            this.GetSupportTicket(null);
    }
}