import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FIPBReview, GetFIPBReviewRequest } from '../../../model/fIPBReview';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { FIPBReviewAdminService } from '../../../service/admin/fIPBReview.service';


@Component({
    selector: 'my-app',
    templateUrl: './fIPBReviews.component.html'
})

export class FIPBReviewsAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _fIPBReviewService: FIPBReviewAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router) { }

    _global: Global = new Global();

    fIPBReviews: FIPBReview[];
    fIPBReview: FIPBReview;
    
    fIPBReviewId: number;

    frmFIPBReview: FormGroup;
    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    pdfServerPath: string = Global.FIPBREVIEW_PDF_FILEPATH;
    
    drpPageSize: number;

    sortingFIPBReviewField: string;
    sortingFIPBReviewDirection: string;
    
    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmFIPBReview = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetFIPBReview(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetFIPBReview(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getFIPBReviewRequest = new GetFIPBReviewRequest();
        getFIPBReviewRequest.SearchText = searchText;
        getFIPBReviewRequest.IsActive = null;
        getFIPBReviewRequest.OrderBy = this.sortingFIPBReviewField;
        getFIPBReviewRequest.OrderByDirection = this.sortingFIPBReviewDirection;
        getFIPBReviewRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getFIPBReviewRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._fIPBReviewService.getFIPBReview(getFIPBReviewRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.fIPBReviews = data.Response;
                    
                    this.pageSize = getFIPBReviewRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FIPBREVIEW_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FIPBREVIEW_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchFIPBReview(formData) {
        this.currentPage = 1;
        this.searchText = formData.value.SearchText;
        
        this.GetFIPBReview(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetFIPBReview(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.GetFIPBReview(this.searchText, null, this.pageSize);
    }

    EditFIPBReview(fIPBReviewId) {
        this.router.navigate(['/admin/secure/fipbreview/' + this._global.encryptValue(fIPBReviewId)]);
    }
    
    DeleteFIPBReview(fIPBReviewId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteFIPBReview = {
                "FIPBReviewId": fIPBReviewId
            };

            this._fIPBReviewService.deleteFIPBReview(deleteFIPBReview)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_FIPBREVIEW_TITLE, { closeButton: true });
                        this.GetFIPBReview();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FIPBREVIEW_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FIPBREVIEW_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }
    
    OnFIPBReviewSort(fieldName) {
        this.sortingFIPBReviewDirection = (this.sortingFIPBReviewField == fieldName) ? (this.sortingFIPBReviewDirection == "A") ? "D" : "A" : "A";
        this.sortingFIPBReviewField = fieldName;

        this.GetFIPBReview(this.searchText, this.currentPage, this.pageSize);
    }
}
