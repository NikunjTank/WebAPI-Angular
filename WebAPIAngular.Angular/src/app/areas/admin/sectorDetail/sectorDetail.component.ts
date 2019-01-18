import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sector, GetSectorRequest } from '../../../model/sector';
import { SectorDetail, GetSectorDetailRequest } from '../../../model/sectorDetail';
import { SubSector, GetSubSectorRequest } from '../../../model/subSector';
import { PressNote, GetPressNoteRequest } from '../../../model/pressNote';
import { PressNoteNotification, GetPressNoteNotificationRequest } from '../../../model/pressNoteNotification';
import { PressNoteAPDIRCircular, GetPressNoteAPDIRCircularRequest } from '../../../model/pressNoteAPDIRCircular';
import { Notification, GetNotificationRequest } from '../../../model/notification';
import { APDIRCircular, GetAPDIRCircularRequest } from '../../../model/aPDIRCircular';
import { SectorAdminService } from '../../../service/admin/sector.service';
import { SectorDetailAdminService } from '../../../service/admin/sectorDetail.service';
import { SubSectorAdminService } from '../../../service/admin/subSector.service';
import { PressNoteAdminService } from '../../../service/admin/pressNote.service';
import { PressNoteNotificationAdminService } from '../../../service/admin/pressNoteNotification.service';
import { PressNoteAPDIRCircularAdminService } from '../../../service/admin/pressNoteAPDIRCircular.service';
import { NotificationAdminService } from '../../../service/admin/notification.service';
import { APDIRCircularAdminService } from '../../../service/admin/aPDIRCircular.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './sectorDetail.component.html'
})

