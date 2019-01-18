import { Component, ComponentRef, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegulationOfFEMASubModuleDetail, GetRegulationOfFEMASubModuleDetailRequest } from '../../../model/regulationOfFEMASubModuleDetail';
import { Notification, GetNotificationRequest } from '../../../model/notification';
import { FemaIndex, GetFemaIndexRequest } from '../../../model/femaIndex';
import { FemaSubIndex, GetFemaSubIndexRequest } from '../../../model/femaSubIndex';
import { IndexAmendment, GetIndexAmendmentRequest } from '../../../model/indexAmendment';
import { RulesOfFEMASubModuleDetail, GetRulesOfFEMASubModuleDetailRequest } from '../../../model/rulesOfFEMASubModuleDetail';
import { GSRNotification, GetGSRNotificationRequest } from '../../../model/gSRNotification';
import { RulesIndex, GetRulesIndexRequest } from '../../../model/rulesIndex';
import { RulesSubIndex, GetRulesSubIndexRequest } from '../../../model/rulesSubIndex';
import { RulesIndexAmendment, GetRulesIndexAmendmentRequest } from '../../../model/rulesIndexAmendment';
import { RegulationOfFEMASubModuleDetailUserService } from '../../../service/user/regulationOfFEMASubModuleDetail.service';
import { NotificationUserService } from '../../../service/user/notification.service';
import { RulesOfFEMASubModuleDetailUserService } from '../../../service/user/rulesOfFEMASubModuleDetail.service';
import { GSRNotificationUserService } from '../../../service/user/gSRNotification.service';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { DropDown } from '../../../common/dropDown';

import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';

@Component({
    selector: 'my-app',
    templateUrl: './regulationPopup.component.html'
})

export class RegulationPopupUserComponent {

    dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        this.subModuleId = options.data;

