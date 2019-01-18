import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SupportTicket, GetSupportTicketRequest } from '../../../model/supportTicket';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { SupportTicketAdminService } from '../../../service/admin/supportTicket.service';


@Component({
    selector: 'my-app',
    templateUrl: './supportTicket.component.html'
})

export class SupportTicketAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private _supportTicketService: SupportTicketAdminService,
        private toastr: ToastrService,
        private vcr: ViewContainerRef,
        private spinnerService: SpinnerService,
        private router: Router) { }

    _global: Global = new Global();

    supportTickets: SupportTicket[];

    frmSupportTicket: FormGroup;
    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    drpPageSize: number;

    sortingSupportTicketField: string;
    sortingSupportTicketDirection: string;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;

            this.sortingSupportTicketField = params["sortingSupportTicketField"];
            this.sortingSupportTicketDirection = params["sortingSupportTicketDirection"];
        });


        this.frmSupportTicket = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetSupportTicket(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetSupportTicket(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getSupportTicketRequest = new GetSupportTicketRequest();
        getSupportTicketRequest.SearchText = searchText;
        getSupportTicketRequest.IsForPostQuery = false;
        getSupportTicketRequest.IsActive = null;
        getSupportTicketRequest.OrderBy = this.sortingSupportTicketField;
        getSupportTicketRequest.OrderByDirection = this.sortingSupportTicketDirection;
        getSupportTicketRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getSupportTicketRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._supportTicketService.getSupportTicket(getSupportTicketRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.supportTickets = data.Response;
                    
                    this.pageSize = getSupportTicketRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUPPORT_TICKET_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUPPORT_TICKET_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchSupportTicket(formData) {
        this.currentPage = 1;
        this.searchText = formData.value.SearchText;
        
        this.GetSupportTicket(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetSupportTicket(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.GetSupportTicket(this.searchText, null, this.pageSize);
    }

    ViewSupportTicket(supportTicketId) {
        this.router.navigate(['/admin/secure/supportticketreply/' + this._global.encryptValue(supportTicketId)], {
            queryParams: {
                sortingSupportTicketField: this.sortingSupportTicketField, sortingSupportTicketDirection: this.sortingSupportTicketDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    DeleteSupportTicket(supportTicketId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteSupportTicket = {
                "SupportTicketId": supportTicketId
            };

            this._supportTicketService.deleteSupportTicket(deleteSupportTicket)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_SUPPORT_TICKET_TITLE, { closeButton: true });
                        this.GetSupportTicket();
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

    OnSupportTicketSort(fieldName) {
        this.sortingSupportTicketDirection = (this.sortingSupportTicketField == fieldName) ? (this.sortingSupportTicketDirection == "A") ? "D" : "A" : "A";
        this.sortingSupportTicketField = fieldName;

        this.GetSupportTicket(this.searchText, this.currentPage, this.pageSize);
    }
}
