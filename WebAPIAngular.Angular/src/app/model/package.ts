export class Package {
    PackageId: number;
    PackageTypeId: number;
    PackageTypeName: string;
    PackageName: string;
    Days: number;
    PackageDuration: number;
    Amount: number;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetPackageRequest {
    PackageId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
    IsPagingRequired: boolean;
}