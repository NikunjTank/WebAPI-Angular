export class RBIDataDetail {
    RBIDataDetailId: number;
    Month: number;
    Year: number;
    Excel: string;
    PDF: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetRBIDataDetailRequest {
    RBIDataDetailId: number;
    RBIDataId: number;
    Year: number;
    Month: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}