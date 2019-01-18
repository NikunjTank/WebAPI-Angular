import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FIPBPressReleaseCase, GetFIPBPressReleaseCaseRequest } from '../../../model/fIPBPressReleaseCase';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { FIPBPressReleaseCaseAdminService } from '../../../service/admin/fIPBPressReleaseCase.service';


@Component({
    selector: 'my-app',
    templateUrl: './fIPBPressReleaseCases.component.html'
})

export class FIPBPressReleaseCasesAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _fIPBPressReleaseCaseService: FIPBPressReleaseCaseAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router) { }

    _global: Global = new Global();

    fIPBPressReleaseCases: FIPBPressReleaseCase[];
    fIPBPressReleaseCase: FIPBPressReleaseCase;
    
    fIPBPressReleaseCaseId: number;

    frmFIPBPressReleaseCase: FormGroup;
    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    pdfServerPath: string = Global.FIPB_PRESS_RELEASE_CASE_PDF_FILEPATH;
    
    drpPageSize: number;

    sortingFIPBPressReleaseCaseField: string;
    sortingFIPBPressReleaseCaseDirection: string;
    
    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmFIPBPressReleaseCase = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetFIPBPressReleaseCase(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetFIPBPressReleaseCase(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getFIPBPressReleaseCaseRequest = new GetFIPBPressReleaseCaseRequest();
        getFIPBPressReleaseCaseRequest.SearchText = searchText;
        getFIPBPressReleaseCaseRequest.IsActive = null;
        getFIPBPressReleaseCaseRequest.OrderBy = this.sortingFIPBPressReleaseCaseField;
        getFIPBPressReleaseCaseRequest.OrderByDirection = this.sortingFIPBPressReleaseCaseDirection;
        getFIPBPressReleaseCaseRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getFIPBPressReleaseCaseRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._fIPBPressReleaseCaseService.getFIPBPressReleaseCase(getFIPBPressReleaseCaseRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.fIPBPressReleaseCases = data.Response;
                    
                    this.pageSize = getFIPBPressReleaseCaseRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FIPB_PRESS_RELEASE_CASE_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FIPB_PRESS_RELEASE_CASE_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchFIPBPressReleaseCase(formData) {
        this.currentPage = 1;
        this.searchText = formData.value.SearchText;
        
        this.GetFIPBPressReleaseCase(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetFIPBPressReleaseCase(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.GetFIPBPressReleaseCase(this.searchText, null, this.pageSize);
    }

    EditFIPBPressReleaseCase(fIPBPressReleaseCaseId) {
        this.router.navigate(['/admin/secure/fipbpressreleasecase/' + this._global.encryptValue(fIPBPressReleaseCaseId)]);
    }
    
    DeleteFIPBPressReleaseCase(fIPBPressReleaseCaseId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteFIPBPressReleaseCase = {
                "FIPBPressReleaseCaseId": fIPBPressReleaseCaseId
            };

            this._fIPBPressReleaseCaseService.deleteFIPBPressReleaseCase(deleteFIPBPressReleaseCase)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_FIPB_PRESS_RELEASE_CASE_TITLE, { closeButton: true });
                        this.GetFIPBPressReleaseCase();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FIPB_PRESS_RELEASE_CASE_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FIPB_PRESS_RELEASE_CASE_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }
    
    OnFIPBPressReleaseCaseSort(fieldName) {
        this.sortingFIPBPressReleaseCaseDirection = (this.sortingFIPBPressReleaseCaseField == fieldName) ? (this.sortingFIPBPressReleaseCaseDirection == "A") ? "D" : "A" : "A";
        this.sortingFIPBPressReleaseCaseField = fieldName;

        this.GetFIPBPressReleaseCase(this.searchText, this.currentPage, this.pageSize);
    }
}
