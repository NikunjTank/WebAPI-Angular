export class MasterDirectionIndex {
    MasterDirectionIndexId: number;
    MasterDirectionChapterId: number;
    IndexNo: string;
    IndexName: string;
    IndexContent: string;
    SortId: number;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetMasterDirectionIndexRequest {
    MasterDirectionIndexId: number;
    MasterDirectionChapterId: number;
    MasterDirectionId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}