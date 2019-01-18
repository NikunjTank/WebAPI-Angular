import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


import { GetSearchRequest } from '../../../model/search';
import { SearchService } from '../../../service/common/search.service';
import { GetSubscriptionRequest } from '../../../model/subscription';
import { SubscriptionUserService } from '../../../service/user/subscription.service';
import { GetCommonFieldRequest } from '../../../model/commonField';
import { CommonFieldService } from '../../../service/common/commonField.service';
import { DropDown } from '../../../common/dropDown';

import { ModalDialogService } from 'ngx-modal-dialog';
import { LoginRegisterPopupGuestComponent } from '../layout/loginRegisterPopup.component';
import { SubscriptionPopupUserComponent } from '../../../areas/user/subscription/subscriptionPopup.component';
import { SearchedPDFPopupUserComponent } from './searchedPDFPopup.component';

import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

@Component({
    selector: 'app-public',
    templateUrl: './home.component.html'
})
export class HomeGuestComponent implements OnInit {
    searchData: any = [];
    searchAutoCompleteData: string[] = [];
    selectedIndex: number;

    constructor(private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private toastr: ToastrService,
        private vcr: ViewContainerRef,
        private spinnerService: SpinnerService,
        private router: Router,
        private _searchService: SearchService,
        private _subscriptionService: SubscriptionUserService,
        private _commonFieldService: CommonFieldService,
        private modalDialogService: ModalDialogService) { }

    _global: Global = new Global();

    frmSearch: FormGroup;
    searchText: string;
    previousSearchText: string;
    public config: PerfectScrollbarConfigInterface = {};

    totalRecords: number;
    currentPage: number;
    pageSize: number = Global.USER_PAGE_SIZE;
    msg: string;
    arrowkeyLocation: number = 0;

    ngOnInit() {
        this.frmSearch = this.formBuilder.group({
            CategoryId: [''],
            SearchText: ['']
        });
    }

    //GetCategory() {
    //    this.spinnerService.show();

    //    let getCommonFieldRequest = new GetCommonFieldRequest();
    //    getCommonFieldRequest.FieldTypeName = Global.COMMON_FIELD_SEARCH_CATEGORY;

    //    this._commonFieldService.getCommonField(getCommonFieldRequest)
    //        .subscribe(data => {
    //            this.spinnerService.hide();
    //            this.categories = [];

    //            if (data.Status == Global.API_SUCCESS) {
    //                this.categories.push({ Value: "", Text: "All" });

    //                data.Response.forEach(item => {
    //                    this.categories.push({ Value: item.FieldId, Text: item.FieldName });
    //                });
    //            }
    //            else {
    //                this.toastr.error(data.Description, Global.TOASTR_SEARCH_TITLE, { closeButton: true });
    //            }
    //        },
    //            error => {
    //                this.spinnerService.hide();
    //                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_SEARCH_TITLE, { enableHtml: true, closeButton: true });
    //            });
    //}

    FilterSearchText(searchText) {
        return searchText.trim().replace(/  +/g, ' ').replace("<b>", "").replace("</b>", "");
    }

    OnSearchAutoCompleteKeyUp(formData, event: KeyboardEvent) {
        if (formData.value.SearchText) {
            if (event.keyCode <= 90 && event.keyCode >= 46 || event.keyCode >= 96 && event.keyCode <= 111 || event.keyCode >= 186 || event.keyCode == 8 || event.keyCode == 32 || event.type == "click") {
                let getSearchRequest = new GetSearchRequest();
                getSearchRequest.SearchText = this.FilterSearchText(formData.value.SearchText);

                this._searchService.getSearchAutoCompleteData(getSearchRequest)
                    .subscribe(data => {
                        this.searchAutoCompleteData = [];
                        this.arrowkeyLocation = -1;
                        this.previousSearchText = formData.value.SearchText;

                        if (data.Status == Global.API_SUCCESS) {
                            data.Response.forEach(item => {
                                let numDiffChar = 0;
                                let index = 0;
                                while (index < this.FilterSearchText(formData.value.SearchText).length) {
                                    if (item.SearchContent.charAt(index).toLowerCase() !== this.FilterSearchText(formData.value.SearchText).charAt(index).toLowerCase()) {
                                        break;
                                    }
                                    index++;
                                    numDiffChar = index;
                                }

                                let matched = item.SearchContent.substr(0, numDiffChar);
                                let unMatched = item.SearchContent.substr(numDiffChar);
                                
                                //let matched = item.SearchContent.substr(
                                //    item.SearchContent.toLowerCase().indexOf(
                                //        this.FilterSearchText(formData.value.SearchText).toLowerCase()
                                //    ),
                                //    this.FilterSearchText(formData.value.SearchText).length);
                                //let unMatched = item.SearchContent.substr(this.FilterSearchText(formData.value.SearchText).length);

                                this.searchAutoCompleteData.push(matched + "<b>" + unMatched + "</b>");
                            });
                        } else {
                            this.toastr.error(data.Description, Global.TOASTR_SEARCH_TITLE, { closeButton: true });
                        }
                    },
                        error => {
                            this.spinnerService.hide();
                            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_SEARCH_TITLE, { enableHtml: true, closeButton: true });
                        });
            } else {
                if (event.keyCode == 38) {
                    let txtSearch: any = document.getElementById("txtSearch");
                    txtSearch.setSelectionRange(txtSearch.value.length, txtSearch.value.length);
                }
            }
        } else {
            this.searchAutoCompleteData = [];
        }
    }

    OnSearchAutoCompleteClick(formData, event: KeyboardEvent) {
        if (formData.value.SearchText && this.searchData.length > 0) {
            this.arrowkeyLocation = 0;
            this.OnSearchAutoCompleteKeyUp(formData, event);
        }
    }

    OnSearchAutoCompleteKeyDown(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 38: // this is the ascii of arrow up
                if (this.arrowkeyLocation > 0)
                    this.arrowkeyLocation--;
                else
                    this.arrowkeyLocation = (this.arrowkeyLocation == -1) ? this.searchAutoCompleteData.length - 1 : -1;

                if (this.searchAutoCompleteData.length > 0)
                    this.frmSearch.get("SearchText").setValue((this.arrowkeyLocation == -1) ? this.previousSearchText : this.searchAutoCompleteData[this.arrowkeyLocation].replace("<b>", "").replace("</b>", ""));
                break;
            case 40: // this is the ascii of arrow down
                if (this.searchAutoCompleteData.length - 1 > this.arrowkeyLocation)
                    this.arrowkeyLocation++;
                else
                    this.arrowkeyLocation = -1;

                if (this.searchAutoCompleteData.length > 0)
                    this.frmSearch.get("SearchText").setValue((this.arrowkeyLocation == -1) ? this.previousSearchText : this.searchAutoCompleteData[this.arrowkeyLocation].replace("<b>", "").replace("</b>", ""));
                break;
            case 27:
                this.searchAutoCompleteData = [];
        }
        this.frmSearch.updateValueAndValidity();
    }

    ShowPDFPopup() {
        this.modalDialogService.openDialog(this.vcr, {
            settings: {
                headerClass: "hide",
                footerClass: "no-pad"
            },
            actionButtons: [{
                text: "x", buttonClass: "pointer-cursor close-button"
            }],
            childComponent: SearchedPDFPopupUserComponent,
            data: this.searchData[this.selectedIndex]
        });
    }

    OnSearchClick(searchText) {
        this.currentPage = 1;
        this.searchText = searchText.replace("<b>", "").replace("</b>", "");

        this.frmSearch.get("SearchText").setValue(this.searchText);
        this.frmSearch.updateValueAndValidity();
        this.GetSearchData();
    }

    OnSearchAutoCompleteFocusOut() {
        this.searchAutoCompleteData = [];
    }

    GetSearchData(): void {
        this.spinnerService.show();

        let getSearchRequest = new GetSearchRequest();
        //getSearchRequest.CategoryId = this.categoryId;
        getSearchRequest.SearchText = this.searchText;
        getSearchRequest.OrderBy = null;
        getSearchRequest.OrderByDirection = null;
        getSearchRequest.PageNumber = this.currentPage;
        getSearchRequest.PageSize = this.pageSize;

        this._searchService.getSearchData(getSearchRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.searchData = [];
                this.searchAutoCompleteData = [];

                if (data.Status == Global.API_SUCCESS) {
                    if (data.Response.length <= 0)
                        this.searchData.push({ CategoryId: 0, Title: null, Number: null, Name: "No data found.", PDF: null });

                    data.Response.forEach(item => {
                        let title = (item.CategoryId == Global.SEARCH_CATEGORY_ID_NOTIFICATION) ? Global.SEARCH_CATEGORY_NAME_NOTIFICATION :
                            (item.CategoryId == Global.SEARCH_CATEGORY_ID_AP_DIR_CIRCULAR) ? Global.SEARCH_CATEGORY_NAME_AP_DIR_CIRCULAR :
                                (item.CategoryId == Global.SEARCH_CATEGORY_ID_MASTER_DIRECTION) ? Global.SEARCH_CATEGORY_NAME_MASTER_DIRECTION :
                                    (item.CategoryId == Global.SEARCH_CATEGORY_ID_FDI_CIRCULAR) ? Global.SEARCH_CATEGORY_NAME_FDI_CIRCULAR :
                                        (item.CategoryId == Global.SEARCH_CATEGORY_ID_COMPOUNDING_ORDER) ? Global.SEARCH_CATEGORY_NAME_COMPOUNDING_ORDER :
                                            (item.CategoryId == Global.SEARCH_CATEGORY_ID_PRESS_NOTE) ? Global.SEARCH_CATEGORY_NAME_PRESS_NOTE :
                                                (item.CategoryId == Global.SEARCH_CATEGORY_ID_ACT) ? Global.SEARCH_CATEGORY_NAME_ACT :
                                                    (item.CategoryId == Global.SEARCH_CATEGORY_ID_FORM) ? Global.SEARCH_CATEGORY_NAME_FORM :
                                                        (item.CategoryId == Global.SEARCH_CATEGORY_ID_SUMMARY) ? Global.SEARCH_CATEGORY_NAME_SUMMARY :
                                                            (item.CategoryId == Global.SEARCH_CATEGORY_ID_DOCUMENTATION) ? Global.SEARCH_CATEGORY_NAME_DOCUMENTATION :
                                                                (item.CategoryId == Global.SEARCH_CATEGORY_ID_MASTER_CIRCULAR) ? Global.SEARCH_CATEGORY_NAME_MASTER_CIRCULAR :
                                                                    (item.CategoryId == Global.SEARCH_CATEGORY_ID_RULES_GSR) ? Global.SEARCH_CATEGORY_NAME_RULES_GSR :
                                                                        (item.CategoryId == Global.SEARCH_CATEGORY_ID_FIPB_REVIEW) ? Global.SEARCH_CATEGORY_NAME_FIPB_REVIEW :
                                                                            (item.CategoryId == Global.SEARCH_CATEGORY_ID_DIPP_CLARIFICATION) ? Global.SEARCH_CATEGORY_NAME_DIPP_CLARIFICATION :
                                                                                (item.CategoryId == Global.SEARCH_CATEGORY_ID_FIPB_PRESS_RELEASE_CASE) ? Global.SEARCH_CATEGORY_NAME_FIPB_PRESS_RELEASE_CASE :
                                                                                    (item.CategoryId == Global.SEARCH_CATEGORY_ID_REGULATION_INDEX) ? Global.SEARCH_CATEGORY_NAME_REGULATION_INDEX : '';

                        this.searchData.push({ CategoryId: item.CategoryId, Title: title, Number: item.Number, Name: item.Name, PDF: item.PDF, Excel: item.Excel, Word: item.Word, Content: item.Content });
                    });

                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_SEARCH_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_SEARCH_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchData(formData) {
        //let searchText = formData.value.SearchText.replace("<b>", "").replace("</b>", "");
        let searchText = this.FilterSearchText(formData.value.SearchText);

        if (searchText) {
            this.currentPage = 1;
            this.searchText = searchText;
            this.GetSearchData();
        }
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetSearchData();
    }

    IsLoggedIn() {
        if (this._global.getUserToken() && Number(this._global.getRoleId()) == Global.USER_ROLEID)
            return true;
        return false;
    }

    GoFEMAModule() {
        if (this.IsLoggedIn()) {
            this.CheckIsSubscribed();
        } else {
            this.ShowLoginPopup();
        }
    }

    ShowLoginPopup() {
        this.modalDialogService.openDialog(this.vcr, {
            settings: {
                headerClass: "hide",
                footerClass: "no-pad",
                bodyClass: "no-pad",
                contentClass: "login-modal-content modal-content"
            },
            childComponent: LoginRegisterPopupGuestComponent,
            data: 'login'
        });
    }

    ShowSubscribePopup() {
        let t_this = this;
        this.modalDialogService.openDialog(this.vcr, {
            settings: {
                headerClass: "hide",
                footerClass: "no-pad",
                contentClass: "subscribe-modal-content modal-content"
            },
            actionButtons: [{
                text: "x", buttonClass: "pointer-cursor close-button"
            }],
            childComponent: SubscriptionPopupUserComponent
        });
    }

    CheckIsSubscribed() {
        this.spinnerService.show();

        let getSubscriptionRequest = new GetSubscriptionRequest();
        getSubscriptionRequest.UserId = parseInt(this._global.getCookie(Global.USER_ID));

        this._subscriptionService.getSubscription(getSubscriptionRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Response.length > 0 && data.Response[0].IsExpired == false && data.Response[0].IsActive == true) {
                    if (data.Response[0].StartDate)
                        this._global.setCookie(Global.IS_SUBSCRIBED, true, 365);
                    else
                        this._global.deleteCookie(Global.IS_SUBSCRIBED);
                } else {
                    this._global.deleteCookie(Global.IS_SUBSCRIBED);
                }

                if (this._global.getCookie(Global.IS_SUBSCRIBED)) {
                    this.ShowPDFPopup();
                } else {
                    this.ShowSubscribePopup();
                }
            }, error => this.msg = <any>error);
    }

    ReadMore(index) {
        this.selectedIndex = index;

        if (this.searchData[this.selectedIndex] && this.searchData[this.selectedIndex].CategoryId != 0) {
            this.GoFEMAModule();
        }
    }
}