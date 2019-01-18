export class SupportTicketReply {
    SupportTicketId: number;
    SupportTicketReplyId: number;
    UserId: number;
    CurrentUserId: number;
    QueryReply: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetSupportTicketReplyRequest {
    SupportTicketId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
    IsPagingRequired: boolean;
}