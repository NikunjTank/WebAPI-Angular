import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PressNote, GetPressNoteRequest } from '../../../model/pressNote';
import { PressNoteNotification, GetPressNoteNotificationRequest } from '../../../model/pressNoteNotification';
import { PressNoteAPDIRCircular, GetPressNoteAPDIRCircularRequest } from '../../../model/pressNoteAPDIRCircular';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { PressNoteAdminService } from '../../../service/admin/pressNote.service';
import { PressNoteNotificationAdminService } from '../../../service/admin/pressNoteNotification.service';
import { PressNoteAPDIRCircularAdminService } from '../../../service/admin/pressNoteAPDIRCircular.service';


@Component({
    selector: 'my-app',
    templateUrl: './pressNotes.component.html'
})

export class PressNotesAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _pressNoteService: PressNoteAdminService, private _pressNoteNotificationService: PressNoteNotificationAdminService, private _pressNoteAPDIRCircularService: PressNoteAPDIRCircularAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router) { }

    _global: Global = new Global();

    pressNotes: PressNote[];
    pressNoteNotifications: PressNoteNotification[];
    pressNoteAPDIRCirculars: PressNoteAPDIRCircular[];

    pressNoteId: number;

    frmPressNote: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    pressNotePDFServerPath: string = Global.PRESSNOTE_PDF_FILEPATH;
    notificationPDFServerPath: string = Global.NOTIFICATION_PDF_FILEPATH;
    gSRPDFServerPath: string = Global.GSR_PDF_FILEPATH;
    aPDIRCircularPDFServerPath: string = Global.APDIRCIRCULAR_PDF_FILEPATH;

    itemDetailPressNotes1 = { index: -1 };
    itemDetailPressNotes2 = { index: -1 };

    indexPressNote1: number = -1;
    indexPressNote2: number = -1;

    drpPageSize: number;

    sortingPressNoteField: string;
    sortingPressNoteDirection: string;

    sortingPressNoteNotificationField: string;
    sortingPressNoteNotificationDirection: string;

    sortingPressNoteAPDIRCircularField: string;
    sortingPressNoteAPDIRCircularDirection: string;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.indexPressNote1 = (params["indexPressNote1"]) ? parseInt(params["indexPressNote1"]) : -1;
            this.indexPressNote2 = (params["indexPressNote2"]) ? parseInt(params["indexPressNote2"]) : -1;

            this.sortingPressNoteField = (params["sortingPressNoteField"]) ? params["sortingPressNoteField"] : "PressNoteDate";
            this.sortingPressNoteDirection = (params["sortingPressNoteDirection"]) ? params["sortingPressNoteDirection"] : "D";
            this.sortingPressNoteNotificationField = params["sortingPressNoteNotificationField"];
            this.sortingPressNoteNotificationDirection = params["sortingPressNoteNotificationDirection"];
            this.sortingPressNoteAPDIRCircularField = params["sortingPressNoteAPDIRCircularField"];
            this.sortingPressNoteAPDIRCircularDirection = params["sortingPressNoteAPDIRCircularDirection"];

            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmPressNote = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetPressNote(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetPressNote(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getPressNoteRequest = new GetPressNoteRequest();
        getPressNoteRequest.SearchText = searchText;
        getPressNoteRequest.IsActive = null;
        getPressNoteRequest.OrderBy = this.sortingPressNoteField;
        getPressNoteRequest.OrderByDirection = this.sortingPressNoteDirection;
        getPressNoteRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getPressNoteRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._pressNoteService.getPressNote(getPressNoteRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.pressNotes = data.Response;

                    if (this.indexPressNote1 != -1 && this.pressNotes.length > 0) {
                        this.itemDetailPressNotes1.index = this.indexPressNote1;
                        this.GetPressNoteNotification(this.itemDetailPressNotes1.index, this.pressNotes[this.itemDetailPressNotes1.index].PressNoteId, true);
                    }

                    if (this.indexPressNote2 != -1 && this.pressNotes.length > 0) {
                        this.itemDetailPressNotes2.index = this.indexPressNote2;
                        this.GetPressNoteAPDIRCircular(this.itemDetailPressNotes2.index, this.pressNotes[this.itemDetailPressNotes2.index].PressNoteId, true);
                    }

                    this.pageSize = getPressNoteRequest.PageSize;
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

    SearchPressNote(formData) {
        this.indexPressNote1 = -1;
        this.indexPressNote2 = -1;

        this.itemDetailPressNotes1.index = this.indexPressNote1;
        this.itemDetailPressNotes2.index = this.indexPressNote2;

        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.ReloadPage(false);
        this.GetPressNote(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.ReloadPage(true);
        this.GetPressNote(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.ReloadPage(false);
        this.GetPressNote(this.searchText, null, this.pageSize);
    }

    EditPressNote(pressNoteId) {
        this.router.navigate(['/admin/secure/pressnote/' + this._global.encryptValue(pressNoteId)], {
            queryParams: {
                indexPressNote1: this.indexPressNote1, indexPressNote2: this.indexPressNote2, sortingPressNoteField: this.sortingPressNoteField, sortingPressNoteDirection: this.sortingPressNoteDirection, sortingPressNoteNotificationField: this.sortingPressNoteNotificationField, sortingPressNoteNotificationDirection: this.sortingPressNoteNotificationDirection, sortingPressNoteAPDIRCircularField: this.sortingPressNoteAPDIRCircularField, sortingPressNoteAPDIRCircularDirection: this.sortingPressNoteAPDIRCircularDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddPressNoteNotification(pressNoteId, index) {
        this.router.navigate(['/admin/secure/pressnotenotification/' + this._global.encryptValue(pressNoteId)], {
            queryParams: {
                indexPressNote1: this.indexPressNote1, indexPressNote2: this.indexPressNote2, sortingPressNoteField: this.sortingPressNoteField, sortingPressNoteDirection: this.sortingPressNoteDirection, sortingPressNoteNotificationField: this.sortingPressNoteNotificationField, sortingPressNoteNotificationDirection: this.sortingPressNoteNotificationDirection, sortingPressNoteAPDIRCircularField: this.sortingPressNoteAPDIRCircularField, sortingPressNoteAPDIRCircularDirection: this.sortingPressNoteAPDIRCircularDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditPressNoteNotification(pressNoteNotificationId, pressNoteId) {
        this.router.navigate(['/admin/secure/pressnotenotification/' + this._global.encryptValue(pressNoteId) + "/" + this._global.encryptValue(pressNoteNotificationId)], {
            queryParams: {
                indexPressNote1: this.indexPressNote1, indexPressNote2: this.indexPressNote2, sortingPressNoteField: this.sortingPressNoteField, sortingPressNoteDirection: this.sortingPressNoteDirection, sortingPressNoteNotificationField: this.sortingPressNoteNotificationField, sortingPressNoteNotificationDirection: this.sortingPressNoteNotificationDirection, sortingPressNoteAPDIRCircularField: this.sortingPressNoteAPDIRCircularField, sortingPressNoteAPDIRCircularDirection: this.sortingPressNoteAPDIRCircularDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddPressNoteAPDIRCircular(pressNoteId, index) {
        this.router.navigate(['/admin/secure/pressnoteapdircircular/' + this._global.encryptValue(pressNoteId)], {
            queryParams: {
                indexPressNote1: this.indexPressNote1, indexPressNote2: this.indexPressNote2, sortingPressNoteField: this.sortingPressNoteField, sortingPressNoteDirection: this.sortingPressNoteDirection, sortingPressNoteNotificationField: this.sortingPressNoteNotificationField, sortingPressNoteNotificationDirection: this.sortingPressNoteNotificationDirection, sortingPressNoteAPDIRCircularField: this.sortingPressNoteAPDIRCircularField, sortingPressNoteAPDIRCircularDirection: this.sortingPressNoteAPDIRCircularDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditPressNoteAPDIRCircular(pressNoteAPDIRCircularId, pressNoteId) {
        this.router.navigate(['/admin/secure/pressnoteapdircircular/' + this._global.encryptValue(pressNoteId) + "/" + this._global.encryptValue(pressNoteAPDIRCircularId)], {
            queryParams: {
                indexPressNote1: this.indexPressNote1, indexPressNote2: this.indexPressNote2, sortingPressNoteField: this.sortingPressNoteField, sortingPressNoteDirection: this.sortingPressNoteDirection, sortingPressNoteNotificationField: this.sortingPressNoteNotificationField, sortingPressNoteNotificationDirection: this.sortingPressNoteNotificationDirection, sortingPressNoteAPDIRCircularField: this.sortingPressNoteAPDIRCircularField, sortingPressNoteAPDIRCircularDirection: this.sortingPressNoteAPDIRCircularDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    ReloadPage(isPageChange) {
        if (isPageChange == true) {
            this.indexPressNote1 = -1;
            this.indexPressNote2 = -1;

            this.itemDetailPressNotes1.index = this.indexPressNote1;
            this.itemDetailPressNotes2.index = this.indexPressNote2;
        }

        this.router.navigate(['/admin/secure/pressnotes'], {
            queryParams: {
                indexPressNote1: this.indexPressNote1, indexPressNote2: this.indexPressNote2, sortingPressNoteField: this.sortingPressNoteField, sortingPressNoteDirection: this.sortingPressNoteDirection, sortingPressNoteNotificationField: this.sortingPressNoteNotificationField, sortingPressNoteNotificationDirection: this.sortingPressNoteNotificationDirection, sortingPressNoteAPDIRCircularField: this.sortingPressNoteAPDIRCircularField, sortingPressNoteAPDIRCircularDirection: this.sortingPressNoteAPDIRCircularDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    DeletePressNote(pressNoteId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deletePressNote = {
                "PressNoteId": pressNoteId
            };

            this._pressNoteService.deletePressNote(deletePressNote)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { closeButton: true });
                        this.GetPressNote();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeletePressNoteNotification(pressNoteId: number, pressNoteNotificationId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deletePressNoteNotification = {
                "PressNoteNotificationId": pressNoteNotificationId
            };

            this._pressNoteNotificationService.deletePressNoteNotification(deletePressNoteNotification)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { closeButton: true });
                        this.GetPressNoteNotification(this.itemDetailPressNotes1.index, pressNoteId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeletePressNoteAPDIRCircular(pressNoteId: number, pressNoteAPDIRCircularId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deletePressNoteAPDIRCircular = {
                "PressNoteAPDIRCircularId": pressNoteAPDIRCircularId
            };

            this._pressNoteAPDIRCircularService.deletePressNoteAPDIRCircular(deletePressNoteAPDIRCircular)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { closeButton: true });
                        this.GetPressNoteAPDIRCircular(this.itemDetailPressNotes2.index, pressNoteId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    UpDownPressNote1Arrow(index) {
        if (index === this.itemDetailPressNotes1.index) {
            this.itemDetailPressNotes1.index = null;
        } else {
            this.itemDetailPressNotes1.index = index;
        }
    }

    UpDownPressNote2Arrow(index) {
        if (index === this.itemDetailPressNotes2.index) {
            this.itemDetailPressNotes2.index = null;
        } else {
            this.itemDetailPressNotes2.index = index;
        }
    }

    GetPressNoteNotification(index, pressNoteId, isDeleted): void {
        this.spinnerService.show();

        let getPressNoteNotificationRequest = new GetPressNoteNotificationRequest();
        getPressNoteNotificationRequest.PressNoteId = pressNoteId;
        getPressNoteNotificationRequest.IsActive = null;
        getPressNoteNotificationRequest.OrderBy = this.sortingPressNoteNotificationField;
        getPressNoteNotificationRequest.OrderByDirection = this.sortingPressNoteNotificationDirection;
        getPressNoteNotificationRequest.PageNumber = 1;
        getPressNoteNotificationRequest.PageSize = 100000;

        this._pressNoteNotificationService.getPressNoteNotification(getPressNoteNotificationRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.pressNoteNotifications = data.Response;

                    if (isDeleted != true) {
                        this.UpDownPressNote1Arrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetPressNoteAPDIRCircular(index, pressNoteId, isDeleted): void {
        this.spinnerService.show();

        let getPressNoteAPDIRCircularRequest = new GetPressNoteAPDIRCircularRequest();
        getPressNoteAPDIRCircularRequest.PressNoteId = pressNoteId;
        getPressNoteAPDIRCircularRequest.IsActive = null;
        getPressNoteAPDIRCircularRequest.OrderBy = this.sortingPressNoteAPDIRCircularField;
        getPressNoteAPDIRCircularRequest.OrderByDirection = this.sortingPressNoteAPDIRCircularDirection;
        getPressNoteAPDIRCircularRequest.PageNumber = 1;
        getPressNoteAPDIRCircularRequest.PageSize = 100000;

        this._pressNoteAPDIRCircularService.getPressNoteAPDIRCircular(getPressNoteAPDIRCircularRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.pressNoteAPDIRCirculars = data.Response;

                    if (isDeleted != true) {
                        this.UpDownPressNote2Arrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    ShowPressNoteNotification(index, pressNoteId) {
        this.indexPressNote1 = -1;

        if (this.itemDetailPressNotes1.index !== index) {
            if (pressNoteId) {
                this.indexPressNote1 = index;
                this.GetPressNoteNotification(index, pressNoteId, false);
            }
        } else {
            this.UpDownPressNote1Arrow(index);
        }
        this.ReloadPage(false);
    }

    ShowPressNoteAPDIRCircular(index, pressNoteId) {
        this.indexPressNote2 = -1;

        if (this.itemDetailPressNotes2.index !== index) {
            if (pressNoteId) {
                this.indexPressNote2 = index;
                this.GetPressNoteAPDIRCircular(index, pressNoteId, false);
            }
        } else {
            this.UpDownPressNote2Arrow(index);
        }
        this.ReloadPage(false);
    }

    OnPressNoteSort(fieldName) {
        this.sortingPressNoteDirection = (this.sortingPressNoteField == fieldName) ? (this.sortingPressNoteDirection == "A") ? "D" : "A" : "A";
        this.sortingPressNoteField = fieldName;
        this.ReloadPage(true);
        this.GetPressNote(this.searchText, this.currentPage, this.pageSize);
    }

    OnPressNoteNotificationSort(pressNoteId, fieldName) {
        this.sortingPressNoteNotificationDirection = (this.sortingPressNoteNotificationField == fieldName) ? (this.sortingPressNoteNotificationDirection == "A") ? "D" : "A" : "A";
        this.sortingPressNoteNotificationField = fieldName;
        this.ReloadPage(false);
        this.GetPressNoteNotification(this.itemDetailPressNotes1.index, pressNoteId, true);
    }

    OnPressNoteAPDIRCircularSort(pressNoteId, fieldName) {
        this.sortingPressNoteAPDIRCircularDirection = (this.sortingPressNoteAPDIRCircularField == fieldName) ? (this.sortingPressNoteAPDIRCircularDirection == "A") ? "D" : "A" : "A";
        this.sortingPressNoteAPDIRCircularField = fieldName;
        this.ReloadPage(false);
        this.GetPressNoteAPDIRCircular(this.itemDetailPressNotes2.index, pressNoteId, true);
    }
}
