export class MasterDirectionSubIndex {
    MasterDirectionSubIndexId: number;
    MasterDirectionIndexId: number;
    SubIndexNo: string;
    SubIndexName: string;
    SubIndexContent: string;
    SortId: number;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetMasterDirectionSubIndexRequest {
    MasterDirectionSubIndexId: number;
    MasterDirectionIndexId: number;
    MasterDirectionId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}