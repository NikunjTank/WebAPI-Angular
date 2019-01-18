export class DIPPClarification {
    DIPPClarificationId: number;
    ClarificationTopic: string;
    PDF: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetDIPPClarificationRequest {
    DIPPClarificationId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}