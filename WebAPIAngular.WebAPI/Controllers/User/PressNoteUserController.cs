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

namespace DemystifyFema.Service.Controllers.User
{
    [Authorize(Roles = "User")]
    [RoutePrefix("user/api")]
    public class PressNoteUserController : ApiController
    {
        private IPressNote iPressNote;
        public PressNoteUserController()
        {
            try
            {
                iPressNote = new PressNoteRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("PressNoteUserController (User)", null, "Error while initialize repository.", ex.ToString());
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

                Utility.WriteLog("GetPressNote", getPressNoteRequest, "Error while retrieving PressNote. (PressNoteUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("pressnoteyears")]
        [ResponseType(typeof(List<int>))]
        public IHttpActionResult GetPressNoteYear()
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var lstPressNoteYear = Utility.GetYear().Where(x => x >= 1991 && x <= DateTime.Now.Year).OrderByDescending(x => x).ToList();

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "PressNoteYear retrieved successfully";
                responses.Response = lstPressNoteYear;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving PressNoteYear.";

                Utility.WriteLog("GetPressNoteYear", null, "Error while retrieving PressNoteYear. (PressNoteUserController)", ex.ToString());
            }
            return Ok(responses);
        }


    }
}
