export class FetersCodeGroupDetail {
    FetersCodeGroupDetailId: number;
    FetersCodeDetailId: number;
    PurposeCode: string;
    Description: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetFetersCodeGroupDetailRequest {
    FetersCodeGroupDetailId: number;
    FetersCodeDetailId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}