import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Manual, GetManualRequest } from '../../../model/manual';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ManualAdminService } from '../../../service/admin/manual.service';


@Component({
    selector: 'my-app',
    templateUrl: './manuals.component.html'
})

export class ManualsAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _manualService: ManualAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router) { }

    _global: Global = new Global();

    manuals: Manual[];
    manual: Manual;
    
    manualId: number;

    frmManual: FormGroup;
    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    pdfServerPath: string = Global.MANUAL_PDF_FILEPATH;
    
    drpPageSize: number;

    sortingManualField: string;
    sortingManualDirection: string;
    
    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmManual = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetManual(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetManual(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getManualRequest = new GetManualRequest();
        getManualRequest.SearchText = searchText;
        getManualRequest.IsActive = null;
        getManualRequest.OrderBy = this.sortingManualField;
        getManualRequest.OrderByDirection = this.sortingManualDirection;
        getManualRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getManualRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._manualService.getManual(getManualRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.manuals = data.Response;
                    
                    this.pageSize = getManualRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MANUAL_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MANUAL_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchManual(formData) {
        this.currentPage = 1;
        this.searchText = formData.value.SearchText;
        
        this.GetManual(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetManual(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.GetManual(this.searchText, null, this.pageSize);
    }

    EditManual(manualId) {
        this.router.navigate(['/admin/secure/manual/' + this._global.encryptValue(manualId)]);
    }
    
    DeleteManual(manualId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteManual = {
                "ManualId": manualId
            };

            this._manualService.deleteManual(deleteManual)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_MANUAL_TITLE, { closeButton: true });
                        this.GetManual();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MANUAL_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MANUAL_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }
    
    OnManualSort(fieldName) {
        this.sortingManualDirection = (this.sortingManualField == fieldName) ? (this.sortingManualDirection == "A") ? "D" : "A" : "A";
        this.sortingManualField = fieldName;

        this.GetManual(this.searchText, this.currentPage, this.pageSize);
    }
}
