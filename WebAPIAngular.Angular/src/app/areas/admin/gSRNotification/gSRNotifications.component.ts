import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GSRNotification, GSRNotificationType, GetGSRNotificationRequest, GetGSRNotificationTypeRequest } from '../../../model/gSRNotification';
import { GSRNotificationAdminService } from '../../../service/admin/gSRNotification.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './gSRNotifications.component.html'
})

export class GSRNotificationsAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _gSRNotificationService: GSRNotificationAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    gSRNotifications: GSRNotification[];

    frmGSRNotification: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    drpPageSize: number;

    sortingField: string;
    sortingDirection: string;

    pdfServerPath: string = Global.GSR_NOTIFICATION_PDF_FILEPATH;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmGSRNotification = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetGSRNotification(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    SearchGSRNotification(formData) {
        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.GetGSRNotification(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetGSRNotification(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.GetGSRNotification(this.searchText, null, this.pageSize);
    }

    EditGSRNotification(gSRNotificationId) {
        this.router.navigate(['/admin/secure/gsrnotification/' + this._global.encryptValue(gSRNotificationId)]);
    }

    DeleteGSRNotification(gsrnotificationId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteGSRNotification = {
                "GSRNotificationId": gsrnotificationId
            };

            this._gSRNotificationService.deleteGSRNotification(deleteGSRNotification)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_GSR_NOTIFICATION_TITLE, { closeButton: true });
                        this.GetGSRNotification();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_GSR_NOTIFICATION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_GSR_NOTIFICATION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    GetGSRNotification(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getGSRNotificationRequest = new GetGSRNotificationRequest();
        getGSRNotificationRequest.SearchText = searchText;
        getGSRNotificationRequest.IsActive = null;
        getGSRNotificationRequest.OrderBy = this.sortingField;
        getGSRNotificationRequest.OrderByDirection = this.sortingDirection;
        getGSRNotificationRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getGSRNotificationRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._gSRNotificationService.getGSRNotification(getGSRNotificationRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.gSRNotifications = data.Response;

                    this.pageSize = getGSRNotificationRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_GSR_NOTIFICATION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_GSR_NOTIFICATION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    OnSort(fieldName) {
        this.sortingDirection = (this.sortingField == fieldName) ? (this.sortingDirection == "A") ? "D" : "A" : "A";
        this.sortingField = fieldName;
        this.GetGSRNotification(this.searchText, this.currentPage, this.pageSize);
    }
}