        this.frmAllNotification = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetRegulationFEMASubModuleDetail();
    }

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private vcr: ViewContainerRef, private _regulationOfFEMASubModuleDetailService: RegulationOfFEMASubModuleDetailUserService, private _notificationService: NotificationUserService, private _rulesOfFEMASubModuleDetailService: RulesOfFEMASubModuleDetailUserService, private _gSRNotificationService: GSRNotificationUserService, private spinnerService: SpinnerService, private modalService: ModalDialogService) { }

    regulationOfFEMASubModuleDetails: RegulationOfFEMASubModuleDetail[];
    notifications: Notification[] = [];
    allNotifications: Notification[];
    femaIndexes: any = [];
    femaSubIndexes: any = [];
    tempFemaSubIndexes: any = [];
    femaIndexSubIndexAndAmendments: any = [];
    femaIndexSubIndexPopup: string;
    rulesIndexSubIndexPopup: string;

    femaIndexSubIndexContents: any = [];
    femaIndexAmendmentContents: any = [];
    indexSubIndexCounter: number;
    indexAmendmentCounter: number;

    rulesIndexSubIndexContents: any = [];
    rulesIndexAmendmentContents: any = [];
    rulesIndexSubIndexCounter: number;
    rulesIndexAmendmentCounter: number;

    rulesOfFEMASubModuleDetails: RulesOfFEMASubModuleDetail[];
    gSRNotifications: GSRNotification[] = [];
    rulesIndexes: any = [];
    rulesSubIndexes: any = [];
    tempRulesSubIndexes: any = [];
    rulesIndexSubIndexAndAmendments: any = [];
    popupHeaderTitle: string;

    isPreviousButton: boolean = false;
    isNextButton: boolean = false;

    nullValue = null;

    frmAllNotification: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number = 1;
    pageSize: number = Global.USER_PAGE_SIZE;

    itemDetailRegulationIndexes = { index: -1 };
    indexRegulationIndex: number = -1;

    itemDetailRulesIndexes = { index: -1 };
    indexRulesIndex: number = -1;

    sortingAllNotificationField: string = "NotificationDate";
    sortingAllNotificationDirection: string = "D";

    indexAmendmentTitle: string;
    indexAmendmentContent: string;

    notificationPDFServerPath: string = Global.NOTIFICATION_PDF_FILEPATH;
    gSRPDFServerPath: string = Global.GSR_PDF_FILEPATH;
    gSRNotificationPDFServerPath: string = Global.GSR_NOTIFICATION_PDF_FILEPATH;

    indexAmendments: IndexAmendment[];
    rulesIndexAmendments: RulesIndexAmendment[] = [];

    moduleTab: string = "regulation";
    subModuleId: number;

    gridviewIndexAmendmentTab: string = "gridview";
    rulesGridviewIndexAmendmentTab: string = "gridview";

    GetRegulationFEMASubModuleDetail(): void {
        this.spinnerService.show();

        let getRegulationOfFEMASubModuleDetailRequest = new GetRegulationOfFEMASubModuleDetailRequest();
        getRegulationOfFEMASubModuleDetailRequest.FEMASubModuleOfModuleId = this.subModuleId;

        this._regulationOfFEMASubModuleDetailService.getRegulationOfFEMASubModuleDetail(getRegulationOfFEMASubModuleDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.regulationOfFEMASubModuleDetails = data.Response;

                    if (this.regulationOfFEMASubModuleDetails.length > 0) {
                        this.GetNotification(data.Response[0].RegulationId);
                        this.GetIndexAmendment(data.Response[0].RegulationId);
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

    GetNotification(regulationId): void {
        this.spinnerService.show();

        let getNotificationRequest = new GetNotificationRequest();
        getNotificationRequest.RegulationId = regulationId;

        this._notificationService.getNotification(getNotificationRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.notifications = data.Response;
                    this.notifications = this.notifications.sort((a, b) => b.NotificationDate.localeCompare(a.NotificationDate));
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetAllNotification(searchText?: string, pageNumber?: number): void {
        this.spinnerService.show();

        let getNotificationRequest = new GetNotificationRequest();
        getNotificationRequest.SearchText = searchText;
        getNotificationRequest.IsActive = null;
        getNotificationRequest.OrderBy = this.sortingAllNotificationField;
        getNotificationRequest.OrderByDirection = this.sortingAllNotificationDirection;
        getNotificationRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getNotificationRequest.PageSize = this.pageSize;

        this._notificationService.getNotification(getNotificationRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.allNotifications = data.Response;

                    this.pageSize = getNotificationRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchAllNotification(formData) {
        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.GetAllNotification(this.searchText, this.currentPage);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetAllNotification(this.searchText, pageNumber);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.GetAllNotification(this.searchText, null);
    }

    OnRegulationChange(regulationId) {
        this.indexRegulationIndex = -1;
        this.itemDetailRegulationIndexes.index = this.indexRegulationIndex;

        this.GetNotification(regulationId);
        this.GetIndexAmendment(regulationId);
    }

    OnRulesChange(rulesId) {
        this.GetGSRNotification(rulesId);
        this.GetRulesIndexAmendment(rulesId);
    }

    OnAllNotificationSort(fieldName) {
        this.sortingAllNotificationDirection = (this.sortingAllNotificationField == fieldName) ? (this.sortingAllNotificationDirection == "A") ? "D" : "A" : "A";
        this.sortingAllNotificationField = fieldName;
        this.GetAllNotification(this.searchText, this.currentPage);
    }

    GetIndexAmendment(regulationId): void {
        this.spinnerService.show();

        let getIndexAmendmentRequest = new GetIndexAmendmentRequest();
        getIndexAmendmentRequest.RegulationId = regulationId;

        this._regulationOfFEMASubModuleDetailService.getIndexAmendment(getIndexAmendmentRequest)
            .subscribe(data => {
                //this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.indexAmendments = data.Response;
                    this.GetIndex(regulationId);
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetIndex(regulationId): void {
        this.spinnerService.show();

        let getFemaIndexRequest = new GetFemaIndexRequest();
        getFemaIndexRequest.RegulationId = regulationId;

        this._regulationOfFEMASubModuleDetailService.getFemaIndex(getFemaIndexRequest)
            .subscribe(data => {
                //this.spinnerService.hide();
                this.femaIndexes = [];
                let t_this = this;

                if (data.Status == Global.API_SUCCESS) {
                    data.Response.forEach(function (index) {
                        //let amendments = t_this.indexAmendments.filter(x => x.IndexId == index.IndexId && x.SubIndexId == null).sort((a, b) => b.NotificationDate.localeCompare(a.NotificationDate));
                        let amendments = t_this.indexAmendments.filter(x => x.IndexId == index.IndexId && x.SubIndexId == null);

                        t_this.femaIndexes.push({ IndexId: index.IndexId, IndexNo: index.IndexNo, IndexName: index.IndexName, IndexContent: index.IndexContent, SortId: index.SortId, RegulationId: index.RegulationId, IndexAmendments: amendments });
                    });

                    this.GetSubIndex(regulationId);
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetSubIndex(regulationId): void {
        this.spinnerService.show();

        let getFemaSubIndexRequest = new GetFemaSubIndexRequest();
        getFemaSubIndexRequest.RegulationId = regulationId;

        this._regulationOfFEMASubModuleDetailService.getFemaSubIndex(getFemaSubIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.tempFemaSubIndexes = [];

                let t_this = this;

                if (data.Status == Global.API_SUCCESS) {
                    data.Response.forEach(function (subIndex) {
                        //let amendments = t_this.indexAmendments.filter(x => x.SubIndexId == subIndex.SubIndexId).sort((a, b) => b.NotificationDate.localeCompare(a.NotificationDate));
                        let amendments = t_this.indexAmendments.filter(x => x.SubIndexId == subIndex.SubIndexId);

                        t_this.tempFemaSubIndexes.push({ IndexId: subIndex.IndexId, SubIndexId: subIndex.SubIndexId, SubIndexNo: subIndex.SubIndexNo, SubIndexName: subIndex.SubIndexName, SubIndexContent: subIndex.SubIndexContent, SubIndexAmendments: amendments });
                    });

                    this.GetRegulationIndexSubIndexContent();
                    this.GetRegulationIndexAmendmentContent();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUBINDEX_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetRegulationIndexSubIndexContent() {
        this.femaIndexSubIndexContents = [];
        let t_this = this;
        let counter = 0;

        this.femaIndexes.forEach(function (index) {
            counter++;
            t_this.femaIndexSubIndexContents.push({ IndexId: index.IndexId, SubIndexId: null, Content: index.IndexContent, IndexSubIndexCounter: counter });

            t_this.tempFemaSubIndexes.forEach(function (subIndex) {
                if (index.IndexId == subIndex.IndexId) {
                    counter++;
                    t_this.femaIndexSubIndexContents.push({ IndexId: index.IndexId, SubIndexId: subIndex.SubIndexId, Content: subIndex.SubIndexContent, IndexSubIndexCounter: counter });
                }
            });
        });
    }

    GetRegulationIndexAmendmentContent() {
        this.femaIndexAmendmentContents = [];
        let t_this = this;
        let counter = 0;

        this.femaIndexes.forEach(function (index) {
            t_this.indexAmendments.filter(x => x.IndexId == index.IndexId && x.SubIndexId == null).forEach(function (item) {
                counter++;
                t_this.femaIndexAmendmentContents.push({ IndexId: item.IndexId, SubIndexId: item.SubIndexId, IndexAmendmentId: item.IndexAmendmentId, Content: item.IndexAmendmentContent, IndexAmendmentCounter: counter });
            });

            t_this.tempFemaSubIndexes.forEach(function (subIndex) {
                if (index.IndexId == subIndex.IndexId) {
                    t_this.indexAmendments.filter(x => x.IndexId == index.IndexId && x.SubIndexId == subIndex.SubIndexId).forEach(function (item) {
                        counter++;
                        t_this.femaIndexAmendmentContents.push({ IndexId: item.IndexId, SubIndexId: item.SubIndexId, IndexAmendmentId: item.IndexAmendmentId, Content: item.IndexAmendmentContent, IndexAmendmentCounter: counter });
                    });
                }
            });
        });
    }

    UpDownRegulationIndexArrow(index) {
        if (index === this.itemDetailRegulationIndexes.index) {
            this.itemDetailRegulationIndexes.index = null;
        } else {
            this.itemDetailRegulationIndexes.index = index;
        }
    }

    ShowRegulationSubIndex(index, indexId) {
        this.indexRegulationIndex = -1;

        if (this.itemDetailRegulationIndexes.index !== index) {
            if (indexId) {
                this.indexRegulationIndex = index;
                this.femaSubIndexes = this.tempFemaSubIndexes.filter(x => x.IndexId == indexId);

                if (this.tempFemaSubIndexes.filter(x => x.IndexId == indexId).length > 0)
                    this.UpDownRegulationIndexArrow(index);
                else
                    this.itemDetailRegulationIndexes.index = null;
            }
        }
        else {
            this.UpDownRegulationIndexArrow(index);
        }
    }

    GetRulesFEMASubModuleDetail(): void {
        this.spinnerService.show();

        let getRulesOfFEMASubModuleDetailRequest = new GetRulesOfFEMASubModuleDetailRequest();
        getRulesOfFEMASubModuleDetailRequest.FEMASubModuleOfModuleId = this.subModuleId;

        this._rulesOfFEMASubModuleDetailService.getRulesOfFEMASubModuleDetail(getRulesOfFEMASubModuleDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.rulesOfFEMASubModuleDetails = data.Response;

                    if (this.rulesOfFEMASubModuleDetails.length > 0) {
                        this.GetGSRNotification(data.Response[0].RulesId);
                        this.GetRulesIndexAmendment(data.Response[0].RulesId);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetGSRNotification(rulesId): void {
        this.spinnerService.show();

        let getGSRNotificationRequest = new GetGSRNotificationRequest();
        getGSRNotificationRequest.RulesId = rulesId;

        this._gSRNotificationService.getGSRNotification(getGSRNotificationRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.gSRNotifications = data.Response;

                    this.gSRNotifications = this.gSRNotifications.sort((a, b) => b.GSRNotificationDate.localeCompare(a.GSRNotificationDate));
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetRulesIndexAmendment(rulesId): void {
        this.spinnerService.show();

        let getRulesIndexAmendmentRequest = new GetRulesIndexAmendmentRequest();
        getRulesIndexAmendmentRequest.RulesId = rulesId;

        this._rulesOfFEMASubModuleDetailService.getRulesIndexAmendment(getRulesIndexAmendmentRequest)
            .subscribe(data => {
                //this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.rulesIndexAmendments = data.Response;
                    
                    this.GetRulesIndex(rulesId);
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetRulesIndex(rulesId): void {
        this.spinnerService.show();

        let getRulesIndexRequest = new GetRulesIndexRequest();
        getRulesIndexRequest.RulesId = rulesId;

        this._rulesOfFEMASubModuleDetailService.getRulesIndex(getRulesIndexRequest)
            .subscribe(data => {
                //this.spinnerService.hide();
                this.rulesIndexes = [];
                let t_this = this;

                if (data.Status == Global.API_SUCCESS) {
                    data.Response.forEach(function (index) {
                        //let amendments = t_this.rulesIndexAmendments.filter(x => x.IndexId == index.IndexId && x.SubIndexId == null).sort((a, b) => b.GSRNotificationDate.localeCompare(a.GSRNotificationDate));
                        let amendments = t_this.rulesIndexAmendments.filter(x => x.IndexId == index.IndexId && x.SubIndexId == null);

                        t_this.rulesIndexes.push({ IndexId: index.IndexId, IndexNo: index.IndexNo, IndexName: index.IndexName, IndexContent: index.IndexContent, RulesId: index.RulesId, IndexAmendments: amendments });
                    });
                    this.GetRulesSubIndex(rulesId);
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetRulesSubIndex(rulesId): void {
        this.spinnerService.show();

        let getRulesSubIndexRequest = new GetRulesSubIndexRequest();
        getRulesSubIndexRequest.RulesId = rulesId;

        this._rulesOfFEMASubModuleDetailService.getRulesSubIndex(getRulesSubIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.tempRulesSubIndexes = [];

                let t_this = this;

                if (data.Status == Global.API_SUCCESS) {
                    data.Response.forEach(function (subIndex) {
                        //let amendments = t_this.rulesIndexAmendments.filter(x => x.SubIndexId == subIndex.SubIndexId).sort((a, b) => b.GSRNotificationDate.localeCompare(a.GSRNotificationDate));
                        let amendments = t_this.rulesIndexAmendments.filter(x => x.SubIndexId == subIndex.SubIndexId);

                        t_this.tempRulesSubIndexes.push({ IndexId: subIndex.IndexId, SubIndexId: subIndex.SubIndexId, SubIndexNo: subIndex.SubIndexNo, SubIndexName: subIndex.SubIndexName, SubIndexContent: subIndex.SubIndexContent, SubIndexAmendments: amendments });
                    });

                    this.GetRulesIndexSubIndexContent();
                    this.GetRulesIndexAmendmentContent();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetRulesIndexSubIndexContent() {
        this.rulesIndexSubIndexContents = [];
        let t_this = this;
        let counter = 0;

        this.rulesIndexes.forEach(function (index) {
            counter++;
            t_this.rulesIndexSubIndexContents.push({ IndexId: index.IndexId, SubIndexId: null, Content: index.IndexContent, IndexSubIndexCounter: counter });

            t_this.tempRulesSubIndexes.forEach(function (subIndex) {
                if (index.IndexId == subIndex.IndexId) {
                    counter++;
                    t_this.rulesIndexSubIndexContents.push({ IndexId: index.IndexId, SubIndexId: subIndex.SubIndexId, Content: subIndex.SubIndexContent, IndexSubIndexCounter: counter });
                }
            });
        });
    }

    GetRulesIndexAmendmentContent() {
        this.rulesIndexAmendmentContents = [];
        let t_this = this;
        let counter = 0;

        this.rulesIndexes.forEach(function (index) {
            t_this.rulesIndexAmendments.filter(x => x.IndexId == index.IndexId && x.SubIndexId == null).forEach(function (item) {
                counter++;
                t_this.rulesIndexAmendmentContents.push({ IndexId: item.IndexId, SubIndexId: item.SubIndexId, RulesIndexAmendmentId: item.RulesIndexAmendmentId, Content: item.IndexAmendmentContent, IndexAmendmentCounter: counter });
            });

            t_this.tempRulesSubIndexes.forEach(function (subIndex) {
                if (index.IndexId == subIndex.IndexId) {
                    t_this.rulesIndexAmendments.filter(x => x.IndexId == index.IndexId && x.SubIndexId == subIndex.SubIndexId).forEach(function (item) {
                        counter++;
                        t_this.rulesIndexAmendmentContents.push({ IndexId: item.IndexId, SubIndexId: item.SubIndexId, RulesIndexAmendmentId: item.RulesIndexAmendmentId, Content: item.IndexAmendmentContent, IndexAmendmentCounter: counter });
                    });
                }
            });
        });
    }

    UpDownRulesIndexArrow(index) {
        if (index === this.itemDetailRulesIndexes.index) {
            this.itemDetailRulesIndexes.index = null;
        } else {
            this.itemDetailRulesIndexes.index = index;
        }
    }

    ShowRulesSubIndex(index, indexId) {
        this.indexRulesIndex = -1;

        if (this.itemDetailRulesIndexes.index !== index) {
            if (indexId) {
                this.indexRulesIndex = index;
                this.rulesSubIndexes = this.tempRulesSubIndexes.filter(x => x.IndexId == indexId);

                if (this.tempRulesSubIndexes.filter(x => x.IndexId == indexId).length > 0)
                    this.UpDownRulesIndexArrow(index);
                else
                    this.itemDetailRulesIndexes.index = null;
            }
        }
        else {
            this.UpDownRulesIndexArrow(index);
        }
    }

    ShowContent(indexId: number, subIndexId: number, indexAmendmentId: number, indexSubIndexAndIndexAmendmentPopup) {
        this.indexAmendmentContent = "";

        if (this.moduleTab == "regulation") {
            this.popupHeaderTitle = (indexAmendmentId && this.indexAmendments.filter(x => x.IndexAmendmentId == indexAmendmentId)[0].IndexId && this.indexAmendments.filter(x => x.IndexAmendmentId == indexAmendmentId)[0].SubIndexId) ? Global.POPUP_SUBINDEX_AMENDMENT_HEADER_TITLE :
                (indexAmendmentId && this.indexAmendments.filter(x => x.IndexAmendmentId == indexAmendmentId)[0].IndexId) ? Global.POPUP_INDEX_AMENDMENT_HEADER_TITLE :
                    (indexId && subIndexId) ? Global.POPUP_SUBINDEX_HEADER_TITLE :
                        (indexId) ? Global.POPUP_INDEX_HEADER_TITLE : '';

            this.femaIndexSubIndexPopup = indexSubIndexAndIndexAmendmentPopup;

            if (this.femaIndexSubIndexPopup == "indexSubIndex") {
                this.indexSubIndexCounter = this.femaIndexSubIndexContents.filter(x => x.IndexId == indexId && x.SubIndexId == subIndexId)[0].IndexSubIndexCounter;
                this.indexAmendmentContent = this.femaIndexSubIndexContents.filter(x => x.IndexId == indexId && x.SubIndexId == subIndexId)[0].Content;
                this.isNextButton = (this.indexSubIndexCounter != this.femaIndexSubIndexContents.length) ? true : false;
                this.isPreviousButton = (this.indexSubIndexCounter != 1) ? true : false;
            } else {
                this.indexAmendmentCounter = this.femaIndexAmendmentContents.filter(x => x.IndexAmendmentId == indexAmendmentId)[0].IndexAmendmentCounter;
                this.indexAmendmentContent = this.femaIndexAmendmentContents.filter(x => x.IndexAmendmentId == indexAmendmentId)[0].Content;
                this.isNextButton = (this.indexAmendmentCounter != this.femaIndexAmendmentContents.length) ? true : false;
                this.isPreviousButton = (this.indexAmendmentCounter != 1) ? true : false;
            }
        } else if (this.moduleTab == "rules") {
            this.popupHeaderTitle = (indexAmendmentId && this.rulesIndexAmendmentContents.filter(x => x.RulesIndexAmendmentId == indexAmendmentId)[0].IndexId && this.rulesIndexAmendmentContents.filter(x => x.RulesIndexAmendmentId == indexAmendmentId)[0].SubIndexId) ? Global.POPUP_SUBINDEX_AMENDMENT_HEADER_TITLE :
                (indexAmendmentId && this.rulesIndexAmendmentContents.filter(x => x.RulesIndexAmendmentId == indexAmendmentId)[0].IndexId) ? Global.POPUP_INDEX_AMENDMENT_HEADER_TITLE :
                    (indexId && subIndexId) ? Global.POPUP_SUBINDEX_HEADER_TITLE :
                        (indexId) ? Global.POPUP_INDEX_HEADER_TITLE : '';

            this.rulesIndexSubIndexPopup = indexSubIndexAndIndexAmendmentPopup;

            if (this.rulesIndexSubIndexPopup == "indexSubIndex") {
                this.rulesIndexSubIndexCounter = this.rulesIndexSubIndexContents.filter(x => x.IndexId == indexId && x.SubIndexId == subIndexId)[0].IndexSubIndexCounter;
                this.indexAmendmentContent = this.rulesIndexSubIndexContents.filter(x => x.IndexId == indexId && x.SubIndexId == subIndexId)[0].Content;
                this.isNextButton = (this.rulesIndexSubIndexCounter != this.rulesIndexSubIndexContents.length) ? true : false;
                this.isPreviousButton = (this.rulesIndexSubIndexCounter != 1) ? true : false;
            } else {
                this.rulesIndexAmendmentCounter = this.rulesIndexAmendmentContents.filter(x => x.RulesIndexAmendmentId == indexAmendmentId)[0].IndexAmendmentCounter;
                this.indexAmendmentContent = this.rulesIndexAmendmentContents.filter(x => x.RulesIndexAmendmentId == indexAmendmentId)[0].Content;
                this.isNextButton = (this.rulesIndexAmendmentCounter != this.rulesIndexAmendmentContents.length) ? true : false;
                this.isPreviousButton = (this.rulesIndexAmendmentCounter != 1) ? true : false;
            }
        }
    }

    PreviousContent() {
        this.indexAmendmentContent = "";

        if (this.moduleTab == "regulation") {
            if (this.femaIndexSubIndexPopup == "indexSubIndex") {
                this.indexSubIndexCounter--;

                let indexId = this.femaIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.indexSubIndexCounter)[0].IndexId;
                let subIndexId = this.femaIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.indexSubIndexCounter)[0].SubIndexId;

                this.popupHeaderTitle = (indexId && subIndexId) ? Global.POPUP_SUBINDEX_HEADER_TITLE : (indexId) ? Global.POPUP_INDEX_HEADER_TITLE : '';

                this.indexAmendmentContent = this.femaIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.indexSubIndexCounter)[0].Content;
                this.isNextButton = (this.indexSubIndexCounter != this.femaIndexSubIndexContents.length) ? true : false;
                this.isPreviousButton = (this.indexSubIndexCounter != 1) ? true : false;;
            } else {
                this.indexAmendmentCounter--;

                let indexId = this.femaIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.indexAmendmentCounter)[0].IndexId;
                let subIndexId = this.femaIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.indexAmendmentCounter)[0].SubIndexId;

                this.popupHeaderTitle = (indexId && subIndexId) ? Global.POPUP_SUBINDEX_AMENDMENT_HEADER_TITLE : (indexId) ? Global.POPUP_INDEX_AMENDMENT_HEADER_TITLE : '';

                this.indexAmendmentContent = this.femaIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.indexAmendmentCounter)[0].Content;
                this.isNextButton = (this.indexAmendmentCounter != this.femaIndexAmendmentContents.length) ? true : false;
                this.isPreviousButton = (this.indexAmendmentCounter != 1) ? true : false;
            }
        } else if (this.moduleTab == "rules") {
            if (this.rulesIndexSubIndexPopup == "indexSubIndex") {
                this.rulesIndexSubIndexCounter--;

                let indexId = this.rulesIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.rulesIndexSubIndexCounter)[0].IndexId;
                let subIndexId = this.rulesIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.rulesIndexSubIndexCounter)[0].SubIndexId;

                this.popupHeaderTitle = (indexId && subIndexId) ? Global.POPUP_SUBINDEX_HEADER_TITLE : (indexId) ? Global.POPUP_INDEX_HEADER_TITLE : '';

                this.indexAmendmentContent = this.rulesIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.rulesIndexSubIndexCounter)[0].Content;
                this.isNextButton = (this.rulesIndexSubIndexCounter != this.rulesIndexSubIndexContents.length) ? true : false;
                this.isPreviousButton = (this.rulesIndexSubIndexCounter != 1) ? true : false;;
            } else {
                this.rulesIndexAmendmentCounter--;

                let indexId = this.rulesIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.rulesIndexAmendmentCounter)[0].IndexId;
                let subIndexId = this.rulesIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.rulesIndexAmendmentCounter)[0].SubIndexId;

                this.popupHeaderTitle = (indexId && subIndexId) ? Global.POPUP_SUBINDEX_AMENDMENT_HEADER_TITLE : (indexId) ? Global.POPUP_INDEX_AMENDMENT_HEADER_TITLE : '';

                this.indexAmendmentContent = this.rulesIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.rulesIndexAmendmentCounter)[0].Content;
                this.isNextButton = (this.rulesIndexAmendmentCounter != this.rulesIndexAmendmentContents.length) ? true : false;
                this.isPreviousButton = (this.rulesIndexAmendmentCounter != 1) ? true : false;
            }
        }
    }

    NextContent() {
        this.indexAmendmentContent = "";

        if (this.moduleTab == "regulation") {
            if (this.femaIndexSubIndexPopup == "indexSubIndex") {
                this.indexSubIndexCounter++;

                let indexId = this.femaIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.indexSubIndexCounter)[0].IndexId;
                let subIndexId = this.femaIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.indexSubIndexCounter)[0].SubIndexId;

                this.popupHeaderTitle = (indexId && subIndexId) ? Global.POPUP_SUBINDEX_HEADER_TITLE : (indexId) ? Global.POPUP_INDEX_HEADER_TITLE : '';

                this.indexAmendmentContent = this.femaIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.indexSubIndexCounter)[0].Content;
                this.isNextButton = (this.indexSubIndexCounter != this.femaIndexSubIndexContents.length) ? true : false;
                this.isPreviousButton = (this.indexSubIndexCounter != 1) ? true : false;
            } else {
                this.indexAmendmentCounter++;

                let indexId = this.femaIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.indexAmendmentCounter)[0].IndexId;
                let subIndexId = this.femaIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.indexAmendmentCounter)[0].SubIndexId;

                this.popupHeaderTitle = (indexId && subIndexId) ? Global.POPUP_SUBINDEX_AMENDMENT_HEADER_TITLE : (indexId) ? Global.POPUP_INDEX_AMENDMENT_HEADER_TITLE : '';

                this.indexAmendmentContent = this.femaIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.indexAmendmentCounter)[0].Content;
                this.isNextButton = (this.indexAmendmentCounter != this.femaIndexAmendmentContents.length) ? true : false;
                this.isPreviousButton = (this.indexAmendmentCounter != 1) ? true : false;
            }
        } else if (this.moduleTab == "rules") {
            if (this.rulesIndexSubIndexPopup == "indexSubIndex") {
                this.rulesIndexSubIndexCounter++;

                let indexId = this.rulesIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.rulesIndexSubIndexCounter)[0].IndexId;
                let subIndexId = this.rulesIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.rulesIndexSubIndexCounter)[0].SubIndexId;

                this.popupHeaderTitle = (indexId && subIndexId) ? Global.POPUP_SUBINDEX_HEADER_TITLE : (indexId) ? Global.POPUP_INDEX_HEADER_TITLE : '';

                this.indexAmendmentContent = this.rulesIndexSubIndexContents.filter(x => x.IndexSubIndexCounter == this.rulesIndexSubIndexCounter)[0].Content;
                this.isNextButton = (this.rulesIndexSubIndexCounter != this.rulesIndexSubIndexContents.length) ? true : false;
                this.isPreviousButton = (this.rulesIndexSubIndexCounter != 1) ? true : false;;
            } else {
                this.rulesIndexAmendmentCounter++;

                let indexId = this.rulesIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.rulesIndexAmendmentCounter)[0].IndexId;
                let subIndexId = this.rulesIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.rulesIndexAmendmentCounter)[0].SubIndexId;

                this.popupHeaderTitle = (indexId && subIndexId) ? Global.POPUP_SUBINDEX_AMENDMENT_HEADER_TITLE : (indexId) ? Global.POPUP_INDEX_AMENDMENT_HEADER_TITLE : '';

                this.indexAmendmentContent = this.rulesIndexAmendmentContents.filter(x => x.IndexAmendmentCounter == this.rulesIndexAmendmentCounter)[0].Content;
                this.isNextButton = (this.rulesIndexAmendmentCounter != this.rulesIndexAmendmentContents.length) ? true : false;
                this.isPreviousButton = (this.rulesIndexAmendmentCounter != 1) ? true : false;
            }
        }
    }

    OnModuleTabClick(moduleTab) {
        this.moduleTab = moduleTab;

        if (moduleTab == 'regulation') {
            this.GetRegulationFEMASubModuleDetail();
        } else if (moduleTab == 'notification') {
            this.GetAllNotification(this.searchText, this.currentPage);
        } else if (moduleTab == 'rules') {
            this.GetRulesFEMASubModuleDetail();
        }
    }

    OnGridViewIndexAmendmentTabClick(gridviewIndexAmendmentTab) {
        this.gridviewIndexAmendmentTab = gridviewIndexAmendmentTab;
    }

    OnRulesGridViewIndexAmendmentTabClick(rulesGridviewIndexAmendmentTab) {
        this.rulesGridviewIndexAmendmentTab = rulesGridviewIndexAmendmentTab;
    }
}
