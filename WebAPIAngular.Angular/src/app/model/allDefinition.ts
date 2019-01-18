export class AllDefinition {
    Id: number;
    ActId: number;
    DefinitionName: string;
    FullDInsertion: string;
    AuthorNote: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetAllDefinitionRequest {
    Id: number;
    ActId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}