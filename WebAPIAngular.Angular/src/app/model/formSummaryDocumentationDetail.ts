export class FormSummaryDocumentationDetail {
    FormSummaryDocumentationDetailId: number;
    FormSummaryDocumentationId: number;
    FormName: string;
    WordFileName: string;
    ExcelFileName: string;
    PDFFileName: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetFormSummaryDocumentationDetailRequest {
    FormSummaryDocumentationDetailId: number;
    FormSummaryDocumentationId: number;
    SubMenuName: string;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}