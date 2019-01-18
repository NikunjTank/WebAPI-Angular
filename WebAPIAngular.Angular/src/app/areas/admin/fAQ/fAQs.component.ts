import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FAQ, GetFAQRequest } from '../../../model/fAQ';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { FAQAdminService } from '../../../service/admin/fAQ.service';


@Component({
    selector: 'my-app',
    templateUrl: './fAQs.component.html'
})

export class FAQsAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _fAQService: FAQAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router) { }

    _global: Global = new Global();

    fAQs: FAQ[];

    frmFAQ: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];
    
    drpPageSize: number;

    pdfServerPath: string = Global.FAQ_PDF_FILEPATH;

    sortingField: string;
    sortingDirection: string;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmFAQ = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetFAQ(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetFAQ(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getFAQRequest = new GetFAQRequest();
        getFAQRequest.SearchText = searchText;
        getFAQRequest.IsActive = null;
        getFAQRequest.OrderBy = this.sortingField;
        getFAQRequest.OrderByDirection = this.sortingDirection;
        getFAQRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getFAQRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._fAQService.getFAQ(getFAQRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.fAQs = data.Response;
                    
                    this.pageSize = getFAQRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FAQ_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FAQ_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchFAQ(formData) {
        this.currentPage = 1;
        this.searchText = formData.value.SearchText;
        
        this.GetFAQ(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetFAQ(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.GetFAQ(this.searchText, null, this.pageSize);
    }

    EditFAQ(fAQId) {
        this.router.navigate(['/admin/secure/faq/' + this._global.encryptValue(fAQId)]);
    }

    DeleteFAQ(fAQId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteFAQ = {
                "FAQId": fAQId
            };

            this._fAQService.deleteFAQ(deleteFAQ)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_FAQ_TITLE, { closeButton: true });
                        this.GetFAQ();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FAQ_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FAQ_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }
    
    OnFAQSort(fieldName) {
        this.sortingDirection = (this.sortingField == fieldName) ? (this.sortingDirection == "A") ? "D" : "A" : "A";
        this.sortingField = fieldName;
        
        this.GetFAQ(this.searchText, this.currentPage, this.pageSize);
    }
}