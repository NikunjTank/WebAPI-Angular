using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using DemystifyFema.Service.Repository;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace DemystifyFema.Service.Controllers.Admin
{
    [Authorize(Roles = "Admin")]
    [RoutePrefix("admin/api")]
    public class FAQAdminController : ApiController
    {
        private IFAQ iFAQ;
        public FAQAdminController()
        {
            try
            {
                iFAQ = new FAQRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FAQAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("faqs")]
        [ResponseType(typeof(List<GetFAQResponse>))]
        public IHttpActionResult GetFAQ([FromUri]GetFAQRequest getFAQRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFAQRequest == null)
                    getFAQRequest = new GetFAQRequest();

                if (getFAQRequest.PageSize == null)
                    getFAQRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fAQ = new FAQ()
                {
                    FAQId = getFAQRequest.FAQId,
                    SearchText = getFAQRequest.SearchText,
                    IsActive = getFAQRequest.IsActive,
                    PageNumber = getFAQRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFAQRequest.PageSize),
                    IsPagingRequired = (getFAQRequest.PageNumber != null) ? true : false,
                    OrderBy = getFAQRequest.OrderBy,
                    OrderByDirection = getFAQRequest.OrderByDirection
                };
                var fAQs = iFAQ.GetFAQ(fAQ);

                var fAQList = new List<GetFAQResponse>();
                foreach (var fAQDetail in fAQs)
                {
                    fAQList.Add(new GetFAQResponse()
                    {
                        FAQId = Convert.ToInt32(fAQDetail.FAQId),
                        CategoryId = Convert.ToInt32(fAQDetail.CategoryId),
                        CategoryName = fAQDetail.CategoryName,
                        TopicName = fAQDetail.TopicName,
                        PDF = fAQDetail.PDF,
                        IsActive = Convert.ToBoolean(fAQDetail.IsActive),
                        CreatedBy = fAQDetail.CreatedBy,
                        TotalPageCount = fAQDetail.TotalPageCount,
                        TotalRecord = fAQDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FAQ retrieved successfully";
                responses.Response = fAQList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving FAQ.";

                Utility.WriteLog("GetFAQ", getFAQRequest, "Error while retrieving FAQ. (FAQAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Upload Files
        [HttpPost]
        [Route("faqs/uploadfiles")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UploadFiles()
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count <= 0)
                    return BadRequest(Utility.FILE_NOT_AVAILABLE);

                string fileName = string.Empty;

                var file = httpRequest.Files[0];
                fileName = DateTime.Now.ToString("ddMMyyyyhhmmssfff") + "_" + file.FileName;
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FAQPDFPath"]), fileName);
                file.SaveAs(fileSavePath);

                if (!string.IsNullOrEmpty(fileName))
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "File uploaded successfully.";
                    responses.Response = fileName;
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while uploading file.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while uploading file.";

                Utility.WriteLog("UploadFile", null, "Error while uploading file. (FAQAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("faqs/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddFAQ(AddFAQRequest addFAQRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var fAQ = new FAQ()
                {
                    CategoryId = addFAQRequest.CategoryId,
                    TopicName = addFAQRequest.TopicName,
                    PDF = addFAQRequest.PDF,
                    CreatedBy = Utility.UserId
                };
                int result = iFAQ.AddFAQ(fAQ);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "FAQ added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "FAQ alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding FAQ.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding FAQ.";

                Utility.WriteLog("AddFAQ", addFAQRequest, "Error while adding FAQ. (FAQAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("faqs/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateFAQ(UpdateFAQRequest updateFAQRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fAQ = new FAQ()
                {
                    FAQId = updateFAQRequest.FAQId,
                    CategoryId = updateFAQRequest.CategoryId,
                    TopicName = updateFAQRequest.TopicName,
                    PDF = updateFAQRequest.PDF,
                    ModifiedBy = Utility.UserId
                };
                int result = iFAQ.UpdateFAQ(fAQ);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FAQ updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FAQ already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FAQ doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating FAQ.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating FAQ.";

                Utility.WriteLog("UpdateFAQ", updateFAQRequest, "Error while updating FAQ. (FAQAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("faqs/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteFAQ(DeleteFAQRequest deleteFAQRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fAQ = new FAQ()
                {
                    FAQId = deleteFAQRequest.FAQId,
                    ModifiedBy = Utility.UserId
                };

                int result = iFAQ.DeleteFAQ(fAQ);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FAQ deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FAQ doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting FAQ.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting FAQ.";

                Utility.WriteLog("DeleteFAQ", deleteFAQRequest, "Error while deleting FAQ. (FAQAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
