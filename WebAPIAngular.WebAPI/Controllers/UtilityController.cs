using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using DemystifyFema.Service.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace DemystifyFema.Service.Controllers
{
    //[Authorize(Roles = "Admin, User")]
    [AllowAnonymous]
    [RoutePrefix("common/api")]
    public class UtilityController : ApiController
    {
        private ICommonField iCommonField;
        private ILatestNews iLatestNews;
        private ISearch iSearch;
        public UtilityController()
        {
            try
            {
                iCommonField = new CommonFieldRepository();
                iLatestNews = new LatestNewsRepository();
                iSearch = new SearchRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("UtilityController (Admin, User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("commonfields")]
        [ResponseType(typeof(List<GetCommonFieldResponse>))]
        public IHttpActionResult GetCommonField([FromUri]GetCommonFieldRequest getCommonFieldRequest)
        {
            var responses = new Responses();
            try
            {
                //if (Utility.UserId < 0)
                //    return BadRequest(Utility.INVALID_USER);

                var commonField = new CommonField()
                {
                    FieldTypeName = getCommonFieldRequest.FieldTypeName,
                    SearchText = getCommonFieldRequest.SearchText
                };
                var commonFields = iCommonField.GetCommonField(commonField);

                var commonFieldList = new List<GetCommonFieldResponse>();
                foreach (var commonFieldDetail in commonFields)
                {
                    commonFieldList.Add(new GetCommonFieldResponse()
                    {
                        FieldId = commonFieldDetail.FieldId,
                        FieldName = commonFieldDetail.FieldName,
                        Alias = commonFieldDetail.Alias
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "CommonField retrieved successfully";
                responses.Response = commonFieldList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving CommonField.";

                Utility.WriteLog("GetCommonField", null, "Error while retrieving CommonField. (UtilityController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("latestnews")]
        [ResponseType(typeof(List<GetLatestNewsResponse>))]
        public IHttpActionResult GetLatestNews()
        {
            var responses = new Responses();
            try
            {
                var latestNews = iLatestNews.GetLatestNews();

                var latestNewsList = new List<GetLatestNewsResponse>();
                foreach (var latestNewsDetail in latestNews)
                {
                    latestNewsList.Add(new GetLatestNewsResponse()
                    {
                        CategoryId = latestNewsDetail.CategoryId,
                        Number = latestNewsDetail.Number,
                        Name = latestNewsDetail.Name,
                        PDF = latestNewsDetail.PDF
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "LatesNews retrieved successfully";
                responses.Response = latestNewsList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving LatesNews.";

                Utility.WriteLog("GetLatestNews", null, "Error while retrieving LatesNews. (UtilityController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("searches")]
        [ResponseType(typeof(List<GetSearchResponse>))]
        public IHttpActionResult GetSearchData([FromUri]GetSearchRequest getSearchRequest)
        {
            var responses = new Responses();
            try
            {
                SpellingAutoCorrect spellingAutoCorrect = new SpellingAutoCorrect();
                string correctSearchText = "";

                foreach (var item in getSearchRequest.SearchText.Split(' '))
                {
                    correctSearchText += " " + (new Regex("^[a-zA-Z0-9 ]*$").IsMatch(item) ? spellingAutoCorrect.Correct(item) : Regex.Replace(item, @"[^0-9a-zA-Z]+", ""));
                }

                var search = new Search()
                {
                    CategoryId = getSearchRequest.CategoryId,
                    SearchText = correctSearchText,
                    PageNumber = getSearchRequest.PageNumber,
                    PageSize = Convert.ToInt32(getSearchRequest.PageSize),
                    IsPagingRequired = (getSearchRequest.PageNumber != null) ? true : false,
                    OrderBy = getSearchRequest.OrderBy,
                    OrderByDirection = getSearchRequest.OrderByDirection
                };
                var searches = iSearch.GetSearchData(search);

                var searchList = new List<GetSearchResponse>();
                foreach (var searchDetail in searches)
                {
                    searchList.Add(new GetSearchResponse()
                    {
                        CategoryId = searchDetail.CategoryId,
                        Number = searchDetail.Number,
                        Name = searchDetail.Name,
                        Content = searchDetail.Content,
                        PDF = searchDetail.PDF,
                        Excel = searchDetail.Excel,
                        Word = searchDetail.Word,
                        TotalPageCount = searchDetail.TotalPageCount,
                        TotalRecord = searchDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "Search data retrieved successfully";
                responses.Response = searchList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving Search data.";

                Utility.WriteLog("GetSearchData", null, "Error while retrieving Search data. (UtilityController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("autocompletesearches")]
        [ResponseType(typeof(List<GetSearchResponse>))]
        public IHttpActionResult GetSearchAutoCompleteData([FromUri]GetSearchRequest getSearchRequest)
        {
            var responses = new Responses();
            try
            {
                SpellingAutoCorrect spellingAutoCorrect = new SpellingAutoCorrect();
                string correctSearchText = "";

                foreach (var item in getSearchRequest.SearchText.Split(' '))
                {
                    correctSearchText += " " + (new Regex("^[a-zA-Z0-9 ]*$").IsMatch(item) ? spellingAutoCorrect.Correct(item) : Regex.Replace(item, @"[^0-9a-zA-Z]+", "")) ;
                }

                var search = new Search()
                {
                    SearchText = correctSearchText
                };
                var searches = iSearch.GetSearchAutoCompleteData(search);

                var searchList = new List<GetSearchResponse>();
                foreach (var searchDetail in searches)
                {
                    searchList.Add(new GetSearchResponse()
                    {
                        SearchContent = searchDetail.SearchContent
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "Search AutoComplete data retrieved successfully";
                responses.Response = searchList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving Search AutoComplete data.";

                Utility.WriteLog("GetSearchAutoCompleteData", null, "Error while retrieving Search AutoComplete data. (UtilityController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
