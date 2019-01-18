export class SupportTicketSubTopic {
    SupportTicketSubTopicId: number;
    FEMAModuleId: number;
    SupportTicketSubTopicName: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetSupportTicketSubTopicRequest {
    SupportTicketSubTopicId: number;
    FEMAModuleId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
    IsPagingRequired: boolean;
}