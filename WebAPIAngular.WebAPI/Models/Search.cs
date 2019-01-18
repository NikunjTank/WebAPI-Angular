using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class Search
    {
        public string Number { get; set; }
        public string Name { get; set; }
        public string SearchContent { get; set; }
        public string Content { get; set; }
        public string PDF { get; set; }
        public string Excel { get; set; }
        public string Word { get; set; }
        public int? CategoryId { get; set; }
        public string SearchText { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public bool IsPagingRequired { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class GetSearchRequest
    {
        public int? CategoryId { get; set; }
        [Required]
        public string SearchText { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetSearchResponse
    {
        public int? CategoryId { get; set; }
        public string Number { get; set; }
        public string Name { get; set; }
        public string SearchContent { get; set; }
        public string Content { get; set; }
        public string PDF { get; set; }
        public string Excel { get; set; }
        public string Word { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }
}