export class SectorDetailAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _sectorService: SectorAdminService, private _sectorDetailService: SectorDetailAdminService, private _pressNoteService: PressNoteAdminService, private _pressNoteNotificationService: PressNoteNotificationAdminService, private _pressNoteAPDIRCircularService: PressNoteAPDIRCircularAdminService, private _notificationService: NotificationAdminService, private _aPDIRCircularService: APDIRCircularAdminService, private _subSectorService: SubSectorAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    sector: Sector = new Sector();
    sectorId: number = 0;
    sectorDetailId: number = 0;
    searchText: string = '';
    frmSectorDetail: FormGroup;
    msg: string;

    pressNotes: PressNote[] = [];
    notifications: PressNoteNotification[] = [];
    aPDIRCirculars: PressNoteAPDIRCircular[] = [];
    subSectors: SubSector[] = [];
    sectorDetailYears: any[];
    pressNoteDropDownSettings = {};
    notificationDropDownSettings = {};
    aPDIRCircularDropDownSettings = {};

    addUpdateText: string;

    isSubmited: boolean = false;
    selectedPressNotes: any = [];
    selectedNotifications: any = [];
    selectedAPDIRCirculars: any = [];

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let sectorId = this._global.decryptValue(params['sectorId']);
            let sectorDetailId = this._global.decryptValue(params['sectorDetailId']);

            if (sectorId) {
                this.sectorId = parseInt(sectorId);

                this.GetSector(this.sectorId);

                if (sectorDetailId) {
                    this.addUpdateText = "Update";
                    this.sectorDetailId = parseInt(sectorDetailId);
                    this.EditSectorDetail(parseInt(sectorDetailId));
                } else {
                    this.GetSectorDetailYear(null);
                    this.GetSubSector(null);
                    this.GetPressNote(null);
                    this.GetNotification(null);
                    this.GetAPDIRCircular(null);

                    this.addUpdateText = "Add";
                }
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/sectors'], {
                        queryParams: {
                            indexSector1: params["indexSector1"], indexSector2: params["indexSector2"], sortingSectorField: params["sortingSectorField"], sortingSectorDirection: params["sortingSectorDirection"], sortingSectorDetailField: params["sortingSectorDetailField"], sortingSectorDetailDirection: params["sortingSectorDetailDirection"], sortingSubSectorField: params["sortingSubSectorField"], sortingSubSectorDirection: params["sortingSubSectorDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                        }
                    });
                });
            }
        });

        this.frmSectorDetail = this.formBuilder.group({
            SectorDetailId: [''],
            SectorId: [this.sectorId],
            Year: ['', Validators.required],
            PressNoteId: [''],
            NotificationId: [''],
            APDIRCircularId: [''],
            SubSectorId: ['']
        });
    }

    GetSectorDetailYear(sectorData): void {
        this.spinnerService.show();

        this._sectorDetailService.getSectorDetailYear()
            .subscribe(data => {
                this.spinnerService.hide();

                //this.GetSubSector(sectorData);

                this.sectorDetailYears = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.sectorDetailYears.push({ YearId: null, YearName: "--Select--" });

                    data.Response.forEach(item => {
                        this.sectorDetailYears.push({ YearId: item, YearName: item });
                    });

                    this.frmSectorDetail.get("Year").setValue((sectorData != null) ? sectorData.Year : sectorData);
                    this.frmSectorDetail.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SECTOR_DETAIL_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_DETAIL_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetPressNote(sectorData): void {
        this.spinnerService.show();

        let getPressNoteRequest = new GetPressNoteRequest();

        this._pressNoteService.getPressNote(getPressNoteRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                //this.GetNotification(sectorData);

                this.pressNotes = [];

                if (data.Status == Global.API_SUCCESS) {

                    data.Response.forEach(item => {
                        this.pressNotes.push({ PressNoteId: item.PressNoteId, PressNoteNo: item.PressNoteNo, CreatedDate: null, PressNoteDate: null, PressNoteEffectiveDate: null, PressNoteName: null, IsActive: null, IsDeleted: null, ModifiedDate: null, PressNotePDF: null, Year: null });
                    });

                    this.pressNoteDropDownSettings = {
                        singleSelection: false,
                        idField: 'PressNoteId',
                        textField: 'PressNoteNo',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableCheckAll: false,
                        allowSearchFilter: true
                    };

                    let selectedPressNotes = [];

                    if (sectorData != null) {
                        sectorData.PressNoteId.split(',').forEach(item => {
                            if (item)
                                selectedPressNotes.push({ PressNoteId: parseInt(item), PressNoteNo: this.pressNotes.filter(x => x.PressNoteId == item)[0].PressNoteNo });
                        });

                        this.selectedPressNotes = selectedPressNotes;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SECTOR_DETAIL_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_DETAIL_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    //OnPressNoteChange(pressNoteId: number) {
    //    this.notifications = [];
    //    this.aPDIRCirculars = [];

    //    if (pressNoteId.toString() != 'null') {
    //        this.GetNotification(pressNoteId, null);
    //        this.GetAPDIRCircular(pressNoteId, null);
    //    } else {
    //        this.frmSectorDetail.get("NotificationId").setValue('');
    //        this.frmSectorDetail.updateValueAndValidity();
    //        this.frmSectorDetail.get("APDIRCircularId").setValue('');
    //        this.frmSectorDetail.updateValueAndValidity();
    //    }
    //}

    //GetNotification(pressNoteId, sectorData): void {
    GetNotification(sectorData): void {
        this.spinnerService.show();

        //let getPressNoteNotificationRequest = new GetPressNoteNotificationRequest();
        //getPressNoteNotificationRequest.PressNoteId = pressNoteId;

        let getNotificationRequest = new GetNotificationRequest();

        //this._pressNoteNotificationService.getPressNoteNotification(getPressNoteNotificationRequest)
        this._notificationService.getNotification(getNotificationRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                //this.GetAPDIRCircular(sectorData);

                this.notifications = [];

                if (data.Status == Global.API_SUCCESS) {

                    //this.notifications.push({ NotificationId: null, NotificationNumber: "--Select--", CreatedDate: null, GSRDate: null, GSRNo: null, GSRPDF: null, IsActive: null, IsDeleted: null, ModifiedDate: null, NotificationDate: null, NotificationEffectiveDate: null, NotificationName: null, NotificationPDF: null, NotificationTypeId: null, NotificationTypeName: null, PressNoteId: null, PressNoteNotificationId: null, RegulationId: null, RegulationNumber: null });

                    data.Response.forEach(item => {
                        this.notifications.push({ NotificationId: item.NotificationId, NotificationNumber: item.NotificationNumber, CreatedDate: null, GSRDate: null, GSRNo: null, GSRPDF: null, IsActive: null, IsDeleted: null, ModifiedDate: null, NotificationDate: null, NotificationEffectiveDate: null, NotificationName: null, NotificationPDF: null, NotificationTypeId: null, NotificationTypeName: null, PressNoteId: null, PressNoteNotificationId: null, RegulationId: null, RegulationNumber: item.RegulationNumber });
                    });

                    this.notifications = this.notifications.filter(x => x.RegulationNumber == "FEMA 20(R)/ 2017-RB" || x.RegulationNumber == "FEMA 20/2000-RB" || x.NotificationId == null);

                    this.notificationDropDownSettings = {
                        singleSelection: false,
                        idField: 'NotificationId',
                        textField: 'NotificationNumber',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableCheckAll: false,
                        allowSearchFilter: true
                    };

                    let selectedNotifications = [];

                    if (sectorData != null) {
                        sectorData.NotificationId.split(',').forEach(item => {
                            if (item)
                                selectedNotifications.push({ NotificationId: parseInt(item), NotificationNumber: this.notifications.filter(x => x.NotificationId == item)[0].NotificationNumber });
                        });

                        this.selectedNotifications = selectedNotifications;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SECTOR_DETAIL_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_DETAIL_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    //GetAPDIRCircular(pressNoteId, sectorData): void {
    GetAPDIRCircular(sectorData): void {
        this.spinnerService.show();

        //let getPressNoteAPDIRCircularRequest = new GetPressNoteAPDIRCircularRequest();
        //getPressNoteAPDIRCircularRequest.PressNoteId = pressNoteId;

        let getAPDIRCircularRequest = new GetAPDIRCircularRequest();

        //this._pressNoteAPDIRCircularService.getPressNoteAPDIRCircular(getPressNoteAPDIRCircularRequest)
        this._aPDIRCircularService.getAPDIRCircular(getAPDIRCircularRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                //this.GetSectorDetailYear(sectorData);

                this.aPDIRCirculars = [];

                if (data.Status == Global.API_SUCCESS) {

                    //this.aPDIRCirculars.push({ PressNoteId: null, APDIRCircularId: null, APDIRCircularNo: "--Select--", CreatedDate: null, APDIRCircularDate: null, APDIRCircularEffectiveDate: null, IsActive: null, IsDeleted: null, ModifiedDate: null, APDIRCircularName: null, Year: null, APDIRCircularPDF: null, PressNoteAPDIRCircularId: null });

                    data.Response.forEach(item => {
                        this.aPDIRCirculars.push({ PressNoteId: null, APDIRCircularId: item.APDIRCircularId, APDIRCircularNo: item.APDIRCircularNo + "(" + new DatePipe("en-US").transform(item.APDIRCircularDate, 'dd-MM-yyyy') + ")", CreatedDate: null, APDIRCircularDate: item.APDIRCircularDate, APDIRCircularEffectiveDate: null, IsActive: null, IsDeleted: null, ModifiedDate: null, APDIRCircularName: null, Year: null, APDIRCircularPDF: null, PressNoteAPDIRCircularId: null });
                    });

                    this.aPDIRCircularDropDownSettings = {
                        singleSelection: false,
                        idField: 'APDIRCircularId',
                        textField: 'APDIRCircularNo',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableCheckAll: false,
                        allowSearchFilter: true
                    };

                    let selectedAPDIRCirculars = [];

                    if (sectorData != null) {
                        sectorData.APDIRCircularId.split(',').forEach(item => {
                            if (item)
                                selectedAPDIRCirculars.push({ APDIRCircularId: parseInt(item), APDIRCircularNo: this.aPDIRCirculars.filter(x => x.APDIRCircularId == item)[0].APDIRCircularNo });
                        });

                        this.selectedAPDIRCirculars = selectedAPDIRCirculars;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SECTOR_DETAIL_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_DETAIL_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetSubSector(sectorData): void {
        this.spinnerService.show();

        let getSubSectorRequest = new GetSubSectorRequest();
        getSubSectorRequest.SectorId = this.sectorId;

        this._subSectorService.getSubSector(getSubSectorRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.subSectors = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.subSectors.push({ SubSectorId: null, Name: "--Select--", APDIRCircularNo: null, CreatedDate: null, APDIRCircularId: null, NotificationId: null, IsActive: null, IsDeleted: null, ModifiedDate: null, NotificationNo: null, Year: null, PressNoteId: null, PressNoteNo: null, SectorId: null });

                    data.Response.forEach(item => {
                        this.subSectors.push({ SubSectorId: item.SubSectorId, Name: item.Name, APDIRCircularNo: null, CreatedDate: null, APDIRCircularId: null, NotificationId: null, IsActive: null, IsDeleted: null, ModifiedDate: null, NotificationNo: null, Year: null, PressNoteId: null, PressNoteNo: null, SectorId: null });
                    });

                    this.frmSectorDetail.get("SubSectorId").setValue((sectorData != null) ? sectorData.SubSectorId : sectorData);
                    this.frmSectorDetail.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SECTOR_DETAIL_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_DETAIL_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetSector(sectorId: number) {
        this.spinnerService.show();

        let getSectorRequest = new GetSectorRequest();
        getSectorRequest.SectorId = sectorId;
        getSectorRequest.IsActive = null;

        this._sectorService.getSector(getSectorRequest)
            .subscribe(data => {
                //this.spinnerService.hide();
                this.sector = data.Response[0];
            }, error => this.msg = <any>error);
    }

    EditSectorDetail(sectorDetailId: number) {
        this.spinnerService.show();

        let getSectorDetailRequest = new GetSectorDetailRequest();
        getSectorDetailRequest.SectorDetailId = sectorDetailId;
        getSectorDetailRequest.IsActive = null;

        this._sectorDetailService.getSectorDetail(getSectorDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetSectorDetailYear(data.Response[0]);
                this.GetSubSector(data.Response[0]);
                this.GetPressNote(data.Response[0]);
                this.GetNotification(data.Response[0]);
                this.GetAPDIRCircular(data.Response[0]);

                //this.GetPressNote(data.Response[0]);
                //this.GetSectorDetailYear(data.Response[0]);

                this.frmSectorDetail.setValue({
                    SectorDetailId: sectorDetailId,
                    SectorId: data.Response[0].SectorId,
                    Year: data.Response[0].Year,
                    PressNoteId: [],
                    NotificationId: [],
                    APDIRCircularId: [],
                    SubSectorId: data.Response[0].SubSectorId
                });

                this.frmSectorDetail.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveSectorDetail(formData) {
        this.spinnerService.show();

        if (formData.value.PressNoteId == 'null')
            formData.value.PressNoteId = null;

        if (formData.value.NotificationId == 'null')
            formData.value.NotificationId = null;

        if (formData.value.APDIRCircularId == 'null')
            formData.value.APDIRCircularId = null;

        if (formData.value.SubSectorId == 'null')
            formData.value.SubSectorId = null;

        if (formData.value.SectorDetailId) {
            this._sectorDetailService.updateSectorDetail(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/sectors'], {
                                queryParams: {
                                    indexSector1: params["indexSector1"], indexSector2: params["indexSector2"], sortingSectorField: params["sortingSectorField"], sortingSectorDirection: params["sortingSectorDirection"], sortingSectorDetailField: params["sortingSectorDetailField"], sortingSectorDetailDirection: params["sortingSectorDetailDirection"], sortingSubSectorField: params["sortingSubSectorField"], sortingSubSectorDirection: params["sortingSubSectorDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_SECTOR_DETAIL_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_SECTOR_DETAIL_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_DETAIL_TITLE, { enableHtml: true });
                    });
        } else {
            this._sectorDetailService.addSectorDetail(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/sectors'], {
                                queryParams: {
                                    indexSector1: params["indexSector1"], indexSector2: params["indexSector2"], sortingSectorField: params["sortingSectorField"], sortingSectorDirection: params["sortingSectorDirection"], sortingSectorDetailField: params["sortingSectorDetailField"], sortingSectorDetailDirection: params["sortingSectorDetailDirection"], sortingSubSectorField: params["sortingSubSectorField"], sortingSubSectorDirection: params["sortingSubSectorDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_SECTOR_DETAIL_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_SECTOR_DETAIL_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_DETAIL_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitSectorDetail(formData: any) {
        this.isSubmited = true;

        formData.value.PressNoteId = formData.value.PressNoteId.map(x => x.PressNoteId).join(',');
        formData.value.NotificationId = formData.value.NotificationId.map(x => x.NotificationId).join(',');
        formData.value.APDIRCircularId = formData.value.APDIRCircularId.map(x => x.APDIRCircularId).join(',');

        if (this.frmSectorDetail.valid) {
            this.SaveSectorDetail(formData);
        }
    }

    CancelSectorDetail() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/sectors'], {
                queryParams: {
                    indexSector1: params["indexSector1"], indexSector2: params["indexSector2"], sortingSectorField: params["sortingSectorField"], sortingSectorDirection: params["sortingSectorDirection"], sortingSectorDetailField: params["sortingSectorDetailField"], sortingSectorDetailDirection: params["sortingSectorDetailDirection"], sortingSubSectorField: params["sortingSubSectorField"], sortingSubSectorDirection: params["sortingSubSectorDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}