import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';


import { SupportTicket, GetSupportTicketRequest } from '../../../model/supportTicket';
import { SupportTicketReply, GetSupportTicketReplyRequest } from '../../../model/supportTicketReply';

import { SupportTicketUserService } from '../../../service/user/supportTicket.service';
import { SupportTicketReplyUserService } from '../../../service/user/supportTicketReply.service';

@Component({
    selector: 'my-app',
    templateUrl: './supportTicketReply.component.html'
})

export class SupportTicketReplyUserComponent implements OnInit {

    _global: Global = new Global();

    supportTicket: SupportTicket = new SupportTicket();
    supportTicketReplies: SupportTicketReply[];
    supportTickets: SupportTicket[] = [];
    supportTicketId: number;

    isSubmited: boolean = false;

    adminId: number = Global.ADMINID;

    frmSupportTicketReply: FormGroup;

    ngOnInit(): void {
        this.frmSupportTicketReply = this.formBuilder.group({
            SupportTicketId: [''],
            QueryReply: ['', Validators.required],
            IsForPostQuery: [true]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let supportTicketId = this._global.decryptValue(params['supportTicketId']);

            if (supportTicketId) {
                this.supportTicketId = parseInt(supportTicketId);
                this.GetSupportTicket();
            }
        });
    }

    constructor(private formBuilder: FormBuilder,
        private spinnerService: SpinnerService,
        private toastr: ToastrService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _supportTicketService: SupportTicketUserService,
        private _supportTicketReplyService: SupportTicketReplyUserService) { }

    GetSupportTicket() {
        this.spinnerService.show();

        let getSupportTicketRequest = new GetSupportTicketRequest();
        getSupportTicketRequest.SupportTicketId = this.supportTicketId;
        getSupportTicketRequest.IsForPostQuery = true;

        this._supportTicketService.getSupportTicket(getSupportTicketRequest)
            .subscribe(data => {
                if (data.Status == Global.API_SUCCESS) {
                    this.supportTicket = data.Response[0];

                    if (this.supportTicket)
                        this.GetSupportTicketByTopic(this.supportTicket.TopicId);
                } else {
                    this.spinnerService.hide();
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUPPORT_TICKET_TITLE, { closeButton: true });
                }

            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUPPORT_TICKET_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetSupportTicketByTopic(topicId) {
        this.spinnerService.show();

        let getSupportTicketRequest = new GetSupportTicketRequest();
        getSupportTicketRequest.TopicId = topicId;
        getSupportTicketRequest.IsForPostQuery = true;
        getSupportTicketRequest.PageNumber = 1;
        getSupportTicketRequest.PageSize = 5;

        this._supportTicketService.getSupportTicket(getSupportTicketRequest)
            .subscribe(data => {
                if (data.Status == Global.API_SUCCESS) {
                    this.GetSupportTicketReply();

                    this.supportTickets = data.Response.filter(x => x.SupportTicketId != this.supportTicketId).slice(0, 4);
                } else {
                    this.spinnerService.hide();
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUPPORT_TICKET_TITLE, { closeButton: true });
                }

            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUPPORT_TICKET_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetSupportTicketReply() {
        this.spinnerService.show();

        let getSupportTicketReplyRequest = new GetSupportTicketReplyRequest();
        getSupportTicketReplyRequest.SupportTicketId = this.supportTicketId;

        this._supportTicketReplyService.getSupportTicketReply(getSupportTicketReplyRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.supportTicketReplies = data.Response;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUPPORT_TICKET_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUPPORT_TICKET_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SaveSupportTicketReply(formData) {
        this.spinnerService.show();

        this._supportTicketReplyService.addSupportTicketReply(formData.value)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.GetSupportTicketReply();
                    this.isSubmited = false;
                    this.frmSupportTicketReply.reset();
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

    OnSubmitSupportTicketReply(formData: any) {
        this.isSubmited = true;

        formData.value.SupportTicketId = this.supportTicketId;

        if (this.frmSupportTicketReply.valid) {
            this.SaveSupportTicketReply(formData);
        }
    }

    BackToSupportTicket() {
        this._global.setCookie("ViewQuery", true, 1);
        this.router.navigate(['/user/secure/postquery']);
    }

    GoSupportTicketReply(supportTicketId) {
        this.router.navigate(['/user/secure/postqueryreply/' + this._global.encryptValue(supportTicketId)]);
    }
}