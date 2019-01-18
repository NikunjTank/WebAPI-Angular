using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class FemaIndex
    {
        public int? IndexId { get; set; }
        public int? RegulationId { get; set; }
        public string IndexNo { get; set; }
        public string IndexName { get; set; }
        public string IndexContent { get; set; }
        public int? SortId { get; set; }
        public int? SaveAfterIndexId { get; set; }
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

    public class GetFemaIndexRequest
    {
        public int? IndexId { get; set; }
        public int? RegulationId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetFemaIndexResponse
    {
        public int IndexId { get; set; }
        public int? RegulationId { get; set; }
        public string IndexNo { get; set; }
        public string IndexName { get; set; }
        public string IndexContent { get; set; }
        public int? SortId { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddFemaIndexRequest
    {
        [Required]
        public int? RegulationId { get; set; }
        [Required]
        public string IndexNo { get; set; }
        [Required]
        public string IndexName { get; set; }
        [Required]
        public string IndexContent { get; set; }
        public int? SaveAfterIndexId { get; set; }
    }

    public class UpdateFemaIndexRequest
    {
        [Required]
        public int IndexId { get; set; }
        [Required]
        public int RegulationId { get; set; }
        [Required]
        public string IndexNo { get; set; }
        [Required]
        public string IndexName { get; set; }
        [Required]
        public string IndexContent { get; set; }
        public int? SaveAfterIndexId { get; set; }
    }

    public class DeleteFemaIndexRequest
    {
        [Required]
        public int IndexId { get; set; }
        [Required]
        public int RegulationId { get; set; }
    }
}