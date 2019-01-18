import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthorFAQ, GetAuthorFAQRequest} from '../../../model/authorFAQ';
import { AuthorFAQDetail, GetAuthorFAQDetailRequest, GetSubTopicRequest, SubTopic } from '../../../model/authorFAQDetail';
import { AuthorFAQQuestionReply, GetAuthorFAQQuestionReplyRequest } from '../../../model/authorFAQQuestionReply';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { AuthorFAQAdminService } from '../../../service/admin/authorFAQ.service';
import { AuthorFAQDetailAdminService } from '../../../service/admin/authorFAQDetail.service';
import { AuthorFAQQuestionReplyAdminService } from '../../../service/admin/authorFAQQuestionReply.service';


@Component({
    selector: 'my-app',
    templateUrl: './authorFAQs.component.html'
})

export class AuthorFAQsAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _authorFAQService: AuthorFAQAdminService, private _authorFAQDetailService: AuthorFAQDetailAdminService, private _authorFAQQuestionReplyService: AuthorFAQQuestionReplyAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router) { }

    _global: Global = new Global();

    authorFAQs: AuthorFAQ[];
    authorFAQ: AuthorFAQ;

    authorFAQDetails: AuthorFAQDetail[];
    authorFAQQuestionReplies: AuthorFAQQuestionReply[];
    
    frmAuthorFAQ: FormGroup;
    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    itemDetailAuthorFAQs = { index: -1 };
    indexAuthorFAQ: number = -1;

    itemDetailAuthorFAQDetails = { index: -1 };
    indexAuthorFAQDetail: number = -1;

    drpPageSize: number;

    sortingAuthorFAQField: string;
    sortingAuthorFAQDirection: string;

    sortingAuthorFAQDetailField: string;
    sortingAuthorFAQDetailDirection: string;

    sortingAuthorFAQQuestionReplyField: string;
    sortingAuthorFAQQuestionReplyDirection: string;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.indexAuthorFAQ = (params["indexAuthorFAQ"]) ? parseInt(params["indexAuthorFAQ"]) : -1;
            this.indexAuthorFAQDetail = (params["indexAuthorFAQDetail"]) ? parseInt(params["indexAuthorFAQDetail"]) : -1;

            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;

            this.sortingAuthorFAQField = params["sortingAuthorFAQField"];
            this.sortingAuthorFAQDirection = params["sortingAuthorFAQDirection"];
            this.sortingAuthorFAQDetailField = params["sortingAuthorFAQDetailField"];
            this.sortingAuthorFAQDetailDirection = params["sortingAuthorFAQDetailDirection"];
            this.sortingAuthorFAQQuestionReplyField = params["sortingAuthorFAQQuestionReplyField"];
            this.sortingAuthorFAQQuestionReplyDirection = params["sortingAuthorFAQQuestionReplyDirection"];
        });


        this.frmAuthorFAQ = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetAuthorFAQ(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetAuthorFAQ(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getAuthorFAQRequest = new GetAuthorFAQRequest();
        getAuthorFAQRequest.SearchText = searchText;
        getAuthorFAQRequest.IsActive = null;
        getAuthorFAQRequest.OrderBy = this.sortingAuthorFAQField;
        getAuthorFAQRequest.OrderByDirection = this.sortingAuthorFAQDirection;
        getAuthorFAQRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getAuthorFAQRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._authorFAQService.getAuthorFAQ(getAuthorFAQRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.authorFAQs = data.Response;

                    if (this.indexAuthorFAQ != -1 && this.authorFAQs.length > 0) {
                        this.itemDetailAuthorFAQs.index = this.indexAuthorFAQ;
                        this.GetAuthorFAQDetail(this.itemDetailAuthorFAQs.index, this.authorFAQs[this.itemDetailAuthorFAQs.index].AuthorFAQId, true);
                    }

                    this.pageSize = getAuthorFAQRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchAuthorFAQ(formData) {
        this.indexAuthorFAQ = -1;
        this.indexAuthorFAQDetail = -1;
        this.itemDetailAuthorFAQs.index = this.indexAuthorFAQ;
        this.itemDetailAuthorFAQDetails.index = this.indexAuthorFAQDetail;

        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.ReloadPage(false);
        this.GetAuthorFAQ(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.ReloadPage(true);
        this.GetAuthorFAQ(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.ReloadPage(false);
        this.GetAuthorFAQ(this.searchText, null, this.pageSize);
    }

    EditAuthorFAQ(authorFAQId) {
        this.router.navigate(['/admin/secure/authorfaq/' + this._global.encryptValue(authorFAQId)], {
            queryParams: {
                indexAuthorFAQ: this.indexAuthorFAQ, indexAuthorFAQDetail: this.indexAuthorFAQDetail, sortingAuthorFAQField: this.sortingAuthorFAQField, sortingAuthorFAQDirection: this.sortingAuthorFAQDirection, sortingAuthorFAQQuestionReplyField: this.sortingAuthorFAQQuestionReplyField, sortingAuthorFAQQuestionReplyDirection: this.sortingAuthorFAQQuestionReplyDirection, sortingAuthorFAQDetailField: this.sortingAuthorFAQDetailField, sortingAuthorFAQDetailDirection: this.sortingAuthorFAQDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddAuthorFAQDetail(authorFAQId, index) {
        this.router.navigate(['/admin/secure/authorfaqdetail/' + this._global.encryptValue(authorFAQId)], {
            queryParams: {
                indexAuthorFAQ: this.indexAuthorFAQ, indexAuthorFAQDetail: this.indexAuthorFAQDetail, sortingAuthorFAQField: this.sortingAuthorFAQField, sortingAuthorFAQDirection: this.sortingAuthorFAQDirection, sortingAuthorFAQQuestionReplyField: this.sortingAuthorFAQQuestionReplyField, sortingAuthorFAQQuestionReplyDirection: this.sortingAuthorFAQQuestionReplyDirection, sortingAuthorFAQDetailField: this.sortingAuthorFAQDetailField, sortingAuthorFAQDetailDirection: this.sortingAuthorFAQDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditAuthorFAQDetail(authorFAQId, authorFAQDetailId) {
        this.router.navigate(['/admin/secure/authorfaqdetail/' + this._global.encryptValue(authorFAQId) + '/' + this._global.encryptValue(authorFAQDetailId)], {
            queryParams: {
                indexAuthorFAQ: this.indexAuthorFAQ, indexAuthorFAQDetail: this.indexAuthorFAQDetail, sortingAuthorFAQField: this.sortingAuthorFAQField, sortingAuthorFAQDirection: this.sortingAuthorFAQDirection, sortingAuthorFAQQuestionReplyField: this.sortingAuthorFAQQuestionReplyField, sortingAuthorFAQQuestionReplyDirection: this.sortingAuthorFAQQuestionReplyDirection, sortingAuthorFAQDetailField: this.sortingAuthorFAQDetailField, sortingAuthorFAQDetailDirection: this.sortingAuthorFAQDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddAuthorFAQQuestionReply(authorFAQId, authorFAQDetailId, index) {
        this.router.navigate(['/admin/secure/authorfaqquestionreply/' + this._global.encryptValue(authorFAQId) + '/' + this._global.encryptValue(authorFAQDetailId)], {
            queryParams: {
                indexAuthorFAQ: this.indexAuthorFAQ, indexAuthorFAQDetail: this.indexAuthorFAQDetail, sortingAuthorFAQField: this.sortingAuthorFAQField, sortingAuthorFAQDirection: this.sortingAuthorFAQDirection, sortingAuthorFAQQuestionReplyField: this.sortingAuthorFAQQuestionReplyField, sortingAuthorFAQQuestionReplyDirection: this.sortingAuthorFAQQuestionReplyDirection, sortingAuthorFAQDetailField: this.sortingAuthorFAQDetailField, sortingAuthorFAQDetailDirection: this.sortingAuthorFAQDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditAuthorFAQQuestionReply(authorFAQId, authorFAQDetailId, authorFAQQuestionReplyId) {
        this.router.navigate(['/admin/secure/authorfaqquestionreply/' + this._global.encryptValue(authorFAQId) + '/' + this._global.encryptValue(authorFAQDetailId) + '/' + this._global.encryptValue(authorFAQQuestionReplyId)], {
            queryParams: {
                indexAuthorFAQ: this.indexAuthorFAQ, indexAuthorFAQDetail: this.indexAuthorFAQDetail, sortingAuthorFAQField: this.sortingAuthorFAQField, sortingAuthorFAQDirection: this.sortingAuthorFAQDirection, sortingAuthorFAQQuestionReplyField: this.sortingAuthorFAQQuestionReplyField, sortingAuthorFAQQuestionReplyDirection: this.sortingAuthorFAQQuestionReplyDirection, sortingAuthorFAQDetailField: this.sortingAuthorFAQDetailField, sortingAuthorFAQDetailDirection: this.sortingAuthorFAQDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    ReloadPage(isPageChange) {
        if (isPageChange == true) {
            this.indexAuthorFAQ = -1;
            this.itemDetailAuthorFAQs.index = this.indexAuthorFAQ;
        }

        this.router.navigate(['/admin/secure/authorfaqs'], {
            queryParams: {
                indexAuthorFAQ: this.indexAuthorFAQ, indexAuthorFAQDetail: this.indexAuthorFAQDetail, sortingAuthorFAQField: this.sortingAuthorFAQField, sortingAuthorFAQDirection: this.sortingAuthorFAQDirection, sortingAuthorFAQQuestionReplyField: this.sortingAuthorFAQQuestionReplyField, sortingAuthorFAQQuestionReplyDirection: this.sortingAuthorFAQQuestionReplyDirection, sortingAuthorFAQDetailField: this.sortingAuthorFAQDetailField, sortingAuthorFAQDetailDirection: this.sortingAuthorFAQDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    DeleteAuthorFAQ(authorFAQId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteAuthorFAQ = {
                "AuthorFAQId": authorFAQId
            };

            this._authorFAQService.deleteAuthorFAQ(deleteAuthorFAQ)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { closeButton: true });
                        this.GetAuthorFAQ();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteAuthorFAQDetail(authorFAQId: number, authorFAQDetailId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteAuthorFAQDetail = {
                "AuthorFAQDetailId": authorFAQDetailId
            };

            this._authorFAQDetailService.deleteAuthorFAQDetail(deleteAuthorFAQDetail)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { closeButton: true });
                        this.GetAuthorFAQDetail(this.itemDetailAuthorFAQs.index, authorFAQId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteAuthorFAQQuestionReply(authorFAQDetailId: number, authorFAQQuestionReplyId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteAuthorFAQQuestionReply = {
                "AuthorFAQQuestionReplyId": authorFAQQuestionReplyId
            };

            this._authorFAQQuestionReplyService.deleteAuthorFAQQuestionReply(deleteAuthorFAQQuestionReply)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { closeButton: true });
                        this.GetAuthorFAQQuestionReply(this.itemDetailAuthorFAQDetails.index, authorFAQDetailId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    UpDownAuthorFAQArrow(index) {
        this.itemDetailAuthorFAQDetails.index = -1;

        if (index === this.itemDetailAuthorFAQs.index) {
            this.itemDetailAuthorFAQs.index = null;
        } else {
            this.itemDetailAuthorFAQs.index = index;
        }
    }

    UpDownAuthorFAQDetailArrow(index) {
        if (index === this.itemDetailAuthorFAQDetails.index) {
            this.itemDetailAuthorFAQDetails.index = null;
        } else {
            this.itemDetailAuthorFAQDetails.index = index;
        }
    }

    GetAuthorFAQDetail(index, authorFAQId, isDeleted): void {
        this.spinnerService.show();
        
        let getAuthorFAQDetailRequest = new GetAuthorFAQDetailRequest();
        getAuthorFAQDetailRequest.AuthorFAQId = authorFAQId;
        getAuthorFAQDetailRequest.IsActive = null;
        getAuthorFAQDetailRequest.OrderBy = this.sortingAuthorFAQDetailField;
        getAuthorFAQDetailRequest.OrderByDirection = this.sortingAuthorFAQDetailDirection;
        getAuthorFAQDetailRequest.PageNumber = 1;
        getAuthorFAQDetailRequest.PageSize = 100000;
        
        this._authorFAQDetailService.getAuthorFAQDetail(getAuthorFAQDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.authorFAQDetails = data.Response;

                    if (this.indexAuthorFAQDetail != -1 && this.authorFAQDetails.length > 0) {
                        this.itemDetailAuthorFAQDetails.index = this.indexAuthorFAQDetail;
                        this.GetAuthorFAQQuestionReply(this.itemDetailAuthorFAQDetails.index, this.authorFAQDetails[this.itemDetailAuthorFAQDetails.index].AuthorFAQDetailId, true);
                    }

                    if (isDeleted != true) {
                        this.UpDownAuthorFAQArrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetAuthorFAQQuestionReply(index, authorFAQDetailId, isDeleted): void {
        this.spinnerService.show();

        let getAuthorFAQQuestionReplyRequest = new GetAuthorFAQQuestionReplyRequest();
        getAuthorFAQQuestionReplyRequest.AuthorFAQDetailId = authorFAQDetailId;
        getAuthorFAQQuestionReplyRequest.IsActive = null;
        getAuthorFAQQuestionReplyRequest.OrderBy = this.sortingAuthorFAQDetailField;
        getAuthorFAQQuestionReplyRequest.OrderByDirection = this.sortingAuthorFAQDetailDirection;
        getAuthorFAQQuestionReplyRequest.PageNumber = 1;
        getAuthorFAQQuestionReplyRequest.PageSize = 100000;

        this._authorFAQQuestionReplyService.getAuthorFAQQuestionReply(getAuthorFAQQuestionReplyRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.authorFAQQuestionReplies = data.Response;

                    if (isDeleted != true) {
                        this.UpDownAuthorFAQDetailArrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    ShowAuthorFAQDetail(index, authorFAQId) {
        this.indexAuthorFAQ = -1;
        this.indexAuthorFAQDetail = -1;
        
        if (this.itemDetailAuthorFAQs.index !== index) {
            if (authorFAQId) {
                this.indexAuthorFAQ = index;
                this.GetAuthorFAQDetail(index, authorFAQId, false);
            }
        } else {
            this.UpDownAuthorFAQArrow(index);
        }
        this.ReloadPage(false);
    }

    ShowAuthorFAQQuestionReply(index, authorFAQDetailId) {
        this.indexAuthorFAQDetail = -1;

        if (this.itemDetailAuthorFAQDetails.index !== index) {
            if (authorFAQDetailId) {
                this.indexAuthorFAQDetail = index;
                this.GetAuthorFAQQuestionReply(index, authorFAQDetailId, false);
            }
        } else {
            this.UpDownAuthorFAQDetailArrow(index);
        }
        this.ReloadPage(false);
    }

    OnAuthorFAQSort(fieldName) {
        this.sortingAuthorFAQDirection = (this.sortingAuthorFAQField == fieldName) ? (this.sortingAuthorFAQDirection == "A") ? "D" : "A" : "A";
        this.sortingAuthorFAQField = fieldName;
        this.ReloadPage(true);
        this.GetAuthorFAQ(this.searchText, this.currentPage, this.pageSize);
    }

    OnAuthorFAQDetailSort(authorFAQId, fieldName) {
        this.indexAuthorFAQDetail = -1;
        this.itemDetailAuthorFAQDetails.index = this.indexAuthorFAQDetail;
        
        this.sortingAuthorFAQDetailDirection = (this.sortingAuthorFAQDetailField == fieldName) ? (this.sortingAuthorFAQDetailDirection == "A") ? "D" : "A" : "A";
        this.sortingAuthorFAQDetailField = fieldName;
        this.ReloadPage(false);
        this.GetAuthorFAQDetail(this.itemDetailAuthorFAQs.index, authorFAQId, true);
    }

    OnAuthorFAQQuestionReplySort(authorFAQDetailId, fieldName) {
        this.sortingAuthorFAQQuestionReplyDirection = (this.sortingAuthorFAQQuestionReplyField == fieldName) ? (this.sortingAuthorFAQQuestionReplyDirection == "A") ? "D" : "A" : "A";
        this.sortingAuthorFAQQuestionReplyField = fieldName;
        this.ReloadPage(false);
        this.GetAuthorFAQQuestionReply(this.itemDetailAuthorFAQDetails.index, authorFAQDetailId, true);
    }
}
