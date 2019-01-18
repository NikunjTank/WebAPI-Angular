using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using DemystifyFema.Service.Repository;
using System;
using System.Collections.Generic;
using System.Configuration;
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
    public class SupportTicketReplyUserController : ApiController
    {
        private ISupportTicketReply iSupportTicketReply;
        public SupportTicketReplyUserController()
        {
            try
            {
                iSupportTicketReply = new SupportTicketReplyRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("SupportTicketReplyUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("supportticketreplies")]
        [ResponseType(typeof(List<GetSupportTicketReplyResponse>))]
        public IHttpActionResult GetSupportTicketReply([FromUri]GetSupportTicketReplyRequest getSupportTicketReplyRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getSupportTicketReplyRequest == null)
                    getSupportTicketReplyRequest = new GetSupportTicketReplyRequest();

                if (getSupportTicketReplyRequest.PageSize == null)
                    getSupportTicketReplyRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var supportTicketReply = new SupportTicketReply()
                {
                    SupportTicketId = getSupportTicketReplyRequest.SupportTicketId,
                    UserId = getSupportTicketReplyRequest.UserId,
                    SearchText = getSupportTicketReplyRequest.SearchText,
                    IsActive = getSupportTicketReplyRequest.IsActive,
                    PageNumber = getSupportTicketReplyRequest.PageNumber,
                    PageSize = Convert.ToInt32(getSupportTicketReplyRequest.PageSize),
                    IsPagingRequired = (getSupportTicketReplyRequest.PageNumber != null) ? true : false,
                    OrderBy = getSupportTicketReplyRequest.OrderBy,
                    OrderByDirection = getSupportTicketReplyRequest.OrderByDirection
                };
                var supportTicketReplies = iSupportTicketReply.GetSupportTicketReply(supportTicketReply);

                var supportTicketReplyList = new List<GetSupportTicketReplyResponse>();
                foreach (var supportTicketReplyDetail in supportTicketReplies)
                {
                    supportTicketReplyList.Add(new GetSupportTicketReplyResponse()
                    {
                        SupportTicketReplyId = supportTicketReplyDetail.SupportTicketReplyId,
                        UserId = supportTicketReplyDetail.UserId,
                        CurrentUserId = Utility.UserId,
                        SupportTicketId = supportTicketReplyDetail.SupportTicketId,
                        QueryReply = supportTicketReplyDetail.QueryReply,
                        IsActive = Convert.ToBoolean(supportTicketReplyDetail.IsActive),
                        CreatedBy = supportTicketReplyDetail.CreatedBy,
                        TotalPageCount = supportTicketReplyDetail.TotalPageCount,
                        TotalRecord = supportTicketReplyDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "Query reply retrieved successfully";
                responses.Response = supportTicketReplyList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving query reply.";

                Utility.WriteLog("GetSupportTicketReply", getSupportTicketReplyRequest, "Error while retrieving supportticketreply. (SupportTicketReplyUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("supportticketreplies/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddSupportTicketReply(AddSupportTicketReplyRequest addSupportTicketReplyRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var supportTicketReply = new SupportTicketReply()
                {
                    SupportTicketId = addSupportTicketReplyRequest.SupportTicketId,
                    UserId = Utility.UserId,
                    QueryReply = addSupportTicketReplyRequest.QueryReply,
                    CreatedBy = Utility.UserId
                };
                SupportTicketReply objSupportTicketReply = iSupportTicketReply.AddSupportTicketReply(supportTicketReply);
                if (objSupportTicketReply.Result > 0)
                {
                    var supportTicketEmailHtmlCode = System.IO.File.ReadAllText(string.Format("{0}", HttpContext.Current.Server.MapPath(string.Format("{0}{1}", ConfigurationManager.AppSettings["EmailTemplatePath"], ConfigurationManager.AppSettings["SupportTicketReplyForUserEmailTemplate"]))));

                    var mainTemplateHtmlCode = System.IO.File.ReadAllText(string.Format("{0}", HttpContext.Current.Server.MapPath(string.Format("{0}{1}", ConfigurationManager.AppSettings["EmailTemplatePath"], ConfigurationManager.AppSettings["MainEmailTemplate"]))));
                    mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[SITEURL]", ConfigurationManager.AppSettings["SiteUrl"]);
                    mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[SITENAME]", ConfigurationManager.AppSettings["SiteName"]);
                    mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[PAGECONTENT]", supportTicketEmailHtmlCode);

                    string subject = "Post Query Reply | Demystify Fema";
                    string body = mainTemplateHtmlCode;
                    string displayName = ConfigurationManager.AppSettings["SiteName"];
                    bool isSentMail = Utility.SendMail(ConfigurationManager.AppSettings["AdminEmailId"], string.Empty, string.Empty, subject, body, displayName, string.Empty, true);

                    try
                    {
                        var objSupportTicketReplyMailSent = new SupportTicketReply()
                        {
                            SupportTicketReplyId = objSupportTicketReply.Result,
                            IsMailSentToAdmin = isSentMail,
                            ModifiedBy = Utility.UserId
                        };
                        iSupportTicketReply.UpdateSupportTicketReplyMailSent(objSupportTicketReplyMailSent);
                    }
                    catch (Exception ex)
                    {
                        Utility.WriteLog("AddSupportTicketReply", addSupportTicketReplyRequest, "Error while update supportticketreply mailsent. (SupportTicketReplyUserController)", ex.ToString());
                    }

                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "Query reply added successfully.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding query reply.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding query reply.";

                Utility.WriteLog("AddSupportTicketReply", addSupportTicketReplyRequest, "Error while adding supportticketreply. (SupportTicketReplyUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
