import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { KeyDefinitionEvent, GetKeyDefinitionEventRequest } from '../../../model/keyDefinitionEvent';
import { GetCommonFieldRequest } from '../../../model/commonField';
import { Regulation, GetRegulationRequest } from '../../../model/regulation';
import { Notification, GetNotificationRequest } from '../../../model/notification';
import { Rules, GetRulesRequest } from '../../../model/rules';
import { GSRNotification, GetGSRNotificationRequest } from '../../../model/gSRNotification';
import { FDICircular, GetFDICircularRequest } from '../../../model/fDICircular';
import { PressNote, GetPressNoteRequest } from '../../../model/pressNote';
import { ActName, GetActNameRequest } from '../../../model/actName';
import { MasterDirection, GetMasterDirectionRequest } from '../../../model/masterDirection';
import { APDIRCircular, GetAPDIRCircularRequest } from '../../../model/aPDIRCircular';
import { DropDown } from '../../../common/dropDown';

import { KeyDefinitionEventAdminService } from '../../../service/admin/keyDefinitionEvent.service';
import { CommonFieldService } from '../../../service/common/commonField.service';
import { RegulationAdminService } from '../../../service/admin/regulation.service';
import { NotificationAdminService } from '../../../service/admin/notification.service';
import { RulesAdminService } from '../../../service/admin/rules.service';
import { GSRNotificationAdminService } from '../../../service/admin/gSRNotification.service';
import { FDICircularAdminService } from '../../../service/admin/fDICircular.service';
import { PressNoteAdminService } from '../../../service/admin/pressNote.service';
import { ActNameAdminService } from '../../../service/admin/actName.service';
import { MasterDirectionAdminService } from '../../../service/admin/masterDirection.service';
import { APDIRCircularAdminService } from '../../../service/admin/aPDIRCircular.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './keyEvent.component.html'
})

