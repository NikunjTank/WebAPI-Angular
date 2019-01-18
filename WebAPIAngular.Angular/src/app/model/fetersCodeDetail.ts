export class FetersCodeDetail {
    FetersCodeDetailId: number;
    FetersCodeId: number;
    GroupNo: string;
    PurposeGroupName: string;
    SerialNo: string;
    LRSItem: string;
    LRSFetersCode: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetFetersCodeDetailRequest {
    FetersCodeDetailId: number;
    FetersCodeId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}