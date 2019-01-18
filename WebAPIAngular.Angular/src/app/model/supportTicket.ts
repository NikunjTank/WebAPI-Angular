export class SupportTicket {
    SupportTicketId: number;
    UserId: number;
    TopicId: number;
    DepartmentId: number;
    DepartmentName: string;
    SubTopicId: number;
    TopicName: string;
    SubTopicName: string;
    QueryTitle: string;
    Query: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetSupportTicketRequest {
    SupportTicketId: number;
    IsCurrentUser: boolean;
    IsForPostQuery: boolean;
    TopicId: number;
    SubTopicId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
    IsPagingRequired: boolean;
}