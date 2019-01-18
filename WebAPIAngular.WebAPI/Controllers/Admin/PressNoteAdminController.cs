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
    public class PressNoteAdminController : ApiController
    {
        private IPressNote iPressNote;
        public PressNoteAdminController()
        {
            try
            {
                iPressNote = new PressNoteRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("PressNoteAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("pressnotes")]
        [ResponseType(typeof(List<GetPressNoteResponse>))]
        public IHttpActionResult GetPressNote([FromUri]GetPressNoteRequest getPressNoteRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getPressNoteRequest == null)
                    getPressNoteRequest = new GetPressNoteRequest();

                if (getPressNoteRequest.PageSize == null)
                    getPressNoteRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var pressNote = new PressNote()
                {
                    PressNoteId = getPressNoteRequest.PressNoteId,
                    Year = getPressNoteRequest.Year,
                    SearchText = getPressNoteRequest.SearchText,
                    IsActive = getPressNoteRequest.IsActive,
                    PageNumber = getPressNoteRequest.PageNumber,
                    PageSize = Convert.ToInt32(getPressNoteRequest.PageSize),
                    IsPagingRequired = (getPressNoteRequest.PageNumber != null) ? true : false,
                    OrderBy = getPressNoteRequest.OrderBy,
                    OrderByDirection = getPressNoteRequest.OrderByDirection
                };
                var pressNotes = iPressNote.GetPressNote(pressNote);

                var pressNoteList = new List<GetPressNoteResponse>();
                foreach (var pressNoteDetail in pressNotes)
                {
                    pressNoteList.Add(new GetPressNoteResponse()
                    {
                        PressNoteId = Convert.ToInt32(pressNoteDetail.PressNoteId),
                        PressNoteNo = pressNoteDetail.PressNoteNo,
                        PressNoteName = pressNoteDetail.PressNoteName,
                        PressNoteDate = pressNoteDetail.PressNoteDate,
                        PressNoteEffectiveDate = pressNoteDetail.PressNoteEffectiveDate,
                        Year = pressNoteDetail.Year,
                        PressNotePDF = pressNoteDetail.PressNotePDF,
                        IsActive = Convert.ToBoolean(pressNoteDetail.IsActive),
                        CreatedBy = pressNoteDetail.CreatedBy,
                        TotalPageCount = pressNoteDetail.TotalPageCount,
                        TotalRecord = pressNoteDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "PressNote retrieved successfully";
                responses.Response = pressNoteList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving PressNote.";

                Utility.WriteLog("GetPressNote", getPressNoteRequest, "Error while retrieving PressNote. (PressNoteAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Upload Files
        [HttpPost]
        [Route("pressnotes/uploadfiles")]
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["PressNotePDFPath"]), fileName);
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

                Utility.WriteLog("UploadFile", null, "Error while uploading file. (PressNoteAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("pressnotes/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddPressNote(AddPressNoteRequest addPressNoteRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var pressNote = new PressNote()
                {
                    PressNoteNo = addPressNoteRequest.PressNoteNo,
                    PressNoteName = addPressNoteRequest.PressNoteName,
                    PressNoteDate = addPressNoteRequest.PressNoteDate,
                    PressNoteEffectiveDate = addPressNoteRequest.PressNoteEffectiveDate,
                    Year = addPressNoteRequest.Year,
                    PressNotePDF = addPressNoteRequest.PressNotePDF,
                    CreatedBy = Utility.UserId
                };
                int result = iPressNote.AddPressNote(pressNote);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "PressNote added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "PressNote alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding PressNote.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding PressNote.";

                Utility.WriteLog("AddPressNote", addPressNoteRequest, "Error while adding PressNote. (PressNoteAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("pressnotes/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdatePressNote(UpdatePressNoteRequest updatePressNoteRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var pressNote = new PressNote()
                {
                    PressNoteId = updatePressNoteRequest.PressNoteId,
                    PressNoteNo = updatePressNoteRequest.PressNoteNo,
                    PressNoteName = updatePressNoteRequest.PressNoteName,
                    PressNoteDate = updatePressNoteRequest.PressNoteDate,
                    PressNoteEffectiveDate = updatePressNoteRequest.PressNoteEffectiveDate,
                    Year = updatePressNoteRequest.Year,
                    PressNotePDF = updatePressNoteRequest.PressNotePDF,
                    ModifiedBy = Utility.UserId
                };
                int result = iPressNote.UpdatePressNote(pressNote);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "PressNote updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "PressNote already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "PressNote doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating PressNote.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating PressNote.";

                Utility.WriteLog("UpdatePressNote", updatePressNoteRequest, "Error while updating PressNote. (PressNoteAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("pressnotes/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeletePressNote(DeletePressNoteRequest deletePressNoteRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var pressNote = new PressNote()
                {
                    PressNoteId = deletePressNoteRequest.PressNoteId,
                    ModifiedBy = Utility.UserId
                };

                int result = iPressNote.DeletePressNote(pressNote);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "PressNote deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "PressNote doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting PressNote.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting PressNote.";

                Utility.WriteLog("DeletePressNote", deletePressNoteRequest, "Error while deleting PressNote. (PressNoteAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
