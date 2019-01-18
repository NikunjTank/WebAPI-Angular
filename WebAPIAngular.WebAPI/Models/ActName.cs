using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class ActName
    {
        public int? ActId { get; set; }
        public string LongTitle { get; set; }
        public string ShortTitle { get; set; }
        public string ActPDF { get; set; }
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
    }

    public class GetActNameRequest
    {
        public int? ActId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetActNameResponse
    {
        public int ActId { get; set; }
        public string LongTitle { get; set; }
        public string ActPDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddActNameRequest
    {
        [Required]
        public string LongTitle { get; set; }
        [Required]
        public string ActPDF { get; set; }
    }

    public class UpdateActNameRequest
    {
        [Required]
        public int ActId { get; set; }
        [Required]
        public string LongTitle { get; set; }
        [Required]
        public string ActPDF { get; set; }
    }

    public class DeleteActNameRequest
    {
        [Required]
        public int ActId { get; set; }
    }
}