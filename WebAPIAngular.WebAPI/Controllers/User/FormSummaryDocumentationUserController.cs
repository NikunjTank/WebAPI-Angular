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

namespace DemystifyFema.Service.Controllers.User
{
    [Authorize(Roles = "User")]
    [RoutePrefix("user/api")]
    public class FormSummaryDocumentationUserController : ApiController
    {
        private IFormSummaryDocumentation iFormSummaryDocumentation;
        private IFormSummaryDocumentationDetail iFormSummaryDocumentationDetail;
        public FormSummaryDocumentationUserController()
        {
            try
            {
                iFormSummaryDocumentation = new FormSummaryDocumentationRepository();
                iFormSummaryDocumentationDetail = new FormSummaryDocumentationDetailRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FormSummaryDocumentationUserController (User)", null, "Error while initialize repository.", ex.ToString());
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

                Utility.WriteLog("GetFormSummaryDocumentation", getFormSummaryDocumentationRequest, "Error while retrieving " + getFormSummaryDocumentationRequest.SubMenuName + " (FormSummaryDocumentationUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("formsummarydocumentationdetails")]
        [ResponseType(typeof(List<GetFormSummaryDocumentationDetailResponse>))]
        public IHttpActionResult GetFormSummaryDocumentationDetail([FromUri]GetFormSummaryDocumentationDetailRequest getFormSummaryDocumentationDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFormSummaryDocumentationDetailRequest == null)
                    getFormSummaryDocumentationDetailRequest = new GetFormSummaryDocumentationDetailRequest();

                if (getFormSummaryDocumentationDetailRequest.PageSize == null)
                    getFormSummaryDocumentationDetailRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var formSummaryDocumentationDetail = new FormSummaryDocumentationDetail()
                {
                    FormSummaryDocumentationDetailId = getFormSummaryDocumentationDetailRequest.FormSummaryDocumentationDetailId,
                    FormSummaryDocumentationId = getFormSummaryDocumentationDetailRequest.FormSummaryDocumentationId,
                    SubMenuName = getFormSummaryDocumentationDetailRequest.SubMenuName,
                    SearchText = getFormSummaryDocumentationDetailRequest.SearchText,
                    IsActive = getFormSummaryDocumentationDetailRequest.IsActive,
                    PageNumber = getFormSummaryDocumentationDetailRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFormSummaryDocumentationDetailRequest.PageSize),
                    IsPagingRequired = (getFormSummaryDocumentationDetailRequest.PageNumber != null) ? true : false,
                    OrderBy = getFormSummaryDocumentationDetailRequest.OrderBy,
                    OrderByDirection = getFormSummaryDocumentationDetailRequest.OrderByDirection
                };
                var formSummaryDocumentationDetails = iFormSummaryDocumentationDetail.GetFormSummaryDocumentationDetail(formSummaryDocumentationDetail);

                var formSummaryDocumentationDetailList = new List<GetFormSummaryDocumentationDetailResponse>();
                foreach (var formSummaryDocumentationDetailDetail in formSummaryDocumentationDetails)
                {
                    formSummaryDocumentationDetailList.Add(new GetFormSummaryDocumentationDetailResponse()
                    {
                        FormSummaryDocumentationDetailId = Convert.ToInt32(formSummaryDocumentationDetailDetail.FormSummaryDocumentationDetailId),
                        FormSummaryDocumentationId = Convert.ToInt32(formSummaryDocumentationDetailDetail.FormSummaryDocumentationId),
                        FormName = formSummaryDocumentationDetailDetail.FormName,
                        WordFileName = formSummaryDocumentationDetailDetail.WordFileName,
                        ExcelFileName = formSummaryDocumentationDetailDetail.ExcelFileName,
                        PDFFileName = formSummaryDocumentationDetailDetail.PDFFileName,
                        IsActive = Convert.ToBoolean(formSummaryDocumentationDetailDetail.IsActive),
                        CreatedBy = formSummaryDocumentationDetailDetail.CreatedBy,
                        TotalPageCount = formSummaryDocumentationDetailDetail.TotalPageCount,
                        TotalRecord = formSummaryDocumentationDetailDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = getFormSummaryDocumentationDetailRequest.SubMenuName + "Detail retrieved successfully";
                responses.Response = formSummaryDocumentationDetailList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving " + getFormSummaryDocumentationDetailRequest.SubMenuName + "Detail";

                Utility.WriteLog("GetFormSummaryDocumentationDetail", getFormSummaryDocumentationDetailRequest, "Error while retrieving " + getFormSummaryDocumentationDetailRequest.SubMenuName + "Detail (FormSummaryDocumentationDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
