import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupportTicket, GetSupportTicketRequest } from '../../../model/supportTicket';
import { SupportTicketReply, GetSupportTicketReplyRequest } from '../../../model/supportTicketReply';
import { SupportTicketAdminService } from '../../../service/admin/supportTicket.service';
import { SupportTicketReplyAdminService } from '../../../service/admin/supportTicketReply.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './supportTicketReply.component.html'
})

export class SupportTicketReplyAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _supportTicketService: SupportTicketAdminService,
        private _supportTicketReplyService: SupportTicketReplyAdminService,
        vcr: ViewContainerRef,
        private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    supportTicket: SupportTicket = new SupportTicket();
    supportTicketReplies: SupportTicketReply[];
    supportTicketId: number;

    isSendReply: boolean = false;

    adminId: number = Global.ADMINID;

    frmSupportTicketReply: FormGroup;
    msg: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmSupportTicketReply = this.formBuilder.group({
            SupportTicketId: [''],
            QueryReply: ['', Validators.required],
            IsForPostQuery: [false]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let supportTicketId = this._global.decryptValue(params['supportTicketId']);

            if (supportTicketId) {
                this.supportTicketId = parseInt(supportTicketId);
                this.GetSupportTicket();
            }
        });
    }

    GetSupportTicket() {
        this.spinnerService.show();

        let getSupportTicketRequest = new GetSupportTicketRequest();
        getSupportTicketRequest.SupportTicketId = this.supportTicketId;
        getSupportTicketRequest.IsForPostQuery = false;

        this._supportTicketService.getSupportTicket(getSupportTicketRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.GetSupportTicketReply();

                    this.supportTicket = data.Response[0];
                } else {
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

    DeleteSupportTicketReply(supportTicketReplyId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteSupportTicketReply = {
                "SupportTicketReplyId": supportTicketReplyId
            };

            this._supportTicketReplyService.deleteSupportTicketReply(deleteSupportTicketReply)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_SUPPORT_TICKET_TITLE, { closeButton: true });
                        this.GetSupportTicketReply();
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
    }

    SaveSupportTicketReply(formData) {
        this.spinnerService.show();

        this._supportTicketReplyService.addSupportTicketReply(formData.value)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.CancelPostReply();
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

    OnClickPostReply() {
        this.isSendReply = true;
    }

    CancelPostReply() {
        this.isSendReply = false;
    }

    OnSubmitSupportTicketReply(formData: any) {
        this.isSubmited = true;

        formData.value.SupportTicketId = this.supportTicketId;

        if (this.frmSupportTicketReply.valid) {
            this.SaveSupportTicketReply(formData);
        }
    }

    CancelSupportTicketReply() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/supportticket'], {
                queryParams: {
                    sortingSupportTicketField: params["sortingSupportTicketField"], sortingSupportTicketDirection: params["sortingSupportTicketDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
