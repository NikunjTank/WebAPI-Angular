export class FemaIndex {
    IndexId: number;
    RegulationId: number;
    IndexNo: string;
    IndexName: string;
    IndexContent: string;
    SortId: number;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetFemaIndexRequest {
    IndexId: number;
    RegulationId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}