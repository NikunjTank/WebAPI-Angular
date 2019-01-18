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
    public class FormSummaryDocumentationDetailAdminController : ApiController
    {
        private IFormSummaryDocumentationDetail iFormSummaryDocumentationDetail;
        public FormSummaryDocumentationDetailAdminController()
        {
            try
            {
                iFormSummaryDocumentationDetail = new FormSummaryDocumentationDetailRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FormSummaryDocumentationDetailAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
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

                Utility.WriteLog("GetFormSummaryDocumentationDetail", getFormSummaryDocumentationDetailRequest, "Error while retrieving " + getFormSummaryDocumentationDetailRequest.SubMenuName + "Detail (FormSummaryDocumentationDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Upload Word Files
        [HttpPost]
        [Route("formsummarydocumentationdetails/uploadwordfiles")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UploadWordFiles()
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FormSummaryDocumentationDetailWordPath"]), fileName);
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

                Utility.WriteLog("UploadWordFiles", null, "Error while uploading file. (FormSummaryDocumentationDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        #region Upload Excel Files
        [HttpPost]
        [Route("formsummarydocumentationdetails/uploadexcelfiles")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UploadExcelFiles()
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FormSummaryDocumentationDetailExcelPath"]), fileName);
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

                Utility.WriteLog("UploadExcelFiles", null, "Error while uploading file. (FormSummaryDocumentationDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        #region Upload PDF Files
        [HttpPost]
        [Route("formsummarydocumentationdetails/uploadpdffiles")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UploadPDFFiles()
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FormSummaryDocumentationDetailPDFPath"]), fileName);
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

                Utility.WriteLog("UploadPDFFiles", null, "Error while uploading file. (FormSummaryDocumentationDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("formsummarydocumentationdetails/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddFormSummaryDocumentationDetail(AddFormSummaryDocumentationDetailRequest addFormSummaryDocumentationDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var formSummaryDocumentationDetail = new FormSummaryDocumentationDetail()
                {
                    FormSummaryDocumentationId = addFormSummaryDocumentationDetailRequest.FormSummaryDocumentationId,
                    FormName = addFormSummaryDocumentationDetailRequest.FormName,
                    WordFileName = addFormSummaryDocumentationDetailRequest.WordFileName,
                    ExcelFileName = addFormSummaryDocumentationDetailRequest.ExcelFileName,
                    PDFFileName = addFormSummaryDocumentationDetailRequest.PDFFileName,
                    SubMenuName = addFormSummaryDocumentationDetailRequest.SubMenuName,
                    CreatedBy = Utility.UserId
                };
                int result = iFormSummaryDocumentationDetail.AddFormSummaryDocumentationDetail(formSummaryDocumentationDetail);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = addFormSummaryDocumentationDetailRequest.SubMenuName + "Detail added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = addFormSummaryDocumentationDetailRequest.SubMenuName + "Detail alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding " + addFormSummaryDocumentationDetailRequest.SubMenuName + " Detail";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding " + addFormSummaryDocumentationDetailRequest.SubMenuName + " Detail";

                Utility.WriteLog("AddFormSummaryDocumentationDetail", addFormSummaryDocumentationDetailRequest, "Error while adding " + addFormSummaryDocumentationDetailRequest.SubMenuName + "Detail (FormSummaryDocumentationDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("formsummarydocumentationdetails/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateFormSummaryDocumentationDetail(UpdateFormSummaryDocumentationDetailRequest updateFormSummaryDocumentationDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var formSummaryDocumentationDetail = new FormSummaryDocumentationDetail()
                {
                    FormSummaryDocumentationDetailId = updateFormSummaryDocumentationDetailRequest.FormSummaryDocumentationDetailId,
                    FormSummaryDocumentationId = updateFormSummaryDocumentationDetailRequest.FormSummaryDocumentationId,
                    FormName = updateFormSummaryDocumentationDetailRequest.FormName,
                    WordFileName = updateFormSummaryDocumentationDetailRequest.WordFileName,
                    ExcelFileName = updateFormSummaryDocumentationDetailRequest.ExcelFileName,
                    PDFFileName = updateFormSummaryDocumentationDetailRequest.PDFFileName,
                    SubMenuName = updateFormSummaryDocumentationDetailRequest.SubMenuName,
                    ModifiedBy = Utility.UserId
                };
                int result = iFormSummaryDocumentationDetail.UpdateFormSummaryDocumentationDetail(formSummaryDocumentationDetail);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = updateFormSummaryDocumentationDetailRequest.SubMenuName + "Detail updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = updateFormSummaryDocumentationDetailRequest.SubMenuName + "Detail already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = updateFormSummaryDocumentationDetailRequest.SubMenuName + "Detail doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating " + updateFormSummaryDocumentationDetailRequest.SubMenuName + "Detail";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating " + updateFormSummaryDocumentationDetailRequest.SubMenuName + "Detail.";

                Utility.WriteLog("UpdateFormSummaryDocumentationDetail", updateFormSummaryDocumentationDetailRequest, "Error while updating " + updateFormSummaryDocumentationDetailRequest.SubMenuName + "Detail (FormSummaryDocumentationDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("formsummarydocumentationdetails/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteFormSummaryDocumentationDetail(DeleteFormSummaryDocumentationDetailRequest deleteFormSummaryDocumentationDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var formSummaryDocumentationDetail = new FormSummaryDocumentationDetail()
                {
                    FormSummaryDocumentationDetailId = deleteFormSummaryDocumentationDetailRequest.FormSummaryDocumentationDetailId,
                    ModifiedBy = Utility.UserId
                };

                int result = iFormSummaryDocumentationDetail.DeleteFormSummaryDocumentationDetail(formSummaryDocumentationDetail);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = deleteFormSummaryDocumentationDetailRequest.SubMenuName + "Detail deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = deleteFormSummaryDocumentationDetailRequest.SubMenuName + "Detail doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting " + deleteFormSummaryDocumentationDetailRequest.SubMenuName + "Detail.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting " + deleteFormSummaryDocumentationDetailRequest.SubMenuName + "Detail.";

                Utility.WriteLog("DeleteFormSummaryDocumentationDetail", deleteFormSummaryDocumentationDetailRequest, "Error while deleting " + deleteFormSummaryDocumentationDetailRequest.SubMenuName + "Detail. (FormSummaryDocumentationDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
