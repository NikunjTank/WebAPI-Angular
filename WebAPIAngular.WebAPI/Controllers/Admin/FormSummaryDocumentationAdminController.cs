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
    public class FormSummaryDocumentationAdminController : ApiController
    {
        private IFormSummaryDocumentation iFormSummaryDocumentation;
        public FormSummaryDocumentationAdminController()
        {
            try
            {
                iFormSummaryDocumentation = new FormSummaryDocumentationRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FormSummaryDocumentationAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("formsummarydocumentations")]
        [ResponseType(typeof(List<GetFormSummaryDocumentationResponse>))]
        public IHttpActionResult GetFormSummaryDocumentation([FromUri]GetFormSummaryDocumentationRequest getFormSummaryDocumentationRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFormSummaryDocumentationRequest == null)
                    getFormSummaryDocumentationRequest = new GetFormSummaryDocumentationRequest();

                if (getFormSummaryDocumentationRequest.PageSize == null)
                    getFormSummaryDocumentationRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var formSummaryDocumentation = new FormSummaryDocumentation()
                {
                    FormSummaryDocumentationId = getFormSummaryDocumentationRequest.FormSummaryDocumentationId,
                    SubMenuName = getFormSummaryDocumentationRequest.SubMenuName,
                    SearchText = getFormSummaryDocumentationRequest.SearchText,
                    IsActive = getFormSummaryDocumentationRequest.IsActive,
                    PageNumber = getFormSummaryDocumentationRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFormSummaryDocumentationRequest.PageSize),
                    IsPagingRequired = (getFormSummaryDocumentationRequest.PageNumber != null) ? true : false,
                    OrderBy = getFormSummaryDocumentationRequest.OrderBy,
                    OrderByDirection = getFormSummaryDocumentationRequest.OrderByDirection
                };
                var formSummaryDocumentations = iFormSummaryDocumentation.GetFormSummaryDocumentation(formSummaryDocumentation);

                var formSummaryDocumentationList = new List<GetFormSummaryDocumentationResponse>();
                foreach (var formSummaryDocumentationDetail in formSummaryDocumentations)
                {
                    formSummaryDocumentationList.Add(new GetFormSummaryDocumentationResponse()
                    {
                        FormSummaryDocumentationId = Convert.ToInt32(formSummaryDocumentationDetail.FormSummaryDocumentationId),
                        TopicName = formSummaryDocumentationDetail.TopicName,
                        IsActive = Convert.ToBoolean(formSummaryDocumentationDetail.IsActive),
                        CreatedBy = formSummaryDocumentationDetail.CreatedBy,
                        TotalPageCount = formSummaryDocumentationDetail.TotalPageCount,
                        TotalRecord = formSummaryDocumentationDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = getFormSummaryDocumentationRequest.SubMenuName + " retrieved successfully";
                responses.Response = formSummaryDocumentationList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving " + getFormSummaryDocumentationRequest.SubMenuName;

                Utility.WriteLog("GetFormSummaryDocumentation", getFormSummaryDocumentationRequest, "Error while retrieving " + getFormSummaryDocumentationRequest.SubMenuName + " (FormSummaryDocumentationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("formsummarydocumentations/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddFormSummaryDocumentation(AddFormSummaryDocumentationRequest addFormSummaryDocumentationRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var formSummaryDocumentation = new FormSummaryDocumentation()
                {
                    TopicName = addFormSummaryDocumentationRequest.TopicName,
                    SubMenuName = addFormSummaryDocumentationRequest.SubMenuName,
                    CreatedBy = Utility.UserId
                };
                int result = iFormSummaryDocumentation.AddFormSummaryDocumentation(formSummaryDocumentation);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = addFormSummaryDocumentationRequest.SubMenuName + " added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = addFormSummaryDocumentationRequest.SubMenuName + " alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding " + addFormSummaryDocumentationRequest.SubMenuName;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding " + addFormSummaryDocumentationRequest.SubMenuName;

                Utility.WriteLog("AddFormSummaryDocumentation", addFormSummaryDocumentationRequest, "Error while adding " + addFormSummaryDocumentationRequest.SubMenuName + ". (FormSummaryDocumentationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("formsummarydocumentations/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateFormSummaryDocumentation(UpdateFormSummaryDocumentationRequest updateFormSummaryDocumentationRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var formSummaryDocumentation = new FormSummaryDocumentation()
                {
                    FormSummaryDocumentationId = updateFormSummaryDocumentationRequest.FormSummaryDocumentationId,
                    TopicName = updateFormSummaryDocumentationRequest.TopicName,
                    SubMenuName = updateFormSummaryDocumentationRequest.SubMenuName,
                    ModifiedBy = Utility.UserId
                };
                int result = iFormSummaryDocumentation.UpdateFormSummaryDocumentation(formSummaryDocumentation);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = updateFormSummaryDocumentationRequest.SubMenuName + " updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = updateFormSummaryDocumentationRequest.SubMenuName + " already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = updateFormSummaryDocumentationRequest.SubMenuName + " doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating " + updateFormSummaryDocumentationRequest.SubMenuName;
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating " + updateFormSummaryDocumentationRequest.SubMenuName;

                Utility.WriteLog("UpdateFormSummaryDocumentation", updateFormSummaryDocumentationRequest, "Error while updating " + updateFormSummaryDocumentationRequest.SubMenuName + ". (FormSummaryDocumentationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("formsummarydocumentations/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteFormSummaryDocumentation(DeleteFormSummaryDocumentationRequest deleteFormSummaryDocumentationRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var formSummaryDocumentation = new FormSummaryDocumentation()
                {
                    FormSummaryDocumentationId = deleteFormSummaryDocumentationRequest.FormSummaryDocumentationId,
                    ModifiedBy = Utility.UserId
                };

                int result = iFormSummaryDocumentation.DeleteFormSummaryDocumentation(formSummaryDocumentation);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = deleteFormSummaryDocumentationRequest.SubMenuName + " deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = deleteFormSummaryDocumentationRequest.SubMenuName + " doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting " + deleteFormSummaryDocumentationRequest.SubMenuName;
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting " + deleteFormSummaryDocumentationRequest.SubMenuName;

                Utility.WriteLog("DeleteFormSummaryDocumentation", deleteFormSummaryDocumentationRequest, "Error while deleting " + deleteFormSummaryDocumentationRequest.SubMenuName + ". (FormSummaryDocumentationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
