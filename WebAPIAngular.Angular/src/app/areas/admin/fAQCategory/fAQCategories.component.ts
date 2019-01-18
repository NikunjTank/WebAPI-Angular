import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FAQCategory, GetFAQCategoryRequest } from '../../../model/fAQCategory';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { FAQCategoryAdminService } from '../../../service/admin/fAQCategory.service';


@Component({
    selector: 'my-app',
    templateUrl: './fAQCategories.component.html'
})

export class FAQCategoriesAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _fAQCategoryService: FAQCategoryAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router) { }

    _global: Global = new Global();

    fAQCategories: FAQCategory[];

    frmFAQCategory: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];
    
    drpPageSize: number;
    
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


        this.frmFAQCategory = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetFAQCategory(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetFAQCategory(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getFAQCategoryRequest = new GetFAQCategoryRequest();
        getFAQCategoryRequest.SearchText = searchText;
        getFAQCategoryRequest.IsActive = null;
        getFAQCategoryRequest.OrderBy = this.sortingField;
        getFAQCategoryRequest.OrderByDirection = this.sortingDirection;
        getFAQCategoryRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getFAQCategoryRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._fAQCategoryService.getFAQCategory(getFAQCategoryRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.fAQCategories = data.Response;

                    this.pageSize = getFAQCategoryRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FAQ_CATEGORY_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FAQ_CATEGORY_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchFAQCategory(formData) {
        this.currentPage = 1;
        this.searchText = formData.value.SearchText;
        
        this.GetFAQCategory(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetFAQCategory(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.GetFAQCategory(this.searchText, null, this.pageSize);
    }

    EditFAQCategory(fAQCategoryId) {
        this.router.navigate(['/admin/secure/faqcategory/' + this._global.encryptValue(fAQCategoryId)]);
    }

    DeleteFAQCategory(fAQCategoryId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteFAQCategory = {
                "FAQCategoryId": fAQCategoryId
            };

            this._fAQCategoryService.deleteFAQCategory(deleteFAQCategory)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_FAQ_CATEGORY_TITLE, { closeButton: true });
                        this.GetFAQCategory();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FAQ_CATEGORY_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FAQ_CATEGORY_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }
    
    OnFAQCategorySort(fieldName) {
        this.sortingDirection = (this.sortingField == fieldName) ? (this.sortingDirection == "A") ? "D" : "A" : "A";
        this.sortingField = fieldName;
        
        this.GetFAQCategory(this.searchText, this.currentPage, this.pageSize);
    }
}