using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using DemystifyFema.Service.Repository;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;

namespace DemystifyFema.Service.Controllers.Admin
{
    [Authorize(Roles = "Admin")]
    [RoutePrefix("admin/api")]
    public class FAQCategoryAdminController : ApiController
    {
        private IFAQCategory iFAQCategory;
        public FAQCategoryAdminController()
        {
            try
            {
                iFAQCategory = new FAQCategoryRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FAQCategoryAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("faqcategories")]
        [ResponseType(typeof(List<GetFAQCategoryResponse>))]
        public IHttpActionResult GetFAQCategory([FromUri]GetFAQCategoryRequest getFAQCategoryRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFAQCategoryRequest == null)
                    getFAQCategoryRequest = new GetFAQCategoryRequest();

                if (getFAQCategoryRequest.PageSize == null)
                    getFAQCategoryRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fAQCategory = new FAQCategory()
                {
                    FAQCategoryId = getFAQCategoryRequest.FAQCategoryId,
                    SearchText = getFAQCategoryRequest.SearchText,
                    IsActive = getFAQCategoryRequest.IsActive,
                    PageNumber = getFAQCategoryRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFAQCategoryRequest.PageSize),
                    IsPagingRequired = (getFAQCategoryRequest.PageNumber != null) ? true : false,
                    OrderBy = getFAQCategoryRequest.OrderBy,
                    OrderByDirection = getFAQCategoryRequest.OrderByDirection
                };
                var fAQCategorys = iFAQCategory.GetFAQCategory(fAQCategory);

                var fAQCategoryList = new List<GetFAQCategoryResponse>();
                foreach (var fAQCategoryDetail in fAQCategorys)
                {
                    fAQCategoryList.Add(new GetFAQCategoryResponse()
                    {
                        FAQCategoryId = Convert.ToInt32(fAQCategoryDetail.FAQCategoryId),
                        CategoryName = fAQCategoryDetail.CategoryName,
                        IsActive = Convert.ToBoolean(fAQCategoryDetail.IsActive),
                        CreatedBy = fAQCategoryDetail.CreatedBy,
                        TotalPageCount = fAQCategoryDetail.TotalPageCount,
                        TotalRecord = fAQCategoryDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FAQCategory retrieved successfully";
                responses.Response = fAQCategoryList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving faqcategory.";

                Utility.WriteLog("GetFAQCategory", getFAQCategoryRequest, "Error while retrieving faqcategory. (FAQCategoryAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        
        [HttpPost]
        [Route("faqcategories/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddFAQCategory(AddFAQCategoryRequest addFAQCategoryRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var fAQCategory = new FAQCategory()
                {
                    CategoryName = addFAQCategoryRequest.CategoryName
                };
                int result = iFAQCategory.AddFAQCategory(fAQCategory);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "FAQCategory added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "FAQCategory alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding faqcategory.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding faqcategory.";

                Utility.WriteLog("AddFAQCategory", addFAQCategoryRequest, "Error while adding faqcategory. (FAQCategoryAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("faqcategories/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateFAQCategory(UpdateFAQCategoryRequest updateFAQCategoryRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fAQCategory = new FAQCategory()
                {
                    FAQCategoryId = updateFAQCategoryRequest.FAQCategoryId,
                    CategoryName = updateFAQCategoryRequest.CategoryName,
                    ModifiedBy = Utility.UserId
                };
                int result = iFAQCategory.UpdateFAQCategory(fAQCategory);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FAQCategory updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FAQCategory already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FAQCategory doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating faqcategory.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating admin profile.";

                Utility.WriteLog("UpdateFAQCategory", updateFAQCategoryRequest, "Error while updating faqcategory. (FAQCategoryAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("faqcategories/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteFAQCategory(DeleteFAQCategoryRequest deleteFAQCategoryRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fAQCategory = new FAQCategory()
                {
                    FAQCategoryId = deleteFAQCategoryRequest.FAQCategoryId,
                    ModifiedBy = Utility.UserId
                };

                int result = iFAQCategory.DeleteFAQCategory(fAQCategory);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FAQCategory deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FAQCategory doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting faqcategory.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting faqcategory.";

                Utility.WriteLog("DeleteFAQCategory", deleteFAQCategoryRequest, "Error while deleting faqcategory. (FAQCategoryAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
