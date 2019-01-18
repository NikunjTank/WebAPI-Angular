import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NICCode, GetNICCodeRequest } from '../../../model/nICCode';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { NICCodeAdminService } from '../../../service/admin/nICCode.service';


@Component({
    selector: 'my-app',
    templateUrl: './nICCodes.component.html'
})

export class NICCodesAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _nICCodeService: NICCodeAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router) { }

    _global: Global = new Global();

    nICCodes: NICCode[];
    nICCode: NICCode;
    
    nICCodeId: number;

    frmNICCode: FormGroup;
    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    pdfServerPath: string = Global.NICCODE_PDF_FILEPATH;
    
    drpPageSize: number;

    sortingNICCodeField: string;
    sortingNICCodeDirection: string;
    
    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmNICCode = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetNICCode(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetNICCode(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getNICCodeRequest = new GetNICCodeRequest();
        getNICCodeRequest.SearchText = searchText;
        getNICCodeRequest.IsActive = null;
        getNICCodeRequest.OrderBy = this.sortingNICCodeField;
        getNICCodeRequest.OrderByDirection = this.sortingNICCodeDirection;
        getNICCodeRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getNICCodeRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._nICCodeService.getNICCode(getNICCodeRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.nICCodes = data.Response;
                    
                    this.pageSize = getNICCodeRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_NICCODE_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_NICCODE_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchNICCode(formData) {
        this.currentPage = 1;
        this.searchText = formData.value.SearchText;
        
        this.GetNICCode(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetNICCode(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.GetNICCode(this.searchText, null, this.pageSize);
    }

    EditNICCode(nICCodeId) {
        this.router.navigate(['/admin/secure/niccode/' + this._global.encryptValue(nICCodeId)]);
    }
    
    DeleteNICCode(nICCodeId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteNICCode = {
                "NICCodeId": nICCodeId
            };

            this._nICCodeService.deleteNICCode(deleteNICCode)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_NICCODE_TITLE, { closeButton: true });
                        this.GetNICCode();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_NICCODE_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_NICCODE_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }
    
    OnNICCodeSort(fieldName) {
        this.sortingNICCodeDirection = (this.sortingNICCodeField == fieldName) ? (this.sortingNICCodeDirection == "A") ? "D" : "A" : "A";
        this.sortingNICCodeField = fieldName;

        this.GetNICCode(this.searchText, this.currentPage, this.pageSize);
    }
}
