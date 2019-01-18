export class FDICircularIndex {
    FDICircularIndexId: number;
    FDIChapterId: number;
    IndexNo: string;
    IndexName: string;
    IndexContent: string;
    SortId: number;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetFDICircularIndexRequest {
    FDICircularIndexId: number;
    FDIChapterId: number;
    FDICircularId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}