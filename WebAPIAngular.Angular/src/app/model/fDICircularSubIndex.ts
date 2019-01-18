export class FDICircularSubIndex {
    FDICircularSubIndexId: number;
    FDICircularIndexId: number;
    SubIndexNo: string;
    SubIndexName: string;
    SubIndexContent: string;
    SortId: number;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetFDICircularSubIndexRequest {
    FDICircularSubIndexId: number;
    FDICircularIndexId: number;
    FDICircularId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}