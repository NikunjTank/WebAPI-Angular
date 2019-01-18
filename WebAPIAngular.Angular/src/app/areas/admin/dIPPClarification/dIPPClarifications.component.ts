import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DIPPClarification, GetDIPPClarificationRequest } from '../../../model/dIPPClarification';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { DIPPClarificationAdminService } from '../../../service/admin/dIPPClarification.service';


@Component({
    selector: 'my-app',
    templateUrl: './dIPPClarifications.component.html'
})

export class DIPPClarificationsAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _dIPPClarificationService: DIPPClarificationAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router) { }

    _global: Global = new Global();

    dIPPClarifications: DIPPClarification[];
    dIPPClarification: DIPPClarification;
    
    dIPPClarificationId: number;

    frmDIPPClarification: FormGroup;
    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    pdfServerPath: string = Global.DIPPCLARIFICATION_PDF_FILEPATH;
    
    drpPageSize: number;

    sortingDIPPClarificationField: string;
    sortingDIPPClarificationDirection: string;
    
    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmDIPPClarification = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetDIPPClarification(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetDIPPClarification(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getDIPPClarificationRequest = new GetDIPPClarificationRequest();
        getDIPPClarificationRequest.SearchText = searchText;
        getDIPPClarificationRequest.IsActive = null;
        getDIPPClarificationRequest.OrderBy = this.sortingDIPPClarificationField;
        getDIPPClarificationRequest.OrderByDirection = this.sortingDIPPClarificationDirection;
        getDIPPClarificationRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getDIPPClarificationRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._dIPPClarificationService.getDIPPClarification(getDIPPClarificationRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.dIPPClarifications = data.Response;
                    
                    this.pageSize = getDIPPClarificationRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_DIPPCLARIFICATION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_DIPPCLARIFICATION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchDIPPClarification(formData) {
        this.currentPage = 1;
        this.searchText = formData.value.SearchText;
        
        this.GetDIPPClarification(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetDIPPClarification(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.GetDIPPClarification(this.searchText, null, this.pageSize);
    }

    EditDIPPClarification(dIPPClarificationId) {
        this.router.navigate(['/admin/secure/dippclarification/' + this._global.encryptValue(dIPPClarificationId)]);
    }
    
    DeleteDIPPClarification(dIPPClarificationId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteDIPPClarification = {
                "DIPPClarificationId": dIPPClarificationId
            };

            this._dIPPClarificationService.deleteDIPPClarification(deleteDIPPClarification)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_DIPPCLARIFICATION_TITLE, { closeButton: true });
                        this.GetDIPPClarification();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_DIPPCLARIFICATION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_DIPPCLARIFICATION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }
    
    OnDIPPClarificationSort(fieldName) {
        this.sortingDIPPClarificationDirection = (this.sortingDIPPClarificationField == fieldName) ? (this.sortingDIPPClarificationDirection == "A") ? "D" : "A" : "A";
        this.sortingDIPPClarificationField = fieldName;

        this.GetDIPPClarification(this.searchText, this.currentPage, this.pageSize);
    }
}
