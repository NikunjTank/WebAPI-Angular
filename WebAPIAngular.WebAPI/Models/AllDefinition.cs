using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class AllDefinition
    {
        public int? Id { get; set; }
        public int? ActId { get; set; }
        public string DefinitionName { get; set; }
        public string FullDInsertion { get; set; }
        public string AuthorNote { get; set; }
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

    public class GetAllDefinitionRequest
    {
        public int? Id { get; set; }
        public int? ActId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetAllDefinitionResponse
    {
        public int Id { get; set; }
        public int? ActId { get; set; }
        public string DefinitionName { get; set; }
        public string FullDInsertion { get; set; }
        public string AuthorNote { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddAllDefinitionRequest
    {
        [Required]
        public int? ActId { get; set; }
        [Required]
        public string DefinitionName { get; set; }
        [Required]
        public string FullDInsertion { get; set; }
        public string AuthorNote { get; set; }
    }

    public class UpdateAllDefinitionRequest
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public int? ActId { get; set; }
        [Required]
        public string DefinitionName { get; set; }
        [Required]
        public string FullDInsertion { get; set; }
        public string AuthorNote { get; set; }
    }

    public class DeleteAllDefinitionRequest
    {
        [Required]
        public int Id { get; set; }
    }
}