export class FEMASubModuleOfModule {
    FEMASubModuleOfModuleId: number;
    FEMAModuleId: number;
    FEMASubModuleId: number;
    FEMASubModuleName: string;
    FEMAKeyModuleId: number;
    FEMAKeyModuleName: string;
    FEMAKeyModuleDetail: string;
    FEMAKeyModuleDetailNames: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetFEMASubModuleOfModuleRequest {
    FEMAModuleId: number;
    FEMASubModuleOfModuleId: number;
    PageNumber: number;
    PageSize: number;
}