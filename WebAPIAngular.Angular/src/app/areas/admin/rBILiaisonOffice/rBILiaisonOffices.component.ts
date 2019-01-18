import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RBILiaisonOffice, GetRBILiaisonOfficeRequest } from '../../../model/rBILiaisonOffice';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { RBILiaisonOfficeAdminService } from '../../../service/admin/rBILiaisonOffice.service';


@Component({
    selector: 'my-app',
    templateUrl: './rBILiaisonOffices.component.html'
})

export class RBILiaisonOfficesAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _rBILiaisonOfficeService: RBILiaisonOfficeAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router) { }

    _global: Global = new Global();

    rBILiaisonOffices: RBILiaisonOffice[];
    
    frmRBILiaisonOffice: FormGroup;
    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];
    
    drpPageSize: number;

    sortingRBILiaisonOfficeField: string;
    sortingRBILiaisonOfficeDirection: string;
    
    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmRBILiaisonOffice = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetRBILiaisonOffice(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetRBILiaisonOffice(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getRBILiaisonOfficeRequest = new GetRBILiaisonOfficeRequest();
        getRBILiaisonOfficeRequest.SearchText = searchText;
        getRBILiaisonOfficeRequest.IsActive = null;
        getRBILiaisonOfficeRequest.OrderBy = this.sortingRBILiaisonOfficeField;
        getRBILiaisonOfficeRequest.OrderByDirection = this.sortingRBILiaisonOfficeDirection;
        getRBILiaisonOfficeRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getRBILiaisonOfficeRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._rBILiaisonOfficeService.getRBILiaisonOffice(getRBILiaisonOfficeRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.rBILiaisonOffices = data.Response;
                    
                    this.pageSize = getRBILiaisonOfficeRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RBI_LIAISON_OFFICE_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBI_LIAISON_OFFICE_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchRBILiaisonOffice(formData) {
        this.currentPage = 1;
        this.searchText = formData.value.SearchText;
        this.GetRBILiaisonOffice(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetRBILiaisonOffice(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.GetRBILiaisonOffice(this.searchText, null, this.pageSize);
    }
    
    OnRBILiaisonOfficeSort(fieldName) {
        this.sortingRBILiaisonOfficeDirection = (this.sortingRBILiaisonOfficeField == fieldName) ? (this.sortingRBILiaisonOfficeDirection == "A") ? "D" : "A" : "A";
        this.sortingRBILiaisonOfficeField = fieldName;
        this.GetRBILiaisonOffice(this.searchText, this.currentPage, this.pageSize);
    }
}
