import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FEMASubModuleOfModule, GetFEMASubModuleOfModuleRequest } from '../../../model/fEMASubModuleOfModule';
import { GetCommonFieldRequest } from '../../../model/commonField';
import { RBIData, GetRBIDataRequest } from '../../../model/rBIData';

import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { CommonFieldService } from '../../../service/common/commonField.service';

import { ModalDialogService } from 'ngx-modal-dialog';

import { FEMASubModuleOfModuleUserService } from '../../../service/user/fEMASubModuleOfModule.service';
import { RBIDataUserService } from '../../../service/user/rBIData.service';

import { GetSubscriptionRequest } from '../../../model/subscription';
import { SubscriptionUserService } from '../../../service/user/subscription.service';

import { RegulationPopupUserComponent } from '../../../areas/user/fEMAModule/regulationPopup.component';
import { AuthorsWriteupPopupUserComponent } from '../../../areas/user/fEMAModule/authorsWriteupPopup.component';
import { ActPopupUserComponent } from '../../../areas/user/fEMAModule/actPopup.component';
import { MasterDirectionPopupUserComponent } from '../../../areas/user/fEMAModule/masterDirectionPopup.component';
import { FDICircularPopupUserComponent } from '../../../areas/user/fEMAModule/fDICircularPopup.component';
import { NICCodePopupUserComponent } from '../../../areas/user/fEMAModule/nICCodePopup.component';
import { FetersCodePopupUserComponent } from '../../../areas/user/fEMAModule/fetersCodePopup.component';
import { FormSummaryDocumentationPopupUserComponent } from '../../../areas/user/fEMAModule/formSummaryDocumentationPopup.component';
import { ManualPopupUserComponent } from '../../../areas/user/fEMAModule/manualPopup.component';
import { FIPBReviewPopupUserComponent } from '../../../areas/user/fEMAModule/fIPBReviewPopup.component';
import { RBIDIPPFAQPopupUserComponent } from '../../../areas/user/fEMAModule/rBIDIPPFAQPopup.component';
import { RBIECBPopupUserComponent } from '../../../areas/user/fEMAModule/rBIECBPopup.component';
import { RBIODIPopupUserComponent } from '../../../areas/user/fEMAModule/rBIODIPopup.component';
import { RBICompoundingOrderPopupUserComponent } from '../../../areas/user/fEMAModule/rBICompoundingOrderPopup.component';
import { KeyDefinitionPopupUserComponent } from '../../../areas/user/fEMAModule/keyDefinitionPopup.component';
import { KeyEventPopupUserComponent } from '../../../areas/user/fEMAModule/keyEventPopup.component';
import { SectorSnapshotPopupUserComponent } from '../../../areas/user/fEMAModule/sectorSnapshotPopup.component';
import { FDIPenaltyCalculatorPopupUserComponent } from '../../../areas/user/fEMAModule/fDIPenaltyCalculatorPopup.component';
import { ECBAverageMaturityCalculatorPopupUserComponent } from '../../../areas/user/fEMAModule/eCBAverageMaturityCalculatorPopup.component';
import { CompoundingPenaltyCalculatorPopupUserComponent } from '../../../areas/user/fEMAModule/compoundingPenaltyCalculatorPopup.component';
import { LOBOPOEligibilityCalculatorPopupUserComponent } from '../../../areas/user/fEMAModule/lOBOPOEligibilityCalculatorPopup.component';
import { SubscriptionPopupUserComponent } from '../../../areas/user/subscription/subscriptionPopup.component';

@Component({
    selector: 'my-app',
    templateUrl: './fEMAModules.component.html'
})

export class FEMAModulesUserComponent implements OnInit {

    constructor(
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private _fEMASubModuleOfModuleService: FEMASubModuleOfModuleUserService,
        private _rBIDataService: RBIDataUserService,
        private _commonFieldService: CommonFieldService,
        private toastr: ToastrService,
        private vcr: ViewContainerRef,
        private spinnerService: SpinnerService,
        private _subscriptionService: SubscriptionUserService,
        private router: Router,
        private modalService: ModalDialogService) { }

    _global: Global = new Global();

    fEMAModules: any;
    fEMASubModules: any;

    fEMASubModuleOfModules: FEMASubModuleOfModule[];
    rBIDatas: RBIData[];
    fEMASubModuleIds: number[] = [];
    fEMAModuleId: number = 1;

    rBIDataExcelServerPath: string = Global.RBIDATA_EXCEL_FILEPATH;
    msg: string;

    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            this.fEMAModuleId = (params["fEMAModuleId"]) ? parseInt(params["fEMAModuleId"]) : this.fEMAModuleId;
            this.CheckIsSubscribed();
        });
    }

    CheckIsSubscribed() {
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
                    this.pageSizes = Global.PAGE_SIZES;

                    this.activatedRoute.queryParams.subscribe(params => {
                        this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
                        this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
                    });

                    this.GetFEMAModule(this.currentPage, this.pageSizes[0]);
                } else {
                    this.OpenSubscribePopup();
                }
            }, error => this.msg = <any>error);
    }

    OpenSubscribePopup() {
        let t_this = this;
        this.modalService.openDialog(this.vcr, {
            settings: {
                headerClass: "hide",
                footerClass: "no-pad",
                contentClass: "subscribe-modal-content modal-content"
            },
            actionButtons: [{
                text: "x", buttonClass: "pointer-cursor close-button", onAction() {
                    t_this.router.navigate(['/user/secure/subscription']);
                }
            }],
            childComponent: SubscriptionPopupUserComponent
        });
    }

    GetFEMAModule(pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getCommonFieldRequest = new GetCommonFieldRequest();
        getCommonFieldRequest.FieldTypeName = Global.COMMON_FIELD_FEMA_MODULE;

        this._commonFieldService.getCommonField(getCommonFieldRequest)
            .subscribe(data => {
                this.GetFEMASubModule(this.currentPage, this.pageSizes[0]);

                this.fEMAModules = data.Response;
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FEMA_MODULE_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetFEMASubModule(pageNumber?: number, pageSize?: number): void {
        let getCommonFieldRequest = new GetCommonFieldRequest();
        getCommonFieldRequest.FieldTypeName = Global.COMMON_FIELD_FEMA_SUBMODULE;

        this._commonFieldService.getCommonField(getCommonFieldRequest)
            .subscribe(data => {
                this.GetFEMASubModuleOfModule(this.currentPage, this.pageSizes[0]);

                this.fEMASubModules = data.Response;
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FEMA_MODULE_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetFEMASubModuleOfModule(pageNumber?: number, pageSize?: number): void {
        let getFEMASubModuleOfModuleRequest = new GetFEMASubModuleOfModuleRequest();
        getFEMASubModuleOfModuleRequest.FEMAModuleId = this.fEMAModuleId;

        this._fEMASubModuleOfModuleService.getFEMASubModuleOfModule(getFEMASubModuleOfModuleRequest)
            .subscribe(data => {
                this.GetRBIData();

                this.fEMASubModuleIds = [];

                data.Response.forEach(item => {
                    this.fEMASubModuleIds.push(item.FEMASubModuleId);
                });

                this.fEMASubModuleOfModules = data.Response;
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FEMA_MODULE_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    //OnClickModule(fEMAModuleId) {
    //    this.spinnerService.show();
    //    this.GetFEMASubModuleOfModule(fEMAModuleId, this.currentPage, this.pageSizes[0]);
    //}

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetFEMAModule(pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = 50;
        this.GetFEMAModule(null, this.pageSize);
    }

    GetRBIData(): void {
        let getRBIDataRequest = new GetRBIDataRequest();

        this._rBIDataService.getRBIData(getRBIDataRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.rBIDatas = data.Response;
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBIDATA_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    ShowReadMorePopup(subModuleId, subModuleName) {
        let fEMASubModuleOfModule = this.fEMASubModuleOfModules.filter(x => x.FEMASubModuleId == subModuleId)[0];
        let fEMASubModuleOfModuleId = fEMASubModuleOfModule.FEMASubModuleOfModuleId;
        let fEMAModuleId = fEMASubModuleOfModule.FEMAModuleId;
        let fEMASubModuleId = fEMASubModuleOfModule.FEMASubModuleId;

        if (subModuleId == Global.COMMON_FIELD_MODULE_FEMA_REGULATIONS_FEMA_NOTIFICATIONS_GSR) {
            this.modalService.openDialog(this.vcr, {
                settings: {
                    headerClass: "hide",
                    footerClass: "no-pad"
                },
                actionButtons: [{
                    text: "x", buttonClass: "pointer-cursor close-button"
                }],
                childComponent: RegulationPopupUserComponent,
                data: fEMASubModuleOfModuleId
            });
        }
        else if (subModuleId == Global.COMMON_FIELD_MODULE_AUTHORSWRITEUP) {
            this.modalService.openDialog(this.vcr, {
                settings: {
                    headerClass: "hide",
                    footerClass: "no-pad"
                },
                actionButtons: [{
                    text: "x", buttonClass: "pointer-cursor close-button"
                }],
                childComponent: AuthorsWriteupPopupUserComponent,
                data: fEMAModuleId
            });
        }
        else if (subModuleId == Global.COMMON_FIELD_MODULE_FOREIGNEXCHANGEMANAGEMENTACT) {
            this.modalService.openDialog(this.vcr, {
                settings: {
                    headerClass: "hide",
                    footerClass: "no-pad"
                },
                actionButtons: [{
                    text: "x", buttonClass: "pointer-cursor close-button"
                }],
                childComponent: ActPopupUserComponent
            });
        }
        else if (subModuleId == Global.COMMON_FIELD_MODULE_MASTERDIRECTION_MASTERCIRCULAR_APDIRCIRCULAR) {
            this.modalService.openDialog(this.vcr, {
                settings: {
                    headerClass: "hide",
                    footerClass: "no-pad"
                },
                actionButtons: [{
                    text: "x", buttonClass: "pointer-cursor close-button"
                }],
                childComponent: MasterDirectionPopupUserComponent,
                data: fEMASubModuleOfModuleId
            });
        }
        else if (subModuleId == Global.COMMON_FIELD_MODULE_FDICIRCULAR_PRESSNOTE) {
            this.modalService.openDialog(this.vcr, {
                settings: {
                    headerClass: "hide",
                    footerClass: "no-pad"
                },
                actionButtons: [{
                    text: "x", buttonClass: "pointer-cursor close-button"
                }],
                childComponent: FDICircularPopupUserComponent,
                data: fEMASubModuleOfModuleId
            });
        }
        else if (subModuleId == Global.COMMON_FIELD_MODULE_NICCODE) {
            this.modalService.openDialog(this.vcr, {
                settings: {
                    headerClass: "hide",
                    footerClass: "no-pad"
                },
                actionButtons: [{
                    text: "x", buttonClass: "pointer-cursor close-button"
                }],
                childComponent: NICCodePopupUserComponent
            });
        }
        else if (subModuleId == Global.COMMON_FIELD_MODULE_FETERSCODE) {
            this.modalService.openDialog(this.vcr, {
                settings: {
                    headerClass: "hide",
                    footerClass: "no-pad"
                },
                actionButtons: [{
                    text: "x", buttonClass: "pointer-cursor close-button"
                }],
                childComponent: FetersCodePopupUserComponent
            });
        }
        else if (subModuleId == Global.COMMON_FIELD_MODULE_FORM_SUMMARY_DOCUMENTATION) {
            this.modalService.openDialog(this.vcr, {
                settings: {
                    headerClass: "hide",
                    footerClass: "no-pad"
                },
                actionButtons: [{
                    text: "x", buttonClass: "pointer-cursor close-button"
                }],
                childComponent: FormSummaryDocumentationPopupUserComponent
            });
        }
        else if (subModuleId == Global.COMMON_FIELD_MODULE_MANUAL) {
            this.modalService.openDialog(this.vcr, {
                settings: {
                    headerClass: "hide",
                    footerClass: "no-pad"
                },
                actionButtons: [{
                    text: "x", buttonClass: "pointer-cursor close-button"
                }],
                childComponent: ManualPopupUserComponent
            });
        }
        else if (subModuleId == Global.COMMON_FIELD_MODULE_FIPBREVIEW_CLARIFICATION_FIBCPRESSRELEASECASE) {
            this.modalService.openDialog(this.vcr, {
                settings: {
                    headerClass: "hide",
                    footerClass: "no-pad"
                },
                actionButtons: [{
                    text: "x", buttonClass: "pointer-cursor close-button"
                }],
                childComponent: FIPBReviewPopupUserComponent
            });
        }
        else if (subModuleId == Global.COMMON_FIELD_MODULE_RBI_LO_DATA) {
            let rBIDataLOData = this.rBIDatas.filter(x => x.RBIDataName == Global.RBIDATA_LO_NAME);
            if (rBIDataLOData.length > 0)
                window.location.href = this.rBIDataExcelServerPath + rBIDataLOData[0].Excel;
        }
        else if (subModuleId == Global.COMMON_FIELD_MODULE_RBI_BO_DATA) {
            let rBIDataBOData = this.rBIDatas.filter(x => x.RBIDataName == Global.RBIDATA_BO_NAME);
            if (rBIDataBOData.length > 0)
                window.location.href = this.rBIDataExcelServerPath + rBIDataBOData[0].Excel;
        }
        //else if (subModuleId == Global.COMMON_FIELD_MODULE_RBI_DIPP_FAQ) {
        //    this.modalService.openDialog(this.vcr, {
        //        settings: {
        //            headerClass: "hide"
        //        },
        //        actionButtons: [{
        //            text: "x", buttonClass: "pointer-cursor close-button"
        //        }],
        //        childComponent: RBIDIPPFAQPopupUserComponent,
        //        data: fEMASubModuleOfModuleId
        //    });
        //}
        else if (subModuleId == Global.COMMON_FIELD_MODULE_RBI_ECB_DATA) {
            this.modalService.openDialog(this.vcr, {
                settings: {
                    headerClass: "hide",
                    footerClass: "no-pad"
                },
                actionButtons: [{
                    text: "x", buttonClass: "pointer-cursor close-button"
                }],
                childComponent: RBIECBPopupUserComponent
            });
        }
        else if (subModuleId == Global.COMMON_FIELD_MODULE_RBI_ODI_DATA) {
            this.modalService.openDialog(this.vcr, {
                settings: {
                    headerClass: "hide",
                    footerClass: "no-pad"
                },
                actionButtons: [{
                    text: "x", buttonClass: "pointer-cursor close-button"
                }],
                childComponent: RBIODIPopupUserComponent
            });
        }
        else if (subModuleId == Global.COMMON_FIELD_MODULE_RBI_COMPOUNDING_ORDER) {
            this.modalService.openDialog(this.vcr, {
                settings: {
                    headerClass: "hide",
                    footerClass: "no-pad"
                },
                actionButtons: [{
                    text: "x", buttonClass: "pointer-cursor close-button"
                }],
                childComponent: RBICompoundingOrderPopupUserComponent
            });
        }
        else if (subModuleId == Global.COMMON_FIELD_MODULE_KEYDEFINITION) {
            this.modalService.openDialog(this.vcr, {
                settings: {
                    headerClass: "hide",
                    footerClass: "no-pad"
                },
                actionButtons: [{
                    text: "x", buttonClass: "pointer-cursor close-button"
                }],
                childComponent: KeyDefinitionPopupUserComponent
            });
        }
        else if (subModuleId == Global.COMMON_FIELD_MODULE_KEYEVENT) {
            this.modalService.openDialog(this.vcr, {
                settings: {
                    headerClass: "hide",
                    footerClass: "no-pad"
                },
                actionButtons: [{
                    text: "x", buttonClass: "pointer-cursor close-button"
                }],
                childComponent: KeyEventPopupUserComponent
            });
        }
        else if (subModuleId == Global.COMMON_FIELD_MODULE_SECTOR_SNAPSHOT) {
            this.modalService.openDialog(this.vcr, {
                settings: {
                    headerClass: "hide",
                    footerClass: "no-pad"
                },
                actionButtons: [{
                    text: "x", buttonClass: "pointer-cursor close-button"
                }],
                childComponent: SectorSnapshotPopupUserComponent
            });
        }
        else if (subModuleId == Global.COMMON_FIELD_MODULE_FDI_PENALTY_CALCULATOR) {
            this.modalService.openDialog(this.vcr, {
                settings: {
                    headerClass: "hide",
                    footerClass: "no-pad"
                },
                actionButtons: [{
                    text: "x", buttonClass: "pointer-cursor close-button"
                }],
                childComponent: FDIPenaltyCalculatorPopupUserComponent
            });
        }
        else if (subModuleId == Global.COMMON_FIELD_MODULE_ECB_AVERAGE_MATURITY_CALCULATOR) {
            this.modalService.openDialog(this.vcr, {
                settings: {
                    headerClass: "hide",
                    footerClass: "no-pad"
                },
                actionButtons: [{
                    text: "x", buttonClass: "pointer-cursor close-button"
                }],
                childComponent: ECBAverageMaturityCalculatorPopupUserComponent
            });
        }
        else if (subModuleId == Global.COMMON_FIELD_MODULE_COMPOUNDING_CALCULATOR) {
            this.modalService.openDialog(this.vcr, {
                settings: {
                    headerClass: "hide",
                    footerClass: "no-pad"
                },
                actionButtons: [{
                    text: "x", buttonClass: "pointer-cursor close-button"
                }],
                childComponent: CompoundingPenaltyCalculatorPopupUserComponent
            });
        }
        else if (subModuleId == Global.COMMON_FIELD_MODULE_LO_BO_PO_ELIGIBILITY_CALCULATOR) {
            this.modalService.openDialog(this.vcr, {
                settings: {
                    headerClass: "hide",
                    footerClass: "no-pad"
                },
                actionButtons: [{
                    text: "x", buttonClass: "pointer-cursor close-button"
                }],
                childComponent: LOBOPOEligibilityCalculatorPopupUserComponent
            });
        }
    }
}
