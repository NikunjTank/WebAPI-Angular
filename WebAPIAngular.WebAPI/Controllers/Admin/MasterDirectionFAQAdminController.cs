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
    public class MasterDirectionFAQAdminController : ApiController
    {
        private IMasterDirectionFAQ iMasterDirectionFAQ;
        public MasterDirectionFAQAdminController()
        {
            try
            {
                iMasterDirectionFAQ = new MasterDirectionFAQRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("MasterDirectionFAQAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("masterdirectionfaqs")]
        [ResponseType(typeof(List<GetMasterDirectionFAQResponse>))]
        public IHttpActionResult GetMasterDirectionFAQ([FromUri]GetMasterDirectionFAQRequest getMasterDirectionFAQRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getMasterDirectionFAQRequest == null)
                    getMasterDirectionFAQRequest = new GetMasterDirectionFAQRequest();

                if (getMasterDirectionFAQRequest.PageSize == null)
                    getMasterDirectionFAQRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var masterDirectionFAQ = new MasterDirectionFAQ()
                {
                    MasterDirectionFAQId = getMasterDirectionFAQRequest.MasterDirectionFAQId,
                    MasterDirectionId = getMasterDirectionFAQRequest.MasterDirectionId,
                    SearchText = getMasterDirectionFAQRequest.SearchText,
                    IsActive = getMasterDirectionFAQRequest.IsActive,
                    PageNumber = getMasterDirectionFAQRequest.PageNumber,
                    PageSize = Convert.ToInt32(getMasterDirectionFAQRequest.PageSize),
                    IsPagingRequired = (getMasterDirectionFAQRequest.PageNumber != null) ? true : false,
                    OrderBy = getMasterDirectionFAQRequest.OrderBy,
                    OrderByDirection = getMasterDirectionFAQRequest.OrderByDirection
                };
                var masterDirectionFAQs = iMasterDirectionFAQ.GetMasterDirectionFAQ(masterDirectionFAQ);

                var masterDirectionFAQList = new List<GetMasterDirectionFAQResponse>();
                foreach (var masterDirectionFAQDetail in masterDirectionFAQs)
                {
                    masterDirectionFAQList.Add(new GetMasterDirectionFAQResponse()
                    {
                        MasterDirectionFAQId = Convert.ToInt32(masterDirectionFAQDetail.MasterDirectionFAQId),
                        MasterDirectionId = Convert.ToInt32(masterDirectionFAQDetail.MasterDirectionId),
                        FAQId = masterDirectionFAQDetail.FAQId,
                        TopicName = masterDirectionFAQDetail.TopicName,
                        CategoryName = masterDirectionFAQDetail.CategoryName,
                        PDF = masterDirectionFAQDetail.PDF,
                        IsActive = Convert.ToBoolean(masterDirectionFAQDetail.IsActive),
                        CreatedBy = masterDirectionFAQDetail.CreatedBy,
                        TotalPageCount = masterDirectionFAQDetail.TotalPageCount,
                        TotalRecord = masterDirectionFAQDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "MasterDirectionFAQ retrieved successfully";
                responses.Response = masterDirectionFAQList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving MasterDirectionFAQ.";

                Utility.WriteLog("GetMasterDirectionFAQ", getMasterDirectionFAQRequest, "Error while retrieving MasterDirectionFAQ. (MasterDirectionFAQAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("masterdirectionfaqs/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddMasterDirectionFAQ(AddMasterDirectionFAQRequest addMasterDirectionFAQRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var masterDirectionFAQ = new MasterDirectionFAQ()
                {
                    MasterDirectionId = addMasterDirectionFAQRequest.MasterDirectionId,
                    FAQId = addMasterDirectionFAQRequest.FAQId,
                    CreatedBy = Utility.UserId
                };
                int result = iMasterDirectionFAQ.AddMasterDirectionFAQ(masterDirectionFAQ);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "MasterDirectionFAQ added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "MasterDirectionFAQ alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding MasterDirectionFAQ.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding MasterDirectionFAQ.";

                Utility.WriteLog("AddMasterDirectionFAQ", addMasterDirectionFAQRequest, "Error while adding MasterDirectionFAQ. (MasterDirectionFAQAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("masterdirectionfaqs/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateMasterDirectionFAQ(UpdateMasterDirectionFAQRequest updateMasterDirectionFAQRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var masterDirectionFAQ = new MasterDirectionFAQ()
                {
                    MasterDirectionFAQId = updateMasterDirectionFAQRequest.MasterDirectionFAQId,
                    MasterDirectionId = updateMasterDirectionFAQRequest.MasterDirectionId,
                    FAQId = updateMasterDirectionFAQRequest.FAQId,
                    ModifiedBy = Utility.UserId
                };
                int result = iMasterDirectionFAQ.UpdateMasterDirectionFAQ(masterDirectionFAQ);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionFAQ updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionFAQ already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionFAQ doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating MasterDirectionFAQ.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating MasterDirectionFAQ.";

                Utility.WriteLog("UpdateMasterDirectionFAQ", updateMasterDirectionFAQRequest, "Error while updating MasterDirectionFAQ. (MasterDirectionFAQAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("masterdirectionfaqs/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteMasterDirectionFAQ(DeleteMasterDirectionFAQRequest deleteMasterDirectionFAQRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var masterDirectionFAQ = new MasterDirectionFAQ()
                {
                    MasterDirectionFAQId = deleteMasterDirectionFAQRequest.MasterDirectionFAQId,
                    ModifiedBy = Utility.UserId
                };

                int result = iMasterDirectionFAQ.DeleteMasterDirectionFAQ(masterDirectionFAQ);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionFAQ deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionFAQ doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting MasterDirectionFAQ.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting MasterDirectionFAQ.";

                Utility.WriteLog("DeleteMasterDirectionFAQ", deleteMasterDirectionFAQRequest, "Error while deleting MasterDirectionFAQ. (MasterDirectionFAQAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
