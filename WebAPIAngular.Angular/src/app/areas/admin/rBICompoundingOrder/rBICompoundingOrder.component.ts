import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RBICompoundingOrder, GetRBICompoundingOrderRequest } from '../../../model/rBICompoundingOrder';
import { RBICompoundingOrderAdminService } from '../../../service/admin/rBICompoundingOrder.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './rBICompoundingOrder.component.html'
})

export class RBICompoundingOrderAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _rBICompoundingOrderService: RBICompoundingOrderAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    rBICompoundingOrder: RBICompoundingOrder;
    rBICompoundingOrderId: number = 0;
    searchText: string = '';
    frmRBICompoundingOrder: FormGroup;
    msg: string;
    files: any;

    addUpdateText: string;

    pdfServerPath: string = Global.RBI_COMPOUNDING_ORDER_PDF_FILEPATH;
    rBICompoundingOrderPDFName: string;

    isSubmited: boolean = false;

    minDate: any = { year: 1970, month: 1, day: 1 };

    ngOnInit(): void {
        this.frmRBICompoundingOrder = this.formBuilder.group({
            RBICompoundingOrderId: [''],
            ApplicantName: ['', Validators.required],
            OrderGist: ['', Validators.required],
            Topic: ['', Validators.required],
            FEMRegulationRuleNo: ['', Validators.required],
            OrderDate: ['', Validators.required],
            PenaltyAmount: ['', Validators.required],
            Regional_CentralOfficeOfRBI: ['', Validators.required],
            PDF: ['', Validators.required]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let rBICompoundingOrderId = this._global.decryptValue(params['rBICompoundingOrderId']);

            if (rBICompoundingOrderId) {
                this.addUpdateText = "Update";
                this.rBICompoundingOrderId = parseInt(rBICompoundingOrderId);
                this.EditRBICompoundingOrder(parseInt(rBICompoundingOrderId));
            } else {
                this.addUpdateText = "Add";
            }
        });
    }

    fileChange(event: any) {
        this.files = event.target.files;

        if (this.files[0].type == "application/pdf") {
            this.frmRBICompoundingOrder.get('PDF').setValue(this.files[0].name);
            this.frmRBICompoundingOrder.updateValueAndValidity();
        } else {
            this.frmRBICompoundingOrder.get('PDF').setValue(null);
            this.frmRBICompoundingOrder.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_RBI_COMPOUNDING_ORDER_TITLE, { closeButton: true });
        }
    }

    EditRBICompoundingOrder(rBICompoundingOrderId: number) {
        this.spinnerService.show();

        let getRBICompoundingOrderRequest = new GetRBICompoundingOrderRequest();
        getRBICompoundingOrderRequest.RBICompoundingOrderId = rBICompoundingOrderId;
        getRBICompoundingOrderRequest.IsActive = null;

        this._rBICompoundingOrderService.getRBICompoundingOrder(getRBICompoundingOrderRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.rBICompoundingOrderPDFName = data.Response[0].PDF;

                let orderDate = new Date(data.Response[0].OrderDate);

                this.frmRBICompoundingOrder.setValue({
                    RBICompoundingOrderId: rBICompoundingOrderId,
                    ApplicantName: data.Response[0].ApplicantName,
                    OrderGist: data.Response[0].OrderGist,
                    Topic: data.Response[0].Topic,
                    FEMRegulationRuleNo: data.Response[0].FEMRegulationRuleNo,
                    OrderDate: { year: orderDate.getFullYear(), month: orderDate.getMonth() + 1, day: orderDate.getDate() },
                    PenaltyAmount: data.Response[0].PenaltyAmount,
                    Regional_CentralOfficeOfRBI: data.Response[0].Regional_CentralOfficeOfRBI,
                    PDF: data.Response[0].PDF
                });

                this.frmRBICompoundingOrder.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveRBICompoundingOrder(formData) {
        this.spinnerService.show();

        formData.value.OrderDate = (formData.value.OrderDate != null) ? formData.value.OrderDate.year + "/" + formData.value.OrderDate.month + "/" + formData.value.OrderDate.day : null;
        
        if (formData.value.RBICompoundingOrderId) {
            this._rBICompoundingOrderService.updateRBICompoundingOrder(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.router.navigate(['/admin/secure/rbicompoundingorders']).then(() => {
                            this.toastr.success(data.Description, Global.TOASTR_ADMIN_RBI_COMPOUNDING_ORDER_TITLE, { closeButton: true });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_RBI_COMPOUNDING_ORDER_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBI_COMPOUNDING_ORDER_TITLE, { enableHtml: true });
                    });
        } else {
            this._rBICompoundingOrderService.addRBICompoundingOrder(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.router.navigate(['/admin/secure/rbicompoundingorders']).then(() => {
                            this.toastr.success(data.Description, Global.TOASTR_ADMIN_RBI_COMPOUNDING_ORDER_TITLE, { closeButton: true });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_RBI_COMPOUNDING_ORDER_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBI_COMPOUNDING_ORDER_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    ClearDate() {
        this.frmRBICompoundingOrder.get("OrderDate").setValue("");
        this.frmRBICompoundingOrder.updateValueAndValidity();
    }

    OnSubmitRBICompoundingOrder(formData: any) {
        this.isSubmited = true;

        if (this.frmRBICompoundingOrder.valid) {
            this.spinnerService.show();

            if (this.files != null && this.files.length > 0) {
                let fileFormData: FormData = new FormData();
                for (var i = 0; i < this.files.length; i++) {
                    fileFormData.append(this.files[i].name, this.files[i]);
                }

                this._rBICompoundingOrderService.fileUpload(fileFormData)
                    .subscribe(response => {
                        if (response.Status == "Success") {
                            this.frmRBICompoundingOrder.get('PDF').setValue(response.Response);
                            this.frmRBICompoundingOrder.updateValueAndValidity();
                            formData.value.PDF = response.Response;
                            this.files = null;

                            this.SaveRBICompoundingOrder(formData);
                        } else {
                            this.spinnerService.hide();
                            this.toastr.error(response.Description, Global.TOASTR_ADMIN_RBI_COMPOUNDING_ORDER_TITLE, { enableHtml: true, closeButton: true });
                        }
                    },
                        error => {
                            this.spinnerService.hide();
                            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBI_COMPOUNDING_ORDER_TITLE, { enableHtml: true, closeButton: true });
                        });
            } else {
                if (formData.value.PDF) {
                    this.SaveRBICompoundingOrder(formData);
                } else {
                    this.spinnerService.hide();
                }
            }
        }
    }

    CancelRBICompoundingOrder() {
        this.router.navigate(['/admin/secure/rbicompoundingorders']);
    }
}
