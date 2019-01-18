using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class Regulation
    {
        public int? RegulationId { get; set; }
        public string RegulationName { get; set; }
        public string RegulationNumber { get; set; }
        public string Year { get; set; }
        public DateTime? PublicationDate { get; set; }
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

    public class GetRegulationRequest
    {
        public int? RegulationId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetRegulationResponse
    {
        public int? RegulationId { get; set; }
        public string RegulationName { get; set; }
        public string RegulationNumber { get; set; }
        public string Year { get; set; }
        public DateTime? PublicationDate { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddRegulationRequest
    {
        [Required]
        public string RegulationName { get; set; }
        [Required]
        public string RegulationNumber { get; set; }
        [Required]
        public string Year { get; set; }
        [Required]
        public DateTime PublicationDate { get; set; }
    }

    public class UpdateRegulationRequest
    {
        [Required]
        public int RegulationId { get; set; }
        [Required]
        public string RegulationName { get; set; }
        [Required]
        public string RegulationNumber { get; set; }
        [Required]
        public string Year { get; set; }
        [Required]
        public DateTime PublicationDate { get; set; }
    }

    public class DeleteRegulationRequest
    {
        [Required]
        public int RegulationId { get; set; }
    }
}