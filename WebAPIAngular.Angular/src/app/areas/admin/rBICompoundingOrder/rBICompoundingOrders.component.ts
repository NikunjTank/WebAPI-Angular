import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RBICompoundingOrder, GetRBICompoundingOrderRequest } from '../../../model/rBICompoundingOrder';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { RBICompoundingOrderAdminService } from '../../../service/admin/rBICompoundingOrder.service';


import { ModalDialogService, IModalDialogSettings } from 'ngx-modal-dialog';
import { ContentPopUpAdminComponent } from '../../../areas/admin/contentPopUp/contentPopUp.component';

@Component({
    selector: 'my-app',
    templateUrl: './rBICompoundingOrders.component.html'
})

export class RBICompoundingOrdersAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _rBICompoundingOrderService: RBICompoundingOrderAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router, private modalService: ModalDialogService) { }

    _global: Global = new Global();

    rBICompoundingOrders: RBICompoundingOrder[];
    
    frmRBICompoundingOrder: FormGroup;
    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    pdfServerPath: string = Global.RBI_COMPOUNDING_ORDER_PDF_FILEPATH;
    
    drpPageSize: number;

    sortingRBICompoundingOrderField: string = "OrderDate";
    sortingRBICompoundingOrderDirection: string = "D";
    
    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmRBICompoundingOrder = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetRBICompoundingOrder(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetRBICompoundingOrder(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getRBICompoundingOrderRequest = new GetRBICompoundingOrderRequest();
        getRBICompoundingOrderRequest.SearchText = searchText;
        getRBICompoundingOrderRequest.IsActive = null;
        getRBICompoundingOrderRequest.OrderBy = this.sortingRBICompoundingOrderField;
        getRBICompoundingOrderRequest.OrderByDirection = this.sortingRBICompoundingOrderDirection;
        getRBICompoundingOrderRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getRBICompoundingOrderRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._rBICompoundingOrderService.getRBICompoundingOrder(getRBICompoundingOrderRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.rBICompoundingOrders = data.Response;
                    
                    this.pageSize = getRBICompoundingOrderRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RBI_COMPOUNDING_ORDER_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBI_COMPOUNDING_ORDER_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchRBICompoundingOrder(formData) {
        this.currentPage = 1;
        this.searchText = formData.value.SearchText;
        
        this.GetRBICompoundingOrder(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetRBICompoundingOrder(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.GetRBICompoundingOrder(this.searchText, null, this.pageSize);
    }

    EditRBICompoundingOrder(rBICompoundingOrderId) {
        this.router.navigate(['/admin/secure/rbicompoundingorder/' + this._global.encryptValue(rBICompoundingOrderId)]);
    }
    
    DeleteRBICompoundingOrder(rBICompoundingOrderId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteRBICompoundingOrder = {
                "RBICompoundingOrderId": rBICompoundingOrderId
            };

            this._rBICompoundingOrderService.deleteRBICompoundingOrder(deleteRBICompoundingOrder)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_RBI_COMPOUNDING_ORDER_TITLE, { closeButton: true });
                        this.GetRBICompoundingOrder();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_RBI_COMPOUNDING_ORDER_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBI_COMPOUNDING_ORDER_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }
    
    OnRBICompoundingOrderSort(fieldName) {
        this.sortingRBICompoundingOrderDirection = (this.sortingRBICompoundingOrderField == fieldName) ? (this.sortingRBICompoundingOrderDirection == "A") ? "D" : "A" : "A";
        this.sortingRBICompoundingOrderField = fieldName;
        this.GetRBICompoundingOrder(this.searchText, this.currentPage, this.pageSize);
    }

    ShowContent(title, content) {
        this.modalService.openDialog(this.vcr, {
            title: title,
            childComponent: ContentPopUpAdminComponent,
            data: content
        });
    }
}
