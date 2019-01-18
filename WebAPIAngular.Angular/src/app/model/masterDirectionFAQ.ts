export class MasterDirectionFAQ {
    MasterDirectionFAQId: number;
    MasterDirectionId: number;
    FAQId: number;
    TopicName: string;
    CategoryName: string;
    PDF: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetMasterDirectionFAQRequest {
    MasterDirectionFAQId: number;
    MasterDirectionId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}