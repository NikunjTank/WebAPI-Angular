export class RBIFAQOfFEMASubModuleDetail {
    FAQId: number;
    CategoryName: string;
    TopicName: string;
    PDF: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetRBIFAQOfFEMASubModuleDetailRequest {
    FEMASubModuleOfModuleId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}