export class KeyEventAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _keyDefinitionEventService: KeyDefinitionEventAdminService,
        private _commonFieldService: CommonFieldService,
        private _regulationService: RegulationAdminService,
        private _notificationService: NotificationAdminService,
        private _rulesService: RulesAdminService,
        private _gSRNotificationService: GSRNotificationAdminService,
        private _fDICircularService: FDICircularAdminService,
        private _pressNoteService: PressNoteAdminService,
        private _actNameService: ActNameAdminService,
        private _masterDirectionService: MasterDirectionAdminService,
        private _aPDIRCircularService: APDIRCircularAdminService,
        vcr: ViewContainerRef,
        private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    minDate: any = { year: 1970, month: 1, day: 1 };

    keyDefinitionEvent: KeyDefinitionEvent;
    keyDefinitionEventModules: DropDown[] = [];

    nullValue: string = null;

    notifications: DropDown[] = [];
    gSRNotifications: DropDown[] = [];
    fDICirculars: DropDown[] = [];
    pressNotes: DropDown[] = [];
    actNames: DropDown[] = [];
    masterDirections: DropDown[] = [];
    aPDIRCirculars: DropDown[] = [];

    notificationsDropDownSettings = {};
    gSRNotificationsDropDownSettings = {};
    fDICircularsDropDownSettings = {};
    pressNotesDropDownSettings = {};
    actNamesDropDownSettings = {};
    masterDirectionsDropDownSettings = {};
    aPDIRCircularsDropDownSettings = {};

    selectedNotifications: any = [];
    selectedGSRNotifications: any = [];
    selectedFDICirculars: any = [];
    selectedPressNotes: any = [];
    selectedActNames: any = [];
    selectedMasterDirections: any = [];
    selectedAPDIRCirculars: any = [];

    keyDefinitionEventModuleDropDownSettings = {};
    selectedKeyDefinitionEventModules: any = [];
    selectedModuleIds: string[] = [];

    keyDefinitionEventId: number = 0;

    searchText: string = '';
    frmKeyDefinitionEvent: FormGroup;
    msg: string;

    isRegulation: boolean = false;
    isRules: boolean = false;
    isFDICircular: boolean = false;
    isPressNote: boolean = false;
    isAct: boolean = false;
    isMasterDirection: boolean = false;
    isAPDIRCircular: boolean = false;
    isOther: boolean = false;

    addUpdateText: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let keyDefinitionEventId = this._global.decryptValue(params['keyDefinitionEventId']);

            if (keyDefinitionEventId) {
                this.addUpdateText = "Update";

                this.keyDefinitionEventId = parseInt(keyDefinitionEventId);
                this.EditKeyDefinitionEvent(parseInt(keyDefinitionEventId));
            } else {
                this.GetKeyDefinitionEventModule(null);

                this.addUpdateText = "Add";
            }
        });

        this.frmKeyDefinitionEvent = this.formBuilder.group({
            KeyDefinitionEventId: [''],
            DefinitionEventName: [Global.KEY_EVENT_FIELDNAME],
            EventName: ['', Validators.required],
            EventAuthorNote: ['', Validators.required],
            EventDate: ['', Validators.required],
            ModuleIds: ['', Validators.required],
            NotificationIds: [''],
            GSRNotificationIds: [''],
            FDICircularIds: [''],
            PressNoteIds: [''],
            ActIds: [''],
            MasterDirectionIds: [''],
            APDIRCircularIds: ['']
        });
    }

    ClearEventDate() {
        this.frmKeyDefinitionEvent.get("EventDate").setValue("");
        this.frmKeyDefinitionEvent.updateValueAndValidity();
    }

    GetKeyDefinitionEventModule(keyDefinitionEventData): void {
        this.spinnerService.show();

        let getCommonFieldRequest = new GetCommonFieldRequest();
        getCommonFieldRequest.FieldTypeName = Global.COMMON_FIELD_MODULE_NAME;

        this._commonFieldService.getCommonField(getCommonFieldRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.keyDefinitionEventModules = [];

                if (data.Status == Global.API_SUCCESS) {

                    //this.keyDefinitionEventModules.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        if (item.FieldId <= 8)
                            this.keyDefinitionEventModules.push({ Value: item.FieldId, Text: item.FieldName });
                    });

                    //this.frmKeyDefinitionEvent.get("ModuleId").setValue((keyDefinitionEventData != null) ? keyDefinitionEventData.ModuleId : "");
                    //this.frmKeyDefinitionEvent.updateValueAndValidity();

                    this.keyDefinitionEventModuleDropDownSettings = {
                        singleSelection: false,
                        idField: 'Value',
                        textField: 'Text',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableCheckAll: false,
                        allowSearchFilter: true
                    };

                    let selectedKeyDefinitionEventModules = [];

                    if (keyDefinitionEventData != null) {
                        keyDefinitionEventData.ModuleIds.split(',').forEach(item => {
                            if (item)
                                selectedKeyDefinitionEventModules.push({ Value: parseInt(item), Text: this.keyDefinitionEventModules.filter(x => x.Value == item)[0].Text });
                        });

                        this.selectedKeyDefinitionEventModules = selectedKeyDefinitionEventModules;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_KEY_DEFINITION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_KEY_DEFINITION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    onModuleSelect(item: any) {
        this.selectedModuleIds.push(item.Value);
        this.OnModuleChange(null);
    }

    onModuleDeSelect(item: any) {
        this.selectedModuleIds = this.selectedModuleIds.filter(x => x.toString() !== item.Value.toString()).sort();
        this.OnModuleChange(null);
    }

    OnModuleChange(keyDefinitionEventData) {
        if (this.selectedModuleIds.filter(x => x == Global.COMMON_FIELD_REGULATION_FIELDID.toString()).length > 0) {
            if (this.isRegulation != true) {
                this.frmKeyDefinitionEvent.get("NotificationIds").setValidators([Validators.required]);

                this.isRegulation = true;
                this.GetNotification(keyDefinitionEventData);
            }
        } else {
            this.frmKeyDefinitionEvent.get("NotificationIds").setValidators(null);
            this.frmKeyDefinitionEvent.get("NotificationIds").setValue(null);

            this.isRegulation = false;
            this.notifications = [];
        }

        if (this.selectedModuleIds.filter(x => x == Global.COMMON_FIELD_RULES_FIELDID.toString()).length > 0) {
            if (this.isRules != true) {
                this.frmKeyDefinitionEvent.get("GSRNotificationIds").setValidators([Validators.required]);

                this.isRules = true;
                this.GetGSRNotification(keyDefinitionEventData);
            }
        } else {
            this.frmKeyDefinitionEvent.get("GSRNotificationIds").setValidators(null);
            this.frmKeyDefinitionEvent.get("GSRNotificationIds").setValue(null);

            this.isRules = false;
            this.gSRNotifications = [];
        }

        if (this.selectedModuleIds.filter(x => x == Global.COMMON_FIELD_FDICIRCULAR_FIELDID.toString()).length > 0) {
            if (this.isFDICircular != true) {
                this.frmKeyDefinitionEvent.get("FDICircularIds").setValidators([Validators.required]);

                this.isFDICircular = true;
                this.GetFDICircular(keyDefinitionEventData);
            }
        } else {
            this.frmKeyDefinitionEvent.get("FDICircularIds").setValidators(null);
            this.frmKeyDefinitionEvent.get("FDICircularIds").setValue(null);

            this.isFDICircular = false;
            this.fDICirculars = [];
        }

        if (this.selectedModuleIds.filter(x => x == Global.COMMON_FIELD_PRESSNOTE_FIELDID.toString()).length > 0) {
            if (this.isPressNote != true) {
                this.frmKeyDefinitionEvent.get("PressNoteIds").setValidators([Validators.required]);

                this.isPressNote = true;
                this.GetPressNote(keyDefinitionEventData);
            }
        } else {
            this.frmKeyDefinitionEvent.get("PressNoteIds").setValidators(null);
            this.frmKeyDefinitionEvent.get("PressNoteIds").setValue(null);

            this.isPressNote = false;
            this.pressNotes = [];
        }

        if (this.selectedModuleIds.filter(x => x == Global.COMMON_FIELD_ACT_FIELDID.toString()).length > 0) {
            if (this.isAct != true) {
                this.frmKeyDefinitionEvent.get("ActIds").setValidators([Validators.required]);

                this.isAct = true;
                this.GetActName(keyDefinitionEventData);
            }
        } else {
            this.frmKeyDefinitionEvent.get("ActIds").setValidators(null);
            this.frmKeyDefinitionEvent.get("ActIds").setValue(null);

            this.isAct = false;
            this.actNames = [];
        }

        if (this.selectedModuleIds.filter(x => x == Global.COMMON_FIELD_MASTERDIRECTION_FIELDID.toString()).length > 0) {
            if (this.isMasterDirection != true) {
                this.frmKeyDefinitionEvent.get("MasterDirectionIds").setValidators([Validators.required]);

                this.isMasterDirection = true;
                this.GetMasterDirection(keyDefinitionEventData);
            }
        } else {
            this.frmKeyDefinitionEvent.get("MasterDirectionIds").setValidators(null);
            this.frmKeyDefinitionEvent.get("MasterDirectionIds").setValue(null);

            this.isMasterDirection = false;
            this.masterDirections = [];
        }

        if (this.selectedModuleIds.filter(x => x == Global.COMMON_FIELD_APDIRCIRCULAR_FIELDID.toString()).length > 0) {
            if (this.isAPDIRCircular != true) {
                this.frmKeyDefinitionEvent.get("APDIRCircularIds").setValidators([Validators.required]);

                this.isAPDIRCircular = true;
                this.GetAPDIRCircular(keyDefinitionEventData);
            }
        } else {
            this.frmKeyDefinitionEvent.get("APDIRCircularIds").setValidators(null);
            this.frmKeyDefinitionEvent.get("APDIRCircularIds").setValue(null);

            this.isAPDIRCircular = false;
            this.aPDIRCirculars = [];
        }

        this.frmKeyDefinitionEvent.updateValueAndValidity();
    }

    GetNotification(keyDefinitionEventData): void {
        this.spinnerService.show();

        let getNotificationRequest = new GetNotificationRequest();

        this._notificationService.getNotification(getNotificationRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.notifications = [];

                if (data.Status == Global.API_SUCCESS) {

                    //this.notifications.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.notifications.push({ Value: item.NotificationId, Text: item.NotificationNumber });
                    });

                    //this.frmKeyDefinitionEvent.get("NotificationId").setValue((keyDefinitionEventData != null) ? keyDefinitionEventData.NotificationId : "");
                    //this.frmKeyDefinitionEvent.updateValueAndValidity();

                    this.notificationsDropDownSettings = {
                        singleSelection: false,
                        idField: 'Value',
                        textField: 'Text',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableCheckAll: false,
                        allowSearchFilter: true
                    };

                    let selectedNotifications = [];

                    if (keyDefinitionEventData != null) {
                        keyDefinitionEventData.NotificationIds.split(',').forEach(item => {
                            if (item)
                                selectedNotifications.push({ Value: parseInt(item), Text: this.notifications.filter(x => x.Value == item)[0].Text });
                        });

                        this.selectedNotifications = selectedNotifications;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_KEY_DEFINITION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_KEY_DEFINITION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetGSRNotification(keyDefinitionEventData): void {
        this.spinnerService.show();

        let getGSRNotificationRequest = new GetGSRNotificationRequest();

        this._gSRNotificationService.getGSRNotification(getGSRNotificationRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.gSRNotifications = [];

                if (data.Status == Global.API_SUCCESS) {

                    //this.gSRNotifications.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.gSRNotifications.push({ Value: item.GSRNotificationId, Text: item.GSRNotificationNo });
                    });

                    //this.frmKeyDefinitionEvent.get("GSRNotificationId").setValue((keyDefinitionEventData != null) ? keyDefinitionEventData.GSRNotificationId : "");
                    //this.frmKeyDefinitionEvent.updateValueAndValidity();

                    this.gSRNotificationsDropDownSettings = {
                        singleSelection: false,
                        idField: 'Value',
                        textField: 'Text',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableCheckAll: false,
                        allowSearchFilter: true
                    };

                    let selectedGSRNotifications = [];

                    if (keyDefinitionEventData != null) {
                        keyDefinitionEventData.GSRNotificationIds.split(',').forEach(item => {
                            if (item)
                                selectedGSRNotifications.push({ Value: parseInt(item), Text: this.gSRNotifications.filter(x => x.Value == item)[0].Text });
                        });

                        this.selectedGSRNotifications = selectedGSRNotifications;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_KEY_DEFINITION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_KEY_DEFINITION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetFDICircular(keyDefinitionEventData): void {
        this.spinnerService.show();

        let getFDICircularRequest = new GetFDICircularRequest();

        this._fDICircularService.getFDICircular(getFDICircularRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.fDICirculars = [];

                if (data.Status == Global.API_SUCCESS) {

                    //this.fDICirculars.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.fDICirculars.push({ Value: item.FDICircularId, Text: item.FDICircularName });
                    });

                    //this.frmKeyDefinitionEvent.get("FDICircularId").setValue((keyDefinitionEventData != null) ? keyDefinitionEventData.FDICircularId : "");
                    //this.frmKeyDefinitionEvent.updateValueAndValidity();

                    this.fDICircularsDropDownSettings = {
                        singleSelection: false,
                        idField: 'Value',
                        textField: 'Text',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableCheckAll: false,
                        allowSearchFilter: true
                    };

                    let selectedFDICirculars = [];

                    if (keyDefinitionEventData != null) {
                        keyDefinitionEventData.FDICircularIds.split(',').forEach(item => {
                            if (item)
                                selectedFDICirculars.push({ Value: parseInt(item), Text: this.fDICirculars.filter(x => x.Value == item)[0].Text });
                        });

                        this.selectedFDICirculars = selectedFDICirculars;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_KEY_DEFINITION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_KEY_DEFINITION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetPressNote(keyDefinitionEventData): void {
        this.spinnerService.show();

        let getPressNoteRequest = new GetPressNoteRequest();

        this._pressNoteService.getPressNote(getPressNoteRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.pressNotes = [];

                if (data.Status == Global.API_SUCCESS) {

                    //this.pressNotes.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.pressNotes.push({ Value: item.PressNoteId, Text: item.PressNoteNo });
                    });

                    //this.frmKeyDefinitionEvent.get("PressNoteId").setValue((keyDefinitionEventData != null) ? keyDefinitionEventData.PressNoteId : "");
                    //this.frmKeyDefinitionEvent.updateValueAndValidity();

                    this.pressNotesDropDownSettings = {
                        singleSelection: false,
                        idField: 'Value',
                        textField: 'Text',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableCheckAll: false,
                        allowSearchFilter: true
                    };

                    let selectedPressNotes = [];

                    if (keyDefinitionEventData != null) {
                        keyDefinitionEventData.PressNoteIds.split(',').forEach(item => {
                            if (item)
                                selectedPressNotes.push({ Value: parseInt(item), Text: this.pressNotes.filter(x => x.Value == item)[0].Text });
                        });

                        this.selectedPressNotes = selectedPressNotes;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_KEY_DEFINITION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_KEY_DEFINITION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetActName(keyDefinitionEventData): void {
        this.spinnerService.show();

        let getActNameRequest = new GetActNameRequest();

        this._actNameService.getActName(getActNameRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.actNames = [];

                if (data.Status == Global.API_SUCCESS) {

                    //this.actNames.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.actNames.push({ Value: item.ActId, Text: item.LongTitle });
                    });

                    //this.frmKeyDefinitionEvent.get("ActId").setValue((keyDefinitionEventData != null) ? keyDefinitionEventData.ActId : "");
                    //this.frmKeyDefinitionEvent.updateValueAndValidity();

                    this.actNamesDropDownSettings = {
                        singleSelection: false,
                        idField: 'Value',
                        textField: 'Text',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableCheckAll: false,
                        allowSearchFilter: true
                    };

                    let selectedActNames = [];

                    if (keyDefinitionEventData != null) {
                        keyDefinitionEventData.ActIds.split(',').forEach(item => {
                            if (item)
                                selectedActNames.push({ Value: parseInt(item), Text: this.actNames.filter(x => x.Value == item)[0].Text });
                        });

                        this.selectedActNames = selectedActNames;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_KEY_DEFINITION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_KEY_DEFINITION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetMasterDirection(keyDefinitionEventData): void {
        this.spinnerService.show();

        let getMasterDirectionRequest = new GetMasterDirectionRequest();

        this._masterDirectionService.getMasterDirection(getMasterDirectionRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.masterDirections = [];

                if (data.Status == Global.API_SUCCESS) {

                    //this.masterDirections.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.masterDirections.push({ Value: item.MasterDirectionId, Text: item.MasterDirectionName });
                    });

                    //this.frmKeyDefinitionEvent.get("MasterDirectionId").setValue((keyDefinitionEventData != null) ? keyDefinitionEventData.MasterDirectionId : "");
                    //this.frmKeyDefinitionEvent.updateValueAndValidity();

                    this.masterDirectionsDropDownSettings = {
                        singleSelection: false,
                        idField: 'Value',
                        textField: 'Text',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableCheckAll: false,
                        allowSearchFilter: true
                    };

                    let selectedMasterDirections = [];

                    if (keyDefinitionEventData != null) {
                        keyDefinitionEventData.MasterDirectionIds.split(',').forEach(item => {
                            if (item)
                                selectedMasterDirections.push({ Value: parseInt(item), Text: this.masterDirections.filter(x => x.Value == item)[0].Text });
                        });

                        this.selectedMasterDirections = selectedMasterDirections;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_KEY_DEFINITION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_KEY_DEFINITION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetAPDIRCircular(keyDefinitionEventData): void {
        this.spinnerService.show();

        let getAPDIRCircularRequest = new GetAPDIRCircularRequest();

        this._aPDIRCircularService.getAPDIRCircular(getAPDIRCircularRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.aPDIRCirculars = [];

                if (data.Status == Global.API_SUCCESS) {

                    //this.aPDIRCirculars.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.aPDIRCirculars.push({ Value: item.APDIRCircularId, Text: item.APDIRCircularNo + (item.APDIRCircularDate ? (' (' + (new DatePipe('en-US').transform(item.APDIRCircularDate, 'dd-MM-yyyy')) + ')') : '') });
                    });

                    //this.frmKeyDefinitionEvent.get("APDIRCircularId").setValue((keyDefinitionEventData != null) ? keyDefinitionEventData.APDIRCircularId : "");
                    //this.frmKeyDefinitionEvent.updateValueAndValidity();

                    this.aPDIRCircularsDropDownSettings = {
                        singleSelection: false,
                        idField: 'Value',
                        textField: 'Text',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableCheckAll: false,
                        allowSearchFilter: true
                    };

                    let selectedAPDIRCirculars = [];

                    if (keyDefinitionEventData != null) {
                        keyDefinitionEventData.APDIRCircularIds.split(',').forEach(item => {
                            if (item)
                                selectedAPDIRCirculars.push({ Value: parseInt(item), Text: this.aPDIRCirculars.filter(x => x.Value == item)[0].Text });
                        });

                        this.selectedAPDIRCirculars = selectedAPDIRCirculars;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_KEY_DEFINITION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_KEY_DEFINITION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditKeyDefinitionEvent(keyDefinitionEventId: number) {
        this.spinnerService.show();

        let getKeyDefinitionEventRequest = new GetKeyDefinitionEventRequest();
        getKeyDefinitionEventRequest.KeyDefinitionEventId = keyDefinitionEventId;
        getKeyDefinitionEventRequest.DefinitionEventName = Global.KEY_EVENT_FIELDNAME;
        getKeyDefinitionEventRequest.IsActive = null;

        this._keyDefinitionEventService.getKeyDefinitionEvent(getKeyDefinitionEventRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetKeyDefinitionEventModule(data.Response[0]);
                data.Response[0].ModuleIds.split(',').forEach(item => {
                    this.selectedModuleIds.push(item);
                });

                this.OnModuleChange(data.Response[0]);

                let eventDate = new Date(data.Response[0].EventDate);

                this.frmKeyDefinitionEvent.setValue({
                    KeyDefinitionEventId: keyDefinitionEventId,
                    DefinitionEventName: Global.KEY_EVENT_FIELDNAME,
                    EventName: data.Response[0].EventName,
                    EventAuthorNote: data.Response[0].EventAuthorNote,
                    EventDate: { year: eventDate.getFullYear(), month: eventDate.getMonth() + 1, day: eventDate.getDate() },
                    ModuleIds: [],
                    NotificationIds: [],
                    GSRNotificationIds: [],
                    FDICircularIds: [],
                    PressNoteIds: [],
                    ActIds: [],
                    MasterDirectionIds: [],
                    APDIRCircularIds: []
                });

                this.frmKeyDefinitionEvent.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveKeyDefinitionEvent(formData) {
        this.spinnerService.show();

        formData.value.EventDate = (formData.value.EventDate != null) ? formData.value.EventDate.year + "/" + formData.value.EventDate.month + "/" + formData.value.EventDate.day : null;

        if (formData.value.KeyDefinitionEventId) {
            this._keyDefinitionEventService.updateKeyDefinitionEvent(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/keyevents']).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_KEY_EVENT_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_KEY_EVENT_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_KEY_EVENT_TITLE, { enableHtml: true });
                    });
        } else {
            this._keyDefinitionEventService.addKeyDefinitionEvent(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/keyevents']).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_KEY_EVENT_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_KEY_EVENT_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_KEY_EVENT_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitKeyDefinitionEvent(formData: any) {
        this.isSubmited = true;
        
        if (this.frmKeyDefinitionEvent.valid) {
            formData.value.ModuleIds = this._global.convertArrayToCommaSeperatedString(formData.value.ModuleIds);
            formData.value.NotificationIds = this._global.convertArrayToCommaSeperatedString(formData.value.NotificationIds);
            formData.value.GSRNotificationIds = this._global.convertArrayToCommaSeperatedString(formData.value.GSRNotificationIds);
            formData.value.FDICircularIds = this._global.convertArrayToCommaSeperatedString(formData.value.FDICircularIds);
            formData.value.PressNoteIds = this._global.convertArrayToCommaSeperatedString(formData.value.PressNoteIds);
            formData.value.ActIds = this._global.convertArrayToCommaSeperatedString(formData.value.ActIds);
            formData.value.MasterDirectionIds = this._global.convertArrayToCommaSeperatedString(formData.value.MasterDirectionIds);
            formData.value.APDIRCircularIds = this._global.convertArrayToCommaSeperatedString(formData.value.APDIRCircularIds);

            this.SaveKeyDefinitionEvent(formData);
        }
    }

    CancelKeyDefinitionEvent() {
        this.router.navigate(['/admin/secure/keyevents']);
    }
}
