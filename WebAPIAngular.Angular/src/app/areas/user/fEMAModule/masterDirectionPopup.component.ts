import { Component, ComponentRef, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { MasterCircular } from '../../../model/masterCircular';
import { MasterCircularOfFEMASubModuleDetail, GetMasterCircularOfFEMASubModuleDetailRequest } from '../../../model/masterCircularOfFEMASubModuleDetail';
import { MasterCircularDetail, GetMasterCircularDetailRequest } from '../../../model/masterCircularDetail';
import { APDIRCircularOfFEMASubModuleDetail, GetAPDIRCircularOfFEMASubModuleDetailRequest } from '../../../model/aPDIRCircularOfFEMASubModuleDetail';

import { MasterCircularOfFEMASubModuleDetailUserService } from '../../../service/user/masterCircularOfFEMASubModuleDetail.service';
import { APDIRCircularOfFEMASubModuleDetailUserService } from '../../../service/user/aPDIRCircularOfFEMASubModuleDetail.service';

import { MasterDirectionOfFEMASubModuleDetail, GetMasterDirectionOfFEMASubModuleDetailRequest } from '../../../model/masterDirectionOfFEMASubModuleDetail';
import { MasterDirectionFAQ, GetMasterDirectionFAQRequest } from '../../../model/masterDirectionFAQ';
import { MasterDirectionChapter, GetMasterDirectionChapterRequest } from '../../../model/masterDirectionChapter';
import { MasterDirectionIndex, GetMasterDirectionIndexRequest } from '../../../model/masterDirectionIndex';
import { MasterDirectionSubIndex, GetMasterDirectionSubIndexRequest } from '../../../model/masterDirectionSubIndex';
import { MasterDirectionIndexAmendment, GetMasterDirectionIndexAmendmentRequest } from '../../../model/masterDirectionIndexAmendment';

import { MasterDirectionOfFEMASubModuleDetailUserService } from '../../../service/user/masterDirectionOfFEMASubModuleDetail.service';

import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { DropDown } from '../../../common/dropDown';

import { FAQ, GetFAQRequest } from '../../../model/fAQ';
import { RBIFAQOfFEMASubModuleDetail, GetRBIFAQOfFEMASubModuleDetailRequest } from '../../../model/rBIFAQOfFEMASubModuleDetail';

import { FAQUserService } from '../../../service/user/fAQ.service';
import { RBIFAQOfFEMASubModuleDetailUserService } from '../../../service/user/rBIFAQOfFEMASubModuleDetail.service';

import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';

@Component({
    selector: 'my-app',
    templateUrl: './masterDirectionPopup.component.html'
})

export class MasterDirectionPopupUserComponent {

    fEMASubModuleOfModuleId: number;

    masterCircularId: any;

    masterCircularOfFEMASubModuleDetail: MasterCircularOfFEMASubModuleDetail[];
    masterCircularDetailYears: DropDown[] = [];
    masterCircularYear: string;

    masterCircularDetails: MasterCircularDetail[] = [];
    masterCircularDetailPDFUrl: any;

    aPDIRCircularYears: DropDown[] = [];
    aPDIRCircularOfFEMASubModuleDetails: APDIRCircularOfFEMASubModuleDetail[];
    aPDIRCircularYear: string;

    rBIFAQ: RBIFAQOfFEMASubModuleDetail[] = [];
    rBIFAQPDFUrl: any;

    frmAPDIRCircular: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number = 1;
    pageSize: number = Global.USER_PAGE_SIZE;

    sortingAPDIRCircularField: string = "APDIRCircularDate";
    sortingAPDIRCircularDirection: string = "D";
    popupHeaderTitle: string;

    masterCircularDetailPDFServerPath: string = Global.MASTERCIRCULAR_PDF_FILEPATH;
    aPDIRCircularServerPath: string = Global.APDIRCIRCULAR_PDF_FILEPATH;
    notificationServerPath: string = Global.NOTIFICATION_PDF_FILEPATH;

    isAllChapter: boolean;

    masterDirectionOfFEMASubModuleDetails: MasterDirectionOfFEMASubModuleDetail[];
    masterDirectionFAQs: any = [];
    masterDirectionChapters: any = [];
    masterDirectionIndexes: any = [];
    masterDirectionSubIndexes: any = [];
    tempMasterDirectionIndexes: any = [];
    tempMasterDirectionSubIndexes: any = [];
    masterDirectionIndexSubIndexAndAmendments: any = [];
    masterDirectionIndexSubIndexPopup: string;

    masterDirectionIndexSubIndexContents: any = [];
    masterDirectionIndexAmendmentContents: any = [];
    indexSubIndexCounter: number;
    indexAmendmentCounter: number;

    isPreviousButton: boolean = false;
    isNextButton: boolean = false;

    nullValue = null;

    itemDetailMasterDirectionChapters = { index: -1 };
    indexMasterDirectionChapter: number = -1;

    itemDetailMasterDirectionIndexes = { index: -1 };
    indexMasterDirectionIndex: number = -1;

    indexAmendmentTitle: string;
    indexAmendmentContent: string;

    masterDirectionPDFServerPath: string = Global.MASTERDIRECTION_PDF_FILEPATH;
    fAQPDFServerPath: string = Global.FAQ_PDF_FILEPATH;
    masterDirectionPDFName: string;

    _global: Global = new Global();

    indexAmendments: MasterDirectionIndexAmendment[];

    dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        this.fEMASubModuleOfModuleId = options.data;

        this.frmAPDIRCircular = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetMasterDirectionFEMASubModuleDetail();
    }

    constructor(private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private vcr: ViewContainerRef,
        private spinnerService: SpinnerService,
        private modalService: ModalDialogService,
        private _masterCircularOfFEMASubModuleDetailUserService: MasterCircularOfFEMASubModuleDetailUserService,
        private _aPDIRCircularOfFEMASubModuleDetailService: APDIRCircularOfFEMASubModuleDetailUserService,
        private _masterDirectionOfFEMASubModuleDetailService: MasterDirectionOfFEMASubModuleDetailUserService,
        private _fAQUserService: FAQUserService,
        private _rBIFAQOfFEMASubModuleDetailUserService: RBIFAQOfFEMASubModuleDetailUserService,
        public sanitizer: DomSanitizer) { }

    moduleTab: string = "masterdirection";

    OnModuleTabClick(moduleTab) {
        this.moduleTab = moduleTab;

        if (moduleTab == 'masterdirection') {
            this.GetMasterDirectionFEMASubModuleDetail();
        } else if (moduleTab == 'mastercircular') {
            this.GetMasterCircularOfFEMASubModuleDetail();
        } else if (moduleTab == 'apdircircular') {
            this.GetAPDIRCircularYear();
        } else if (moduleTab == "rbifaq") {
            this.GetRBIFAQ(this.fEMASubModuleOfModuleId);
        }
    }

    GetMasterDirectionFEMASubModuleDetail(): void {
        this.spinnerService.show();

        let getMasterDirectionOfFEMASubModuleDetailRequest = new GetMasterDirectionOfFEMASubModuleDetailRequest();
        getMasterDirectionOfFEMASubModuleDetailRequest.FEMASubModuleOfModuleId = this.fEMASubModuleOfModuleId;

        this._masterDirectionOfFEMASubModuleDetailService.getMasterDirectionOfFEMASubModuleDetail(getMasterDirectionOfFEMASubModuleDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.masterDirectionOfFEMASubModuleDetails = data.Response;

                    if (this.masterDirectionOfFEMASubModuleDetails.length > 0) {
                        this.GetMasterDirectionIndexAmendment(data.Response[0].MasterDirectionId);
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

    GetMasterDirectionIndexAmendment(masterDirectionId): void {
        this.spinnerService.show();

        let getMasterDirectionIndexAmendmentRequest = new GetMasterDirectionIndexAmendmentRequest();
        getMasterDirectionIndexAmendmentRequest.MasterDirectionId = masterDirectionId;

        this._masterDirectionOfFEMASubModuleDetailService.getMasterDirectionIndexAmendment(getMasterDirectionIndexAmendmentRequest)
            .subscribe(data => {
                //this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.indexAmendments = data.Response;
                    this.masterDirectionPDFName = this.masterDirectionOfFEMASubModuleDetails.filter(x => x.MasterDirectionId == masterDirectionId)[0].PDF;
                    this.GetMasterDirectionFAQ(masterDirectionId);
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetMasterDirectionFAQ(masterDirectionId): void {
        this.spinnerService.show();

        let getMasterDirectionFAQRequest = new GetMasterDirectionFAQRequest();
        getMasterDirectionFAQRequest.MasterDirectionId = masterDirectionId;

        this._masterDirectionOfFEMASubModuleDetailService.getMasterDirectionFAQ(getMasterDirectionFAQRequest)
            .subscribe(data => {
                //this.spinnerService.hide();
                this.masterDirectionFAQs = data.Response;
                this.GetMasterDirectionChapter(masterDirectionId);
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetMasterDirectionChapter(masterDirectionId): void {
        this.isAllChapter = false;
        this.spinnerService.show();

        let getMasterDirectionChapterRequest = new GetMasterDirectionChapterRequest();
        getMasterDirectionChapterRequest.MasterDirectionId = masterDirectionId;

        this._masterDirectionOfFEMASubModuleDetailService.getMasterDirectionChapter(getMasterDirectionChapterRequest)
            .subscribe(data => {
                //this.spinnerService.hide();
                this.masterDirectionChapters = data.Response;

                if (this.masterDirectionChapters[0].Chapter.toLowerCase() == Global.MASTER_DIRECTION_ALL_CHAPTER)
                    this.isAllChapter = true;

                this.GetMasterDirectionIndex(masterDirectionId);
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetMasterDirectionIndex(masterDirectionId): void {
        this.spinnerService.show();

        let getMasterDirectionIndexRequest = new GetMasterDirectionIndexRequest();
        getMasterDirectionIndexRequest.MasterDirectionId = masterDirectionId;

        this._masterDirectionOfFEMASubModuleDetailService.getMasterDirectionIndex(getMasterDirectionIndexRequest)
            .subscribe(data => {
                //this.spinnerService.hide();
                this.tempMasterDirectionIndexes = [];
                let t_this = this;

                if (data.Status == Global.API_SUCCESS) {
                    let allChapter = t_this.masterDirectionChapters.filter(x => x.Chapter.toLowerCase() == Global.MASTER_DIRECTION_ALL_CHAPTER)[0];

                    data.Response.forEach(function (index) {
                        //let amendments = t_this.indexAmendments.filter(x => x.MasterDirectionIndexId == index.MasterDirectionIndexId && x.MasterDirectionSubIndexId == null).sort((a, b) => (b.APDIRCircularDate) ? b.APDIRCircularDate.localeCompare(a.APDIRCircularDate) : null).sort((a, b) => (b.NotificationDate) ? b.NotificationDate.localeCompare(a.NotificationDate) : null);
                        let amendments = t_this.indexAmendments.filter(x => x.MasterDirectionIndexId == index.MasterDirectionIndexId && x.MasterDirectionSubIndexId == null);

                        t_this.tempMasterDirectionIndexes.push({ MasterDirectionIndexId: index.MasterDirectionIndexId, IndexNo: index.IndexNo, IndexName: index.IndexName, IndexContent: index.IndexContent, MasterDirectionChapterId: index.MasterDirectionChapterId, APDIRCircularNo: index.APDIRCircularNo, APDIRCircularDate: index.APDIRCircularDate, APDIRCircularPDF: index.APDIRCircularPDF, NotificationNumber: index.NotificationNumber, NotificationDate: index.NotificationDate, NotificationPDF: index.NotificationPDF, IndexAmendments: amendments });
                    });

                    if (allChapter) {
                        t_this.ShowMasterDirectionIndex(0, allChapter.MasterDirectionChapterId);
                    }
                    this.GetMasterDirectionSubIndex(masterDirectionId);
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetMasterDirectionSubIndex(masterDirectionId): void {
        this.spinnerService.show();

        let getMasterDirectionSubIndexRequest = new GetMasterDirectionSubIndexRequest();
        getMasterDirectionSubIndexRequest.MasterDirectionId = masterDirectionId;

        this._masterDirectionOfFEMASubModuleDetailService.getMasterDirectionSubIndex(getMasterDirectionSubIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.tempMasterDirectionSubIndexes = [];

                let t_this = this;

                if (data.Status == Global.API_SUCCESS) {
                    data.Response.forEach(function (subIndex) {
                        //let amendments = t_this.indexAmendments.filter(x => x.MasterDirectionSubIndexId == subIndex.MasterDirectionSubIndexId).sort((a, b) => (b.APDIRCircularDate) ? b.APDIRCircularDate.localeCompare(a.APDIRCircularDate) : null).sort((a, b) => (b.NotificationDate) ? b.NotificationDate.localeCompare(a.NotificationDate) : null);
                        let amendments = t_this.indexAmendments.filter(x => x.MasterDirectionSubIndexId == subIndex.MasterDirectionSubIndexId);

                        t_this.tempMasterDirectionSubIndexes.push({ MasterDirectionIndexId: subIndex.MasterDirectionIndexId, MasterDirectionSubIndexId: subIndex.MasterDirectionSubIndexId, SubIndexNo: subIndex.SubIndexNo, SubIndexName: subIndex.SubIndexName, APDIRCircularNo: subIndex.APDIRCircularNo, APDIRCircularDate: subIndex.APDIRCircularDate, APDIRCircularPDF: subIndex.APDIRCircularPDF, NotificationNumber: subIndex.NotificationNumber, NotificationDate: subIndex.NotificationDate, NotificationPDF: subIndex.NotificationPDF, SubIndexContent: subIndex.SubIndexContent, SubIndexAmendments: amendments });
                    });

                    this.GetMasterDirectionIndexSubIndexContent();
                    this.GetMasterDirectionIndexAmendmentContent();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUBINDEX_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetMasterDirectionIndexSubIndexContent() {
        this.masterDirectionIndexSubIndexContents = [];
        let t_this = this;
        let counter = 0;

        this.tempMasterDirectionIndexes.forEach(function (index) {
            counter++;
            t_this.masterDirectionIndexSubIndexContents.push({ MasterDirectionIndexId: index.MasterDirectionIndexId, MasterDirectionSubIndexId: null, Content: index.IndexContent, IndexSubIndexCounter: counter });

            t_this.tempMasterDirectionSubIndexes.forEach(function (subIndex) {
                if (index.MasterDirectionIndexId == subIndex.MasterDirectionIndexId) {
                    counter++;
                    t_this.masterDirectionIndexSubIndexContents.push({ MasterDirectionIndexId: index.MasterDirectionIndexId, MasterDirectionSubIndexId: subIndex.MasterDirectionSubIndexId, Content: subIndex.SubIndexContent, IndexSubIndexCounter: counter });
                }
            });
        });
    }

    GetMasterDirectionIndexAmendmentContent() {
        this.masterDirectionIndexAmendmentContents = [];
        let t_this = this;
        let counter = 0;

        this.tempMasterDirectionIndexes.forEach(function (index) {
            t_this.indexAmendments.filter(x => x.MasterDirectionIndexId == index.MasterDirectionIndexId && x.MasterDirectionSubIndexId == null).forEach(function (item) {
                counter++;
                t_this.masterDirectionIndexAmendmentContents.push({ MasterDirectionIndexId: item.MasterDirectionIndexId, MasterDirectionSubIndexId: item.MasterDirectionSubIndexId, MasterDirectionIndexAmendmentId: item.MasterDirectionIndexAmendmentId, Content: item.IndexAmendmentContent, IndexAmendmentCounter: counter });
            });

            t_this.tempMasterDirectionSubIndexes.forEach(function (subIndex) {
                if (index.MasterDirectionIndexId == subIndex.MasterDirectionIndexId) {
                    t_this.indexAmendments.filter(x => x.MasterDirectionIndexId == index.MasterDirectionIndexId && x.MasterDirectionSubIndexId == subIndex.MasterDirectionSubIndexId).forEach(function (item) {
                        counter++;
                        t_this.masterDirectionIndexAmendmentContents.push({ MasterDirectionIndexId: item.MasterDirectionIndexId, MasterDirectionSubIndexId: item.MasterDirectionSubIndexId, MasterDirectionIndexAmendmentId: item.MasterDirectionIndexAmendmentId, Content: item.IndexAmendmentContent, IndexAmendmentCounter: counter });
                    });
                }
            });
        });
    }

    GetRBIFAQ(fEMAModuleId: number) {
        this.spinnerService.show();

        let getRBIFAQOfFEMASubModuleDetailRequest = new GetRBIFAQOfFEMASubModuleDetailRequest();
        getRBIFAQOfFEMASubModuleDetailRequest.FEMASubModuleOfModuleId = fEMAModuleId;

        this._rBIFAQOfFEMASubModuleDetailUserService.getRBIFAQOfFEMASubModuleDetail(getRBIFAQOfFEMASubModuleDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.rBIFAQ = data.Response;

                    if (this.rBIFAQ.length > 0)
                        this.OnChangeRBIFAQ(this.rBIFAQ[0].FAQId);
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FAQ_TITLE, { enableHtml: true, closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FAQ_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    OnChangeRBIFAQ(fAQId) {
        let rBIFAQDetail = this.rBIFAQ.filter(el => el.FAQId == fAQId)[0];
        this.rBIFAQPDFUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this._global.getPDFPath(this.fAQPDFServerPath + rBIFAQDetail.PDF));
        
        let interval = setInterval(function () {
            let minusHeight = (document.querySelector('body').clientWidth > 766) ? 170 : (document.querySelector('body').clientWidth > 480) ? 295 : 260;

            document.getElementById("iframe2").style.height = (document.querySelector('.modal-body').clientHeight - minusHeight) + "px";
            clearInterval(interval);
        }, 100);
    }

    UpDownMasterDirectionChapterArrow(index) {
        this.itemDetailMasterDirectionIndexes.index = -1;

        if (index === this.itemDetailMasterDirectionChapters.index) {
            this.itemDetailMasterDirectionChapters.index = null;
        } else {
            this.itemDetailMasterDirectionChapters.index = index;
        }
    }

    UpDownMasterDirectionIndexArrow(index) {
        if (index === this.itemDetailMasterDirectionIndexes.index) {
            this.itemDetailMasterDirectionIndexes.index = null;
        } else {
            this.itemDetailMasterDirectionIndexes.index = index;
        }
    }

    ShowMasterDirectionIndex(index, masterDirectionChapterId) {
        this.indexMasterDirectionChapter = -1;
        this.indexMasterDirectionIndex = -1;

        if (this.itemDetailMasterDirectionChapters.index !== index) {
            if (masterDirectionChapterId) {
                this.indexMasterDirectionChapter = index;
                this.masterDirectionIndexes = this.tempMasterDirectionIndexes.filter(x => x.MasterDirectionChapterId == masterDirectionChapterId);

                if (this.tempMasterDirectionIndexes.filter(x => x.MasterDirectionChapterId == masterDirectionChapterId).length > 0)
                    this.UpDownMasterDirectionChapterArrow(index);
                else
                    this.itemDetailMasterDirectionChapters.index = null;
            }
        }
        else {
            this.UpDownMasterDirectionChapterArrow(index);
        }
    }

    ShowMasterDirectionSubIndex(index, indexId) {
        this.indexMasterDirectionIndex = -1;

        if (this.itemDetailMasterDirectionIndexes.index !== index) {
            if (indexId) {
                this.indexMasterDirectionIndex = index;
                this.masterDirectionSubIndexes = this.tempMasterDirectionSubIndexes.filter(x => x.MasterDirectionIndexId == indexId);

                if (this.tempMasterDirectionSubIndexes.filter(x => x.MasterDirectionIndexId == indexId).length > 0)
                    this.UpDownMasterDirectionIndexArrow(index);
                else
                    this.itemDetailMasterDirectionIndexes.index = null;
            }
        }
        else {
            this.UpDownMasterDirectionIndexArrow(index);
        }
    }

    ShowContent(indexId: number, subIndexId: number, indexAmendmentId: number, indexSubIndexAndIndexAmendmentPopup) {
        this.popupHeaderTitle = (indexAmendmentId && this.indexAmendments.filter(x => x.MasterDirectionIndexAmendmentId == indexAmendmentId)[0].MasterDirectionIndexId && this.indexAmendments.filter(x => x.MasterDirectionIndexAmendmentId == indexAmendmentId)[0].MasterDirectionSubIndexId) ? Global.POPUP_SUBINDEX_AMENDMENT_HEADER_TITLE :
            (indexAmendmentId && this.indexAmendments.filter(x => x.MasterDirectionIndexAmendmentId == indexAmendmentId)[0].MasterDirectionIndexId) ? Global.POPUP_INDEX_AMENDMENT_HEADER_TITLE :
                (indexId && subIndexId) ? Global.POPUP_SUBINDEX_HEADER_TITLE :
                    (indexId) ? Global.POPUP_INDEX_HEADER_TITLE : '';

        this.indexAmendmentContent = "";

        if (this.moduleTab == "masterdirection") {
            this.masterDirectionIndexSubIndexPopup = indexSubIndexAndIndexAmendmentPopup;

            if (this.masterDirectionIndexSubIndexPopup == "indexSubIndex") {
                this.indexSubIndexCounter = this.masterDirectionIndexSubIndexContents.filter(x => x.MasterDirectionIndexId == indexId && x.MasterDirectionSubIndexId == subIndexId)[0].IndexSubIndexCounter;
                this.indexAmendmentContent = this.masterDirectionIndexSubIndexContents.filter(x => x.MasterDirectionIndexId == indexId && x.MasterDirectionSubIndexId == subIndexId)[0].Content;
                this.isNextButton = (this.indexSubIndexCounter != this.masterDirectionIndexSubIndexContents.length) ? true : false;
                this.isPreviousButton = (this.indexSubIndexCounter != 1) ? true : false;
            } else {
                this.indexAmendmentCounter = this.masterDirectionIndexAmendmentContents.filter(x => x.MasterDirectionIndexAmendmentId == indexAmendmentId)[0].IndexAmendmentCounter;
                this.indexAmendmentContent = this.masterDirectionIndexAmendmentContents.filter(x => x.MasterDirectionIndexAmendmentId == indexAmendmentId)[0].Content;
                this.isNextButton = (this.indexAmendmentCounter != this.masterDirectionIndexAmendmentContents.length) ? true : false;
                this.isPreviousButton = (this.indexAmendmentCounter != 1) ? true : false;
            }
        }
    }

    PreviousContent() {
        this.indexAmendmentContent = "";

        if (this.moduleTab == "masterdirection") {
            if (this.masterDirectionIndexSubIndexPopup == "indexSubIndex") {
                this.indexSubIndexCounter--;

                let indexId = this.masterDirectionIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.indexSubIndexCounter)[0].MasterDirectionIndexId;
                let subIndexId = this.masterDirectionIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.indexSubIndexCounter)[0].MasterDirectionSubIndexId;

                this.popupHeaderTitle = (indexId && subIndexId) ? Global.POPUP_SUBINDEX_HEADER_TITLE : (indexId) ? Global.POPUP_INDEX_HEADER_TITLE : '';

                this.indexAmendmentContent = this.masterDirectionIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.indexSubIndexCounter)[0].Content;
                this.isNextButton = (this.indexSubIndexCounter != this.masterDirectionIndexSubIndexContents.length) ? true : false;
                this.isPreviousButton = (this.indexSubIndexCounter != 1) ? true : false;;
            } else {
                this.indexAmendmentCounter--;

                let indexId = this.masterDirectionIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.indexAmendmentCounter)[0].MasterDirectionIndexId;
                let subIndexId = this.masterDirectionIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.indexAmendmentCounter)[0].MasterDirectionSubIndexId;

                this.popupHeaderTitle = (indexId && subIndexId) ? Global.POPUP_SUBINDEX_AMENDMENT_HEADER_TITLE : (indexId) ? Global.POPUP_INDEX_AMENDMENT_HEADER_TITLE : '';

                this.indexAmendmentContent = this.masterDirectionIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.indexAmendmentCounter)[0].Content;
                this.isNextButton = (this.indexAmendmentCounter != this.masterDirectionIndexAmendmentContents.length) ? true : false;
                this.isPreviousButton = (this.indexAmendmentCounter != 1) ? true : false;
            }
        }
    }

    NextContent() {
        this.indexAmendmentContent = "";

        if (this.moduleTab == "masterdirection") {
            if (this.masterDirectionIndexSubIndexPopup == "indexSubIndex") {
                this.indexSubIndexCounter++;

                let indexId = this.masterDirectionIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.indexSubIndexCounter)[0].MasterDirectionIndexId;
                let subIndexId = this.masterDirectionIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.indexSubIndexCounter)[0].MasterDirectionSubIndexId;

                this.popupHeaderTitle = (indexId && subIndexId) ? Global.POPUP_SUBINDEX_HEADER_TITLE : (indexId) ? Global.POPUP_INDEX_HEADER_TITLE : '';

                this.indexAmendmentContent = this.masterDirectionIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.indexSubIndexCounter)[0].Content;
                this.isNextButton = (this.indexSubIndexCounter != this.masterDirectionIndexSubIndexContents.length) ? true : false;
                this.isPreviousButton = (this.indexSubIndexCounter != 1) ? true : false;
            } else {
                this.indexAmendmentCounter++;

                let indexId = this.masterDirectionIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.indexAmendmentCounter)[0].MasterDirectionIndexId;
                let subIndexId = this.masterDirectionIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.indexAmendmentCounter)[0].MasterDirectionSubIndexId;

                this.popupHeaderTitle = (indexId && subIndexId) ? Global.POPUP_SUBINDEX_AMENDMENT_HEADER_TITLE : (indexId) ? Global.POPUP_INDEX_AMENDMENT_HEADER_TITLE : '';

                this.indexAmendmentContent = this.masterDirectionIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.indexAmendmentCounter)[0].Content;
                this.isNextButton = (this.indexAmendmentCounter != this.masterDirectionIndexAmendmentContents.length) ? true : false;
                this.isPreviousButton = (this.indexAmendmentCounter != 1) ? true : false;
            }
        }
    }

    GetMasterCircularOfFEMASubModuleDetail(): void {
        this.spinnerService.show();

        let getMasterCircularOfFEMASubModuleDetailRequest = new GetMasterCircularOfFEMASubModuleDetailRequest();
        getMasterCircularOfFEMASubModuleDetailRequest.FEMASubModuleOfModuleId = this.fEMASubModuleOfModuleId;

        this._masterCircularOfFEMASubModuleDetailUserService.getMasterCircularOfFEMASubModuleDetail(getMasterCircularOfFEMASubModuleDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.masterCircularOfFEMASubModuleDetail = data.Response;

                    if (this.masterCircularOfFEMASubModuleDetail.length > 0) {
                        this.masterCircularId = this.masterCircularOfFEMASubModuleDetail[0].MasterCircularId;
                        this.GetMasterCircularDetailYear();
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_CIRCULAR_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetMasterCircularDetailYear(): void {
        this.spinnerService.show();

        this._masterCircularOfFEMASubModuleDetailUserService.getMasterCircularDetailYear()
            .subscribe(data => {
                this.spinnerService.hide();
                this.masterCircularDetailYears = [];

                if (data.Status == Global.API_SUCCESS) {
                    data.Response.forEach(item => {
                        this.masterCircularDetailYears.push({ Value: item, Text: item });
                    });

                    if (this.masterCircularDetailYears.length > 0) {
                        this.masterCircularYear = "2015";

                        this.GetMasterCircularDetail(this.masterCircularId, this.masterCircularYear);
                    }

                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_CIRCULAR_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_CIRCULAR_DETAIL_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetMasterCircularDetail(masterCircularId: number, year: string) {
        this.spinnerService.show();

        let getMasterCircularDetailRequest = new GetMasterCircularDetailRequest();
        getMasterCircularDetailRequest.MasterCircularId = masterCircularId;
        getMasterCircularDetailRequest.Year = year;

        this._masterCircularOfFEMASubModuleDetailUserService.getMasterCircularDetail(getMasterCircularDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.masterCircularDetails = data.Response;
                    if (this.masterCircularDetails.length > 0) {
                        this.masterCircularDetailPDFUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this._global.getPDFPath(this.masterCircularDetailPDFServerPath + this.masterCircularDetails[0].PDF));
                        
                        let interval = setInterval(function () {
                            let minusHeight = (document.querySelector('body').clientWidth > 766) ? 170 : (document.querySelector('body').clientWidth > 480) ? 325 : 293;

                            document.getElementById("iframe1").style.height = (document.querySelector('.modal-body').clientHeight - minusHeight) + "px";
                            clearInterval(interval);
                        }, 100);
                    }
                    else {
                        this.masterCircularDetailPDFUrl = '';
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_CIRCULAR_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_CIRCULAR_DETAIL_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetAPDIRCircularCircularOfFEMASubModuleDetail(year: string, searchText?: string, pageNumber?: number): void {
        this.spinnerService.show();

        let getAPDIRCircularOfFEMASubModuleDetailRequest = new GetAPDIRCircularOfFEMASubModuleDetailRequest();
        getAPDIRCircularOfFEMASubModuleDetailRequest.Year = year;
        getAPDIRCircularOfFEMASubModuleDetailRequest.SearchText = searchText;
        getAPDIRCircularOfFEMASubModuleDetailRequest.IsActive = null;
        getAPDIRCircularOfFEMASubModuleDetailRequest.OrderBy = this.sortingAPDIRCircularField;
        getAPDIRCircularOfFEMASubModuleDetailRequest.OrderByDirection = this.sortingAPDIRCircularDirection;
        getAPDIRCircularOfFEMASubModuleDetailRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getAPDIRCircularOfFEMASubModuleDetailRequest.PageSize = this.pageSize;

        this._aPDIRCircularOfFEMASubModuleDetailService.getAPDIRCircularOfFEMASubModuleDetail(getAPDIRCircularOfFEMASubModuleDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.aPDIRCircularYear = year;
                    this.aPDIRCircularOfFEMASubModuleDetails = data.Response;

                    this.pageSize = getAPDIRCircularOfFEMASubModuleDetailRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetAPDIRCircularYear(): void {
        this.spinnerService.show();

        this._aPDIRCircularOfFEMASubModuleDetailService.getAPDIRCircularYears()
            .subscribe(data => {
                //this.spinnerService.hide();
                this.aPDIRCircularYears = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.aPDIRCircularYears.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.aPDIRCircularYears.push({ Value: item.APDIRCircularYearId, Text: item.APDIRCircularYearName });
                    });

                    this.GetAPDIRCircularCircularOfFEMASubModuleDetail("", this.searchText, this.currentPage);
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    OnAPDIRCircularYearChange(year) {
        this.currentPage = 1;
        this.aPDIRCircularYear = year;
        this.GetAPDIRCircularCircularOfFEMASubModuleDetail(year, this.searchText, this.currentPage);
    }

    SearchAPDIRCircular(formData) {
        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.GetAPDIRCircularCircularOfFEMASubModuleDetail(this.aPDIRCircularYear, this.searchText, this.currentPage);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetAPDIRCircularCircularOfFEMASubModuleDetail(this.aPDIRCircularYear, this.searchText, pageNumber);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.GetAPDIRCircularCircularOfFEMASubModuleDetail(this.aPDIRCircularYear, this.searchText, null);
    }

    OnMasterDirectionChange(masterDirectionId) {
        this.indexMasterDirectionChapter = -1;
        this.indexMasterDirectionIndex = -1;
        this.itemDetailMasterDirectionChapters.index = this.indexMasterDirectionChapter;
        this.itemDetailMasterDirectionIndexes.index = this.indexMasterDirectionIndex;

        this.GetMasterDirectionIndexAmendment(masterDirectionId);
    }

    OnAPDIRCircularSort(fieldName) {
        this.sortingAPDIRCircularDirection = (this.sortingAPDIRCircularField == fieldName) ? (this.sortingAPDIRCircularDirection == "A") ? "D" : "A" : "A";
        this.sortingAPDIRCircularField = fieldName;
        this.GetAPDIRCircularCircularOfFEMASubModuleDetail(this.aPDIRCircularYear, this.searchText, this.currentPage);
    }
}
