export class FormSummaryDocumentation {
    FormSummaryDocumentationId: number;
    TopicName: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetFormSummaryDocumentationRequest {
    FormSummaryDocumentationId: number;
    SubMenuName: string;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}