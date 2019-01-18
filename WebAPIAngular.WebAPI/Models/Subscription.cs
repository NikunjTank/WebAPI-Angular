using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class Subscription
    {
        public int? SubscriptionId { get; set; }
        public int? UserId { get; set; }
        public string UserName { get; set; }
        public int? PackageId { get; set; }
        public string PackageName { get; set; }
        public string SubscriptionStatus { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? PaymentDate { get; set; }
        public decimal Amount { get; set; }
        public bool? IsExpired { get; set; }
        public bool IsPending { get; set; }
        public bool IsCanceled { get; set; }
        public DateTime? CancellationDate { get; set; }
        public DateTime? ActivationDate { get; set; }
        public int ModifiedBy { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
        public bool IsPagingRequired { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
        public int Result { get; set; }
        public bool IsMailSentToUser { get; set; }
        public bool IsMailSentToAdmin { get; set; }
    }

    public class GetSubscriptionRequest
    {
        public int? SubscriptionId { get; set; }
        public int? UserId { get; set; }
        public int? PackageId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetSubscriptionResponse
    {
        public int SubscriptionId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public int PackageId { get; set; }
        public string PackageName { get; set; }
        public string SubscriptionStatus { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? PaymentDate { get; set; }
        public decimal Amount { get; set; }
        public bool IsExpired { get; set; }
        public bool IsPending { get; set; }
        public bool IsCanceled { get; set; }
        public DateTime? CancellationDate { get; set; }
        public DateTime? ActivationDate { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddSubscriptionRequest
    {
        [Required]
        public int PackageId { get; set; }
    }

    public class UpdateSubscriptionRequest
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public int SubscriptionId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? PaymentDate { get; set; }
        public bool IsExpired { get; set; }
        public bool IsActive { get; set; }

    }

    public class SubscriptionHistory
    {
        public int? SubscriptionHistoryId { get; set; }
        public bool IsMailSentToUser { get; set; }
        public bool IsMailSentToAdmin { get; set; }
        public int ModifiedBy { get; set; }
        public int Result { get; set; }

    }
}