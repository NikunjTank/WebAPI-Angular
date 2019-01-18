import { Component, ComponentRef, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { DropDown } from '../../../common/dropDown';

import { PressNoteOfFEMASubModuleDetail, GetPressNoteOfFEMASubModuleDetailRequest } from '../../../model/pressNoteOfFEMASubModuleDetail';
import { PressNoteOfFEMASubModuleDetailUserService } from '../../../service/user/pressNoteOfFEMASubModuleDetail.service';

import { FDICircular, GetFDICircularRequest } from '../../../model/fDICircular';
import { FDIChapter, GetFDIChapterRequest } from '../../../model/fDIChapter';
import { FDICircularIndex, GetFDICircularIndexRequest } from '../../../model/fDICircularIndex';
import { FDICircularSubIndex, GetFDICircularSubIndexRequest } from '../../../model/fDICircularSubIndex';
import { FDICircularIndexAmendment, GetFDICircularIndexAmendmentRequest } from '../../../model/fDICircularIndexAmendment';
import { FAQ, GetFAQRequest } from '../../../model/fAQ';
import { RBIFAQOfFEMASubModuleDetail, GetRBIFAQOfFEMASubModuleDetailRequest } from '../../../model/rBIFAQOfFEMASubModuleDetail';

import { FAQUserService } from '../../../service/user/fAQ.service';
import { RBIFAQOfFEMASubModuleDetailUserService } from '../../../service/user/rBIFAQOfFEMASubModuleDetail.service';

import { FDICircularOfFEMASubModuleDetailUserService } from '../../../service/user/fDICircularOfFEMASubModuleDetail.service';

import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';

@Component({
    selector: 'my-app',
    templateUrl: './fDICircularPopup.component.html'
})

export class FDICircularPopupUserComponent {

    fDICirculars: FDICircular[];
    fDICircularRBIFAQs: any = [];
    fDICircularDIPPFAQs: any = [];
    fDICircularChapters: any = [];
    fDICircularIndexes: any = [];
    fDICircularSubIndexes: any = [];
    tempFDICircularIndexes: any = [];
    tempFDICircularSubIndexes: any = [];
    fDICircularIndexSubIndexAndAmendments: any = [];
    fDICircularIndexSubIndexPopup: string;

    fDICircularIndexSubIndexContents: any = [];
    fDICircularIndexAmendmentContents: any = [];
    indexSubIndexCounter: number;
    indexAmendmentCounter: number;

    dIPPFAQ: FAQ[] = [];
    dIPPFAQPDFUrl: any;

    gridviewIndexAmendmentTab: string = "gridview";
    isPreviousButton: boolean = false;
    isNextButton: boolean = false;

    nullValue = null;

    itemDetailFDICircularChapters = { index: -1 };
    indexFDICircularChapter: number = -1;

    itemDetailFDICircularIndexes = { index: -1 };
    indexFDICircularIndex: number = -1;

    indexAmendmentTitle: string;
    indexAmendmentContent: string;

    fDICircularPDFServerPath: string = Global.FDICIRCULAR_PDF_FILEPATH;
    fAQPDFServerPath: string = Global.FAQ_PDF_FILEPATH;
    pressNotePDFServerPath: string = Global.PRESSNOTE_PDF_FILEPATH;
    fDICircularPDFName: string;

    indexAmendments: FDICircularIndexAmendment[];
    _global: Global = new Global();

    dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        this.frmPressNote = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetFDICircularFEMASubModuleDetail();
    }

    constructor(private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private vcr: ViewContainerRef,
        private spinnerService: SpinnerService,
        private modalService: ModalDialogService,
        private _pressNoteOfFEMASubModuleDetailService: PressNoteOfFEMASubModuleDetailUserService,
        private _fDICircularOfFEMASubModuleDetailService: FDICircularOfFEMASubModuleDetailUserService,
        private _fAQUserService: FAQUserService,
        private _rBIFAQOfFEMASubModuleDetailUserService: RBIFAQOfFEMASubModuleDetailUserService,
        public sanitizer: DomSanitizer) { }

    moduleTab: string = "foreigndirectinvestmentpolicycirculars";

    pressNoteYears: DropDown[] = [];
    pressNoteOfFEMASubModuleDetails: PressNoteOfFEMASubModuleDetail[];
    pressNoteYear: string;
    pressNoteServerPath: string = Global.PRESSNOTE_PDF_FILEPATH;

    frmPressNote: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number = 1;
    pageSize: number = Global.USER_PAGE_SIZE;

    sortingPressNoteField: string = "PressNoteDate";
    sortingPressNoteDirection: string = "D";
    popupHeaderTitle: string;

    OnModuleTabClick(moduleTab) {
        this.moduleTab = moduleTab;

        if (moduleTab == 'foreigndirectinvestmentpolicycirculars') {
            this.GetFDICircularFEMASubModuleDetail();
        } else if (moduleTab == 'pressnotes') {
            this.GetPressNoteYear();
        } else if (moduleTab == "dippfaq") {
            this.GetFAQ();
        }
    }

    GetFDICircularFEMASubModuleDetail(): void {
        this.spinnerService.show();

        let getFDICircularRequest = new GetFDICircularRequest();

        this._fDICircularOfFEMASubModuleDetailService.getFDICircular(getFDICircularRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.fDICirculars = data.Response;

                    if (this.fDICirculars.length > 0) {
                        this.fDICirculars.sort((a, b) => b.Year.localeCompare(a.Year));
                        let fdiCircularId = this.fDICirculars.sort()[0].FDICircularId;
                        this.GetFDICircularIndexAmendment(fdiCircularId);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetFDICircularIndexAmendment(fDICircularId): void {
        this.spinnerService.show();

        let getFDICircularIndexAmendmentRequest = new GetFDICircularIndexAmendmentRequest();
        getFDICircularIndexAmendmentRequest.FDICircularId = fDICircularId;

        this._fDICircularOfFEMASubModuleDetailService.getFDICircularIndexAmendment(getFDICircularIndexAmendmentRequest)
            .subscribe(data => {
                //this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.indexAmendments = data.Response;
                    this.fDICircularPDFName = this.fDICirculars.filter(x => x.FDICircularId == fDICircularId)[0].PDF;
                    this.GetFDICircularFAQ(fDICircularId);
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetFDICircularFAQ(fDICircularId): void {
        this.spinnerService.show();

        let getFDICircularFAQRequest = new GetFAQRequest();

        this._fDICircularOfFEMASubModuleDetailService.getFDICircularFAQ(getFDICircularFAQRequest)
            .subscribe(data => {
                //this.spinnerService.hide();

                this.fDICircularRBIFAQs = data.Response.filter(x => x.TopicName == "Foreign Investments in India");
                this.fDICircularDIPPFAQs = data.Response.filter(x => x.TopicName == "DIPP Old FAQ" || x.TopicName == "DIPP New FAQ");

                this.GetFDICircularChapter(fDICircularId);
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetFDICircularChapter(fDICircularId): void {
        this.spinnerService.show();

        let getFDICircularChapterRequest = new GetFDIChapterRequest();
        getFDICircularChapterRequest.FDICircularId = fDICircularId;

        this._fDICircularOfFEMASubModuleDetailService.getFDICircularChapter(getFDICircularChapterRequest)
            .subscribe(data => {
                //this.spinnerService.hide();
                this.fDICircularChapters = data.Response;
                this.GetFDICircularIndex(fDICircularId);
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetFDICircularIndex(fDICircularId): void {
        this.spinnerService.show();

        let getFDICircularIndexRequest = new GetFDICircularIndexRequest();
        getFDICircularIndexRequest.FDICircularId = fDICircularId;

        this._fDICircularOfFEMASubModuleDetailService.getFDICircularIndex(getFDICircularIndexRequest)
            .subscribe(data => {
                //this.spinnerService.hide();
                this.tempFDICircularIndexes = [];
                let t_this = this;

                if (data.Status == Global.API_SUCCESS) {
                    data.Response.forEach(function (index) {
                        //let amendments = t_this.indexAmendments.filter(x => x.FDICircularIndexId == index.FDICircularIndexId && x.FDICircularSubIndexId == null).sort((a, b) => b.PressNoteDate.localeCompare(a.PressNoteDate));
                        let amendments = t_this.indexAmendments.filter(x => x.FDICircularIndexId == index.FDICircularIndexId && x.FDICircularSubIndexId == null);

                        t_this.tempFDICircularIndexes.push({ FDICircularIndexId: index.FDICircularIndexId, IndexNo: index.IndexNo, IndexName: index.IndexName, IndexContent: index.IndexContent, FDIChapterId: index.FDIChapterId, IndexAmendments: amendments });
                    });
                    this.GetFDICircularSubIndex(fDICircularId);
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetFDICircularSubIndex(fDICircularId): void {
        this.spinnerService.show();

        let getFDICircularSubIndexRequest = new GetFDICircularSubIndexRequest();
        getFDICircularSubIndexRequest.FDICircularId = fDICircularId;

        this._fDICircularOfFEMASubModuleDetailService.getFDICircularSubIndex(getFDICircularSubIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.tempFDICircularSubIndexes = [];

                let t_this = this;

                if (data.Status == Global.API_SUCCESS) {
                    data.Response.forEach(function (subIndex) {
                        //let amendments = t_this.indexAmendments.filter(x => x.FDICircularSubIndexId == subIndex.FDICircularSubIndexId).sort((a, b) => b.PressNoteDate.localeCompare(a.PressNoteDate));
                        let amendments = t_this.indexAmendments.filter(x => x.FDICircularSubIndexId == subIndex.FDICircularSubIndexId);

                        t_this.tempFDICircularSubIndexes.push({ FDICircularIndexId: subIndex.FDICircularIndexId, FDICircularSubIndexId: subIndex.FDICircularSubIndexId, SubIndexNo: subIndex.SubIndexNo, SubIndexName: subIndex.SubIndexName, SubIndexContent: subIndex.SubIndexContent, SubIndexAmendments: amendments });
                    });

                    this.GetFDICircularIndexSubIndexContent();
                    this.GetFDICircularIndexAmendmentContent();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUBINDEX_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetFDICircularIndexSubIndexContent() {
        this.fDICircularIndexSubIndexContents = [];
        let t_this = this;
        let counter = 0;

        this.tempFDICircularIndexes.forEach(function (index) {
            counter++;
            t_this.fDICircularIndexSubIndexContents.push({ FDICircularIndexId: index.FDICircularIndexId, FDICircularSubIndexId: null, Content: index.IndexContent, IndexSubIndexCounter: counter });

            t_this.tempFDICircularSubIndexes.forEach(function (subIndex) {
                if (index.FDICircularIndexId == subIndex.FDICircularIndexId) {
                    counter++;
                    t_this.fDICircularIndexSubIndexContents.push({ FDICircularIndexId: index.FDICircularIndexId, FDICircularSubIndexId: subIndex.FDICircularSubIndexId, Content: subIndex.SubIndexContent, IndexSubIndexCounter: counter });
                }
            });
        });
    }

    GetFDICircularIndexAmendmentContent() {
        this.fDICircularIndexAmendmentContents = [];
        let t_this = this;
        let counter = 0;

        this.tempFDICircularIndexes.forEach(function (index) {
            t_this.indexAmendments.filter(x => x.FDICircularIndexId == index.FDICircularIndexId && x.FDICircularSubIndexId == null).forEach(function (item) {
                counter++;
                t_this.fDICircularIndexAmendmentContents.push({ FDICircularIndexId: item.FDICircularIndexId, FDICircularSubIndexId: item.FDICircularSubIndexId, FDICircularIndexAmendmentId: item.FDICircularIndexAmendmentId, Content: item.IndexAmendmentContent, IndexAmendmentCounter: counter });
            });

            t_this.tempFDICircularSubIndexes.forEach(function (subIndex) {
                if (index.FDICircularIndexId == subIndex.FDICircularIndexId) {
                    t_this.indexAmendments.filter(x => x.FDICircularIndexId == index.FDICircularIndexId && x.FDICircularSubIndexId == subIndex.FDICircularSubIndexId).forEach(function (item) {
                        counter++;
                        t_this.fDICircularIndexAmendmentContents.push({ FDICircularIndexId: item.FDICircularIndexId, FDICircularSubIndexId: item.FDICircularSubIndexId, FDICircularIndexAmendmentId: item.FDICircularIndexAmendmentId, Content: item.IndexAmendmentContent, IndexAmendmentCounter: counter });
                    });
                }
            });
        });
    }

    GetFAQ() {
        this.spinnerService.show();

        let getFAQRequest = new GetFAQRequest();

        this._fAQUserService.getFAQ(getFAQRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.dIPPFAQ = data.Response.filter(x => x.CategoryName == "DIPP FAQs");

                if (this.dIPPFAQ.length > 0)
                    this.OnChangeDIPPFAQ(this.dIPPFAQ[0].FAQId);

            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FAQ_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    OnChangeDIPPFAQ(fAQId) {
        let dIPPFAQDetail = this.dIPPFAQ.filter(el => el.FAQId == fAQId)[0];
        this.dIPPFAQPDFUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this._global.getPDFPath(this.fAQPDFServerPath + dIPPFAQDetail.PDF));

        let interval = setInterval(function () {
            let minusHeight = (document.querySelector('body').clientWidth > 766) ? 170 : (document.querySelector('body').clientWidth > 480) ? 255 : 220;

            document.getElementById("iframe").style.height = (document.querySelector('.modal-body').clientHeight - minusHeight) + "px";
            clearInterval(interval);
        }, 100);
    }

    UpDownFDICircularChapterArrow(index) {
        this.itemDetailFDICircularIndexes.index = -1;

        if (index === this.itemDetailFDICircularChapters.index) {
            this.itemDetailFDICircularChapters.index = null;
        } else {
            this.itemDetailFDICircularChapters.index = index;
        }
    }

    UpDownFDICircularIndexArrow(index) {
        if (index === this.itemDetailFDICircularIndexes.index) {
            this.itemDetailFDICircularIndexes.index = null;
        } else {
            this.itemDetailFDICircularIndexes.index = index;
        }
    }

    ShowFDICircularIndex(index, fDICircularChapterId) {
        this.indexFDICircularChapter = -1;
        this.indexFDICircularIndex = -1;

        if (this.itemDetailFDICircularChapters.index !== index) {
            if (fDICircularChapterId) {
                this.indexFDICircularChapter = index;
                this.fDICircularIndexes = this.tempFDICircularIndexes.filter(x => x.FDIChapterId == fDICircularChapterId);

                if (this.tempFDICircularIndexes.filter(x => x.FDIChapterId == fDICircularChapterId).length > 0)
                    this.UpDownFDICircularChapterArrow(index);
                else
                    this.itemDetailFDICircularChapters.index = null;
            }
        }
        else {
            this.UpDownFDICircularChapterArrow(index);
        }
    }

    ShowFDICircularSubIndex(index, indexId) {
        this.indexFDICircularIndex = -1;

        if (this.itemDetailFDICircularIndexes.index !== index) {
            if (indexId) {
                this.indexFDICircularIndex = index;
                this.fDICircularSubIndexes = this.tempFDICircularSubIndexes.filter(x => x.FDICircularIndexId == indexId);

                if (this.tempFDICircularSubIndexes.filter(x => x.FDICircularIndexId == indexId).length > 0)
                    this.UpDownFDICircularIndexArrow(index);
                else
                    this.itemDetailFDICircularIndexes.index = null;
            }
        }
        else {
            this.UpDownFDICircularIndexArrow(index);
        }
    }

    ShowContent(indexId: number, subIndexId: number, indexAmendmentId: number, indexSubIndexAndIndexAmendmentPopup) {
        this.popupHeaderTitle = (indexAmendmentId && this.indexAmendments.filter(x => x.FDICircularIndexAmendmentId == indexAmendmentId)[0].FDICircularIndexId && this.indexAmendments.filter(x => x.FDICircularIndexAmendmentId == indexAmendmentId)[0].FDICircularSubIndexId) ? Global.POPUP_SUBINDEX_AMENDMENT_HEADER_TITLE :
            (indexAmendmentId && this.indexAmendments.filter(x => x.FDICircularIndexAmendmentId == indexAmendmentId)[0].FDICircularIndexId) ? Global.POPUP_INDEX_AMENDMENT_HEADER_TITLE :
                (indexId && subIndexId) ? Global.POPUP_SUBINDEX_HEADER_TITLE :
                    (indexId) ? Global.POPUP_INDEX_HEADER_TITLE : '';

        this.indexAmendmentContent = "";

        if (this.moduleTab == "foreigndirectinvestmentpolicycirculars") {
            this.fDICircularIndexSubIndexPopup = indexSubIndexAndIndexAmendmentPopup;

            if (this.fDICircularIndexSubIndexPopup == "indexSubIndex") {
                this.indexSubIndexCounter = this.fDICircularIndexSubIndexContents.filter(x => x.FDICircularIndexId == indexId && x.FDICircularSubIndexId == subIndexId)[0].IndexSubIndexCounter;
                this.indexAmendmentContent = this.fDICircularIndexSubIndexContents.filter(x => x.FDICircularIndexId == indexId && x.FDICircularSubIndexId == subIndexId)[0].Content;
                this.isNextButton = (this.indexSubIndexCounter != this.fDICircularIndexSubIndexContents.length) ? true : false;
                this.isPreviousButton = (this.indexSubIndexCounter != 1) ? true : false;
            } else {
                this.indexAmendmentCounter = this.fDICircularIndexAmendmentContents.filter(x => x.FDICircularIndexAmendmentId == indexAmendmentId)[0].IndexAmendmentCounter;
                this.indexAmendmentContent = this.fDICircularIndexAmendmentContents.filter(x => x.FDICircularIndexAmendmentId == indexAmendmentId)[0].Content;
                this.isNextButton = (this.indexAmendmentCounter != this.fDICircularIndexAmendmentContents.length) ? true : false;
                this.isPreviousButton = (this.indexAmendmentCounter != 1) ? true : false;
            }
        }
    }

    PreviousContent() {
        this.indexAmendmentContent = "";

        if (this.moduleTab == "foreigndirectinvestmentpolicycirculars") {
            if (this.fDICircularIndexSubIndexPopup == "indexSubIndex") {
                this.indexSubIndexCounter--;

                let indexId = this.fDICircularIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.indexSubIndexCounter)[0].FDICircularIndexId;
                let subIndexId = this.fDICircularIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.indexSubIndexCounter)[0].FDICircularSubIndexId;

                this.popupHeaderTitle = (indexId && subIndexId) ? Global.POPUP_SUBINDEX_HEADER_TITLE : (indexId) ? Global.POPUP_INDEX_HEADER_TITLE : '';

                this.indexAmendmentContent = this.fDICircularIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.indexSubIndexCounter)[0].Content;
                this.isNextButton = (this.indexSubIndexCounter != this.fDICircularIndexSubIndexContents.length) ? true : false;
                this.isPreviousButton = (this.indexSubIndexCounter != 1) ? true : false;;
            } else {
                this.indexAmendmentCounter--;

                let indexId = this.fDICircularIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.indexAmendmentCounter)[0].FDICircularIndexId;
                let subIndexId = this.fDICircularIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.indexAmendmentCounter)[0].FDICircularSubIndexId;

                this.popupHeaderTitle = (indexId && subIndexId) ? Global.POPUP_SUBINDEX_AMENDMENT_HEADER_TITLE : (indexId) ? Global.POPUP_INDEX_AMENDMENT_HEADER_TITLE : '';

                this.indexAmendmentContent = this.fDICircularIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.indexAmendmentCounter)[0].Content;
                this.isNextButton = (this.indexAmendmentCounter != this.fDICircularIndexAmendmentContents.length) ? true : false;
                this.isPreviousButton = (this.indexAmendmentCounter != 1) ? true : false;
            }
        }
    }

    NextContent() {
        this.indexAmendmentContent = "";

        if (this.moduleTab == "foreigndirectinvestmentpolicycirculars") {
            if (this.fDICircularIndexSubIndexPopup == "indexSubIndex") {
                this.indexSubIndexCounter++;

                let indexId = this.fDICircularIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.indexSubIndexCounter)[0].FDICircularIndexId;
                let subIndexId = this.fDICircularIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.indexSubIndexCounter)[0].FDICircularSubIndexId;

                this.popupHeaderTitle = (indexId && subIndexId) ? Global.POPUP_SUBINDEX_HEADER_TITLE : (indexId) ? Global.POPUP_INDEX_HEADER_TITLE : '';

                this.indexAmendmentContent = this.fDICircularIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.indexSubIndexCounter)[0].Content;
                this.isNextButton = (this.indexSubIndexCounter != this.fDICircularIndexSubIndexContents.length) ? true : false;
                this.isPreviousButton = (this.indexSubIndexCounter != 1) ? true : false;
            } else {
                this.indexAmendmentCounter++;

                let indexId = this.fDICircularIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.indexAmendmentCounter)[0].FDICircularIndexId;
                let subIndexId = this.fDICircularIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.indexAmendmentCounter)[0].FDICircularSubIndexId;

                this.popupHeaderTitle = (indexId && subIndexId) ? Global.POPUP_SUBINDEX_AMENDMENT_HEADER_TITLE : (indexId) ? Global.POPUP_INDEX_AMENDMENT_HEADER_TITLE : '';

                this.indexAmendmentContent = this.fDICircularIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.indexAmendmentCounter)[0].Content;
                this.isNextButton = (this.indexAmendmentCounter != this.fDICircularIndexAmendmentContents.length) ? true : false;
                this.isPreviousButton = (this.indexAmendmentCounter != 1) ? true : false;
            }
        }
    }

    OnFDICircularChange(fDICircularId) {
        this.indexFDICircularChapter = -1;
        this.indexFDICircularIndex = -1;
        this.itemDetailFDICircularChapters.index = this.indexFDICircularChapter;
        this.itemDetailFDICircularIndexes.index = this.indexFDICircularIndex;

        this.GetFDICircularIndexAmendment(fDICircularId);
    }

    GetPressNoteOfFEMASubModuleDetail(year: string, searchText?: string, pageNumber?: number): void {
        this.spinnerService.show();

        let getPressNoteOfFEMASubModuleDetailRequest = new GetPressNoteOfFEMASubModuleDetailRequest();
        getPressNoteOfFEMASubModuleDetailRequest.Year = year;
        getPressNoteOfFEMASubModuleDetailRequest.SearchText = searchText;
        getPressNoteOfFEMASubModuleDetailRequest.IsActive = null;
        getPressNoteOfFEMASubModuleDetailRequest.OrderBy = this.sortingPressNoteField;
        getPressNoteOfFEMASubModuleDetailRequest.OrderByDirection = this.sortingPressNoteDirection;
        getPressNoteOfFEMASubModuleDetailRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getPressNoteOfFEMASubModuleDetailRequest.PageSize = this.pageSize;

        this._pressNoteOfFEMASubModuleDetailService.getPressNoteOfFEMASubModuleDetail(getPressNoteOfFEMASubModuleDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.pressNoteYear = year;
                    this.pressNoteOfFEMASubModuleDetails = data.Response;

                    this.pageSize = getPressNoteOfFEMASubModuleDetailRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetPressNoteYear(): void {
        this.spinnerService.show();

        this._pressNoteOfFEMASubModuleDetailService.getPressNoteYears()
            .subscribe(data => {
                //this.spinnerService.hide();
                this.pressNoteYears = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.pressNoteYears.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.pressNoteYears.push({ Value: item, Text: item });
                    });

                    this.GetPressNoteOfFEMASubModuleDetail("", this.searchText, this.currentPage);
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    OnPressNoteYearChange(year) {
        this.currentPage = 1;
        this.pressNoteYear = year;
        this.GetPressNoteOfFEMASubModuleDetail(year, this.searchText, this.currentPage);
    }

    SearchPressNote(formData) {
        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.GetPressNoteOfFEMASubModuleDetail(this.pressNoteYear, this.searchText, this.currentPage);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetPressNoteOfFEMASubModuleDetail(this.pressNoteYear, this.searchText, pageNumber);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.GetPressNoteOfFEMASubModuleDetail(this.pressNoteYear, this.searchText, null);
    }

    OnPressNoteSort(fieldName) {
        this.sortingPressNoteDirection = (this.sortingPressNoteField == fieldName) ? (this.sortingPressNoteDirection == "A") ? "D" : "A" : "A";
        this.sortingPressNoteField = fieldName;
        this.GetPressNoteOfFEMASubModuleDetail(this.pressNoteYear, this.searchText, this.currentPage);
    }

    OnGridViewIndexAmendmentTabClick(gridviewIndexAmendmentTab) {
        this.gridviewIndexAmendmentTab = gridviewIndexAmendmentTab;
    }
}
