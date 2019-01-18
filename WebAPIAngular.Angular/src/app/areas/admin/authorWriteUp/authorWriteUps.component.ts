import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthorWriteUp, GetAuthorWriteUpRequest} from '../../../model/authorWriteUp';
import { AuthorWriteUpDetail, GetAuthorWriteUpDetailRequest, GetSubTopicRequest, SubTopic } from '../../../model/authorWriteUpDetail';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { AuthorWriteUpAdminService } from '../../../service/admin/authorWriteUp.service';
import { AuthorWriteUpDetailAdminService } from '../../../service/admin/authorWriteUpDetail.service';


@Component({
    selector: 'my-app',
    templateUrl: './authorWriteUps.component.html'
})

export class AuthorWriteUpsAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _authorWriteUpService: AuthorWriteUpAdminService, private _authorWriteUpDetailService: AuthorWriteUpDetailAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router) { }

    _global: Global = new Global();

    authorWriteUps: AuthorWriteUp[];
    authorWriteUp: AuthorWriteUp;

    authorWriteUpDetails: AuthorWriteUpDetail[];
    authorWriteUpId: number;

    frmAuthorWriteUp: FormGroup;
    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    authorWriteUpPDFServerPath: string = Global.AUTHOR_WRITE_UP_PDF_FILEPATH;
    authorWriteUpDetailPDFServerPath: string = Global.AUTHOR_WRITE_UP_DETAIL_PDF_FILEPATH;

    itemDetailAuthorWriteUps = { index: -1 };
    indexAuthorWriteUp: number = -1;

    drpPageSize: number;

    sortingAuthorWriteUpField: string;
    sortingAuthorWriteUpDirection: string;

    sortingAuthorWriteUpDetailField: string;
    sortingAuthorWriteUpDetailDirection: string;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.indexAuthorWriteUp = (params["indexAuthorWriteUp"]) ? parseInt(params["indexAuthorWriteUp"]) : -1;

            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;

            this.sortingAuthorWriteUpField = params["sortingAuthorWriteUpField"];
            this.sortingAuthorWriteUpDirection = params["sortingAuthorWriteUpDirection"];
            this.sortingAuthorWriteUpDetailField = params["sortingAuthorWriteUpDetailField"];
            this.sortingAuthorWriteUpDetailDirection = params["sortingAuthorWriteUpDetailDirection"];
        });


        this.frmAuthorWriteUp = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetAuthorWriteUp(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetAuthorWriteUp(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getAuthorWriteUpRequest = new GetAuthorWriteUpRequest();
        getAuthorWriteUpRequest.SearchText = searchText;
        getAuthorWriteUpRequest.IsActive = null;
        getAuthorWriteUpRequest.OrderBy = this.sortingAuthorWriteUpField;
        getAuthorWriteUpRequest.OrderByDirection = this.sortingAuthorWriteUpDirection;
        getAuthorWriteUpRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getAuthorWriteUpRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._authorWriteUpService.getAuthorWriteUp(getAuthorWriteUpRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.authorWriteUps = data.Response;

                    if (this.indexAuthorWriteUp != -1 && this.authorWriteUps.length > 0) {
                        this.itemDetailAuthorWriteUps.index = this.indexAuthorWriteUp;
                        this.GetAuthorWriteUpDetail(this.itemDetailAuthorWriteUps.index, this.authorWriteUps[this.itemDetailAuthorWriteUps.index].AuthorWriteUpId, true);
                    }

                    this.pageSize = getAuthorWriteUpRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchAuthorWriteUp(formData) {
        this.indexAuthorWriteUp = -1;

        this.itemDetailAuthorWriteUps.index = this.indexAuthorWriteUp;

        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.ReloadPage(false);
        this.GetAuthorWriteUp(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.ReloadPage(true);
        this.GetAuthorWriteUp(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.ReloadPage(false);
        this.GetAuthorWriteUp(this.searchText, null, this.pageSize);
    }

    EditAuthorWriteUp(authorWriteUpId) {
        this.router.navigate(['/admin/secure/authorwriteup/' + this._global.encryptValue(authorWriteUpId)], {
            queryParams: {
                indexAuthorWriteUp: this.indexAuthorWriteUp, sortingAuthorWriteUpField: this.sortingAuthorWriteUpField, sortingAuthorWriteUpDirection: this.sortingAuthorWriteUpDirection, sortingAuthorWriteUpDetailField: this.sortingAuthorWriteUpDetailField, sortingAuthorWriteUpDetailDirection: this.sortingAuthorWriteUpDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddAuthorWriteUpDetail(authorWriteUpId, index) {
        this.router.navigate(['/admin/secure/authorwriteupdetail/' + this._global.encryptValue(authorWriteUpId)], {
            queryParams: {
                indexAuthorWriteUp: this.indexAuthorWriteUp, sortingAuthorWriteUpField: this.sortingAuthorWriteUpField, sortingAuthorWriteUpDirection: this.sortingAuthorWriteUpDirection, sortingAuthorWriteUpDetailField: this.sortingAuthorWriteUpDetailField, sortingAuthorWriteUpDetailDirection: this.sortingAuthorWriteUpDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditAuthorWriteUpDetail(authorWriteUpId, authorWriteUpDetailId) {
        this.router.navigate(['/admin/secure/authorwriteupdetail/' + this._global.encryptValue(authorWriteUpId) + '/' + this._global.encryptValue(authorWriteUpDetailId)], {
            queryParams: {
                indexAuthorWriteUp: this.indexAuthorWriteUp, sortingAuthorWriteUpField: this.sortingAuthorWriteUpField, sortingAuthorWriteUpDirection: this.sortingAuthorWriteUpDirection, sortingAuthorWriteUpDetailField: this.sortingAuthorWriteUpDetailField, sortingAuthorWriteUpDetailDirection: this.sortingAuthorWriteUpDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    ReloadPage(isPageChange) {
        if (isPageChange == true) {
            this.indexAuthorWriteUp = -1;
            this.itemDetailAuthorWriteUps.index = this.indexAuthorWriteUp;
        }

        this.router.navigate(['/admin/secure/authorwriteups'], {
            queryParams: {
                indexAuthorWriteUp: this.indexAuthorWriteUp, sortingAuthorWriteUpField: this.sortingAuthorWriteUpField, sortingAuthorWriteUpDirection: this.sortingAuthorWriteUpDirection, sortingAuthorWriteUpDetailField: this.sortingAuthorWriteUpDetailField, sortingAuthorWriteUpDetailDirection: this.sortingAuthorWriteUpDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    DeleteAuthorWriteUp(authorWriteUpId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteAuthorWriteUp = {
                "AuthorWriteUpId": authorWriteUpId
            };

            this._authorWriteUpService.deleteAuthorWriteUp(deleteAuthorWriteUp)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { closeButton: true });
                        this.GetAuthorWriteUp();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteAuthorWriteUpDetail(authorWriteUpId: number, authorWriteUpDetailId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteAuthorWriteUpDetail = {
                "AuthorWriteUpDetailId": authorWriteUpDetailId
            };

            this._authorWriteUpDetailService.deleteAuthorWriteUpDetail(deleteAuthorWriteUpDetail)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { closeButton: true });
                        this.GetAuthorWriteUpDetail(this.itemDetailAuthorWriteUps.index, authorWriteUpId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    UpDownAuthorWriteUpArrow(index) {
        if (index === this.itemDetailAuthorWriteUps.index) {
            this.itemDetailAuthorWriteUps.index = null;
        } else {
            this.itemDetailAuthorWriteUps.index = index;
        }
    }

    GetAuthorWriteUpDetail(index, authorWriteUpId, isDeleted): void {
        this.spinnerService.show();

        let getAuthorWriteUpDetailRequest = new GetAuthorWriteUpDetailRequest();
        getAuthorWriteUpDetailRequest.AuthorWriteUpId = authorWriteUpId;
        getAuthorWriteUpDetailRequest.IsActive = null;
        getAuthorWriteUpDetailRequest.OrderBy = this.sortingAuthorWriteUpDetailField;
        getAuthorWriteUpDetailRequest.OrderByDirection = this.sortingAuthorWriteUpDetailDirection;
        getAuthorWriteUpDetailRequest.PageNumber = 1;
        getAuthorWriteUpDetailRequest.PageSize = 100000;

        this._authorWriteUpDetailService.getAuthorWriteUpDetail(getAuthorWriteUpDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.authorWriteUpDetails = data.Response;

                    if (isDeleted != true) {
                        this.UpDownAuthorWriteUpArrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    ShowAuthorWriteUpDetail(index, authorWriteUpId) {
        this.indexAuthorWriteUp = -1;
        this.authorWriteUpId = null;

        if (this.itemDetailAuthorWriteUps.index !== index) {
            if (authorWriteUpId) {
                this.authorWriteUpId = authorWriteUpId;
                this.indexAuthorWriteUp = index;
                this.GetAuthorWriteUpDetail(index, authorWriteUpId, false);
            }
        } else {
            this.UpDownAuthorWriteUpArrow(index);
        }
        this.ReloadPage(false);
    }
    
    OnAuthorWriteUpSort(fieldName) {
        this.sortingAuthorWriteUpDirection = (this.sortingAuthorWriteUpField == fieldName) ? (this.sortingAuthorWriteUpDirection == "A") ? "D" : "A" : "A";
        this.sortingAuthorWriteUpField = fieldName;
        this.ReloadPage(true);
        this.GetAuthorWriteUp(this.searchText, this.currentPage, this.pageSize);
    }

    OnAuthorWriteUpDetailSort(authorWriteUpId, fieldName) {
        this.sortingAuthorWriteUpDetailDirection = (this.sortingAuthorWriteUpDetailField == fieldName) ? (this.sortingAuthorWriteUpDetailDirection == "A") ? "D" : "A" : "A";
        this.sortingAuthorWriteUpDetailField = fieldName;
        this.ReloadPage(false);
        this.GetAuthorWriteUpDetail(this.itemDetailAuthorWriteUps.index, authorWriteUpId, true);
    }
}
