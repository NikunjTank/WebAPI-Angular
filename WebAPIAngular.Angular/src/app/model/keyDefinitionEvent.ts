export class KeyDefinitionEvent {
    KeyDefinitionEventId: number;
    ModuleName: string;
    DefinitionName: string;
    DefinitionAuthorNote: string;
    DefinitionContent: string;
    EventName: string;
    EventDate: Date;
    EventAuthorNote: string;
    RegulationId: number;
    NotificationId: number;
    RulesId: number;
    GSRNotificationId: number;
    FDICircularId: number;
    Year: number;
    PressNoteId: number;
    ActId: number;
    MasterDirectionId: number;
    APDIRCircularId: number;
    RegulationNumber: string;
    RegulationName: string;
    NotificationNumber: string;
    NotificationName: string;
    RulesNo: string;
    RulesName: string;
    GSRNotificationNo: string;
    GSRNotificationName: string;
    FDICircularName: string;
    PressNoteNo: string;
    PressNoteName: string;
    ActLongTitle: string;
    MasterDirectionName: string;
    APDIRCircularNo: string;
    APDIRCircularName: string;
    DefinitionEventName: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetKeyDefinitionEventRequest {
    KeyDefinitionEventId: number;
    DefinitionEventName: string;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}