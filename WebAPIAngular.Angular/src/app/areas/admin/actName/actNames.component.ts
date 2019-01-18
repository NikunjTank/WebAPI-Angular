import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActName, GetActNameRequest } from '../../../model/actName';
import { AllDefinition, GetAllDefinitionRequest } from '../../../model/allDefinition';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ActNameAdminService } from '../../../service/admin/actName.service';
import { AllDefinitionAdminService } from '../../../service/admin/allDefinition.service';


import { ModalDialogService } from 'ngx-modal-dialog';
import { ContentPopUpAdminComponent } from '../../../areas/admin/contentPopUp/contentPopUp.component';

@Component({
    selector: 'my-app',
    templateUrl: './actNames.component.html'
})

export class ActNamesAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _actNameService: ActNameAdminService, private _allDefinitionService: AllDefinitionAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router, private modalService: ModalDialogService) { }

    _global: Global = new Global();

    actNames: ActName[];
    actName: ActName;

    allDefinitions: AllDefinition[];
    actId: number;

    frmActName: FormGroup;
    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    pdfServerPath: string = Global.ACT_PDF_FILEPATH;

    itemDetailActs = { index: -1 };
    indexAct: number = -1;

    drpPageSize: number;

    sortingActNameField: string;
    sortingActNameDirection: string;

    sortingDefinitionField: string;
    sortingDefinitionDirection: string;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.indexAct = (params["indexAct"]) ? parseInt(params["indexAct"]) : -1;

            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;

            this.sortingActNameField = params["sortingActNameField"];
            this.sortingActNameDirection = params["sortingActNameDirection"];
            this.sortingDefinitionField = params["sortingDefinitionField"];
            this.sortingDefinitionDirection = params["sortingDefinitionDirection"];
        });


        this.frmActName = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetActName(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetActName(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getActNameRequest = new GetActNameRequest();
        getActNameRequest.SearchText = searchText;
        getActNameRequest.IsActive = null;
        getActNameRequest.OrderBy = this.sortingActNameField;
        getActNameRequest.OrderByDirection = this.sortingActNameDirection;
        getActNameRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getActNameRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._actNameService.getActName(getActNameRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.actNames = data.Response;

                    if (this.indexAct != -1) {
                        this.itemDetailActs.index = this.indexAct;
                        this.GetAllDefinitions(this.itemDetailActs.index, this.actNames[this.itemDetailActs.index].ActId, true);
                    }

                    this.pageSize = getActNameRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_ACTNAME_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_ACTNAME_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchAct(formData) {
        this.indexAct = -1;

        this.itemDetailActs.index = this.indexAct;

        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.ReloadPage(false);
        this.GetActName(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.ReloadPage(true);
        this.GetActName(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.ReloadPage(false);
        this.GetActName(this.searchText, null, this.pageSize);
    }

    EditActName(actId) {
        this.router.navigate(['/admin/secure/actname/' + this._global.encryptValue(actId)], {
            queryParams: {
                indexAct: this.indexAct, sortingActNameField: this.sortingActNameField, sortingActNameDirection: this.sortingActNameDirection, sortingDefinitionField: this.sortingDefinitionField, sortingDefinitionDirection: this.sortingDefinitionDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddDefinition(actId, index) {
        this.router.navigate(['/admin/secure/alldefinition/' + this._global.encryptValue(actId)], {
            queryParams: {
                indexAct: this.indexAct, sortingActNameField: this.sortingActNameField, sortingActNameDirection: this.sortingActNameDirection, sortingDefinitionField: this.sortingDefinitionField, sortingDefinitionDirection: this.sortingDefinitionDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditDefinition(actId, id) {
        this.router.navigate(['/admin/secure/alldefinition/' + this._global.encryptValue(actId) + '/' + this._global.encryptValue(id)], {
            queryParams: {
                indexAct: this.indexAct, sortingActNameField: this.sortingActNameField, sortingActNameDirection: this.sortingActNameDirection, sortingDefinitionField: this.sortingDefinitionField, sortingDefinitionDirection: this.sortingDefinitionDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    ReloadPage(isPageChange) {
        if (isPageChange == true) {
            this.indexAct = -1;

            this.itemDetailActs.index = this.indexAct;
        }

        this.router.navigate(['/admin/secure/actnames'], {
            queryParams: {
                indexAct: this.indexAct, sortingActNameField: this.sortingActNameField, sortingActNameDirection: this.sortingActNameDirection, sortingDefinitionField: this.sortingDefinitionField, sortingDefinitionDirection: this.sortingDefinitionDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    DeleteActName(actId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteActName = {
                "ActId": actId
            };

            this._actNameService.deleteActName(deleteActName)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_ACTNAME_TITLE, { closeButton: true });
                        this.GetActName();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_ACTNAME_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_ACTNAME_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteDefinition(actId: number, id: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteDefinition = {
                "Id": id
            };

            this._allDefinitionService.deleteAllDefinition(deleteDefinition)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_ACTNAME_TITLE, { closeButton: true });
                        this.GetAllDefinitions(this.itemDetailActs.index, actId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_ACTNAME_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_ACTNAME_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    UpDownActArrow(index) {
        if (index === this.itemDetailActs.index) {
            this.itemDetailActs.index = null;
        } else {
            this.itemDetailActs.index = index;
        }
    }

    GetAllDefinitions(index, actId, isDeleted): void {
        this.spinnerService.show();

        let getAllDefinitionRequest = new GetAllDefinitionRequest();
        getAllDefinitionRequest.ActId = actId;
        getAllDefinitionRequest.IsActive = null;
        getAllDefinitionRequest.OrderBy = this.sortingDefinitionField;
        getAllDefinitionRequest.OrderByDirection = this.sortingDefinitionDirection;
        getAllDefinitionRequest.PageNumber = 1;
        getAllDefinitionRequest.PageSize = 100000;

        this._allDefinitionService.getAllDefinition(getAllDefinitionRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.allDefinitions = data.Response;

                    if (isDeleted != true) {
                        this.UpDownActArrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_ACTNAME_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_ACTNAME_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    ShowAllDefinition(index, actId) {
        this.indexAct = -1;
        this.actId = null;

        if (this.itemDetailActs.index !== index) {
            if (actId) {
                this.actId = actId;
                this.indexAct = index;
                this.GetAllDefinitions(index, actId, false);
            }
        } else {
            this.UpDownActArrow(index);
        }
        this.ReloadPage(false);
    }

    ShowContent(title, content) {
        this.modalService.openDialog(this.vcr, {
            title: title,
            childComponent: ContentPopUpAdminComponent,
            data: content
        });
    }

    OnActNameSort(fieldName) {
        this.sortingActNameDirection = (this.sortingActNameField == fieldName) ? (this.sortingActNameDirection == "A") ? "D" : "A" : "A";
        this.sortingActNameField = fieldName;
        this.ReloadPage(true);
        this.GetActName(this.searchText, this.currentPage, this.pageSize);
    }

    OnDefinitionSort(actId, fieldName) {
        this.sortingDefinitionDirection = (this.sortingDefinitionField == fieldName) ? (this.sortingDefinitionDirection == "A") ? "D" : "A" : "A";
        this.sortingDefinitionField = fieldName;
        this.ReloadPage(false);
        this.GetAllDefinitions(this.itemDetailActs.index, actId, true);
    }
}
