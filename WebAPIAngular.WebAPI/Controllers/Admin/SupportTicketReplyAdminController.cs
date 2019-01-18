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

namespace DemystifyFema.Service.Controllers.Admin
{
    [Authorize(Roles = "Admin")]
    [RoutePrefix("admin/api")]
    public class SupportTicketReplyAdminController : ApiController
    {
        private ISupportTicketReply iSupportTicketReply;
        public SupportTicketReplyAdminController()
        {
            try
            {
                iSupportTicketReply = new SupportTicketReplyRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("SupportTicketReplyAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
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

                Utility.WriteLog("GetSupportTicketReply", getSupportTicketReplyRequest, "Error while retrieving supportticketreply. (SupportTicketReplyAdminController)", ex.ToString());
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
                    bool isSentMail = false;

                    if (addSupportTicketReplyRequest.IsForPostQuery)
                    {
                        var supportTicketEmailHtmlCode = System.IO.File.ReadAllText(string.Format("{0}", HttpContext.Current.Server.MapPath(string.Format("{0}{1}", ConfigurationManager.AppSettings["EmailTemplatePath"], ConfigurationManager.AppSettings["PostQueryReplyForAdminEmailTemplate"]))));

                        var mainTemplateHtmlCode = System.IO.File.ReadAllText(string.Format("{0}", HttpContext.Current.Server.MapPath(string.Format("{0}{1}", ConfigurationManager.AppSettings["EmailTemplatePath"], ConfigurationManager.AppSettings["MainEmailTemplate"]))));
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[SITEURL]", ConfigurationManager.AppSettings["SiteUrl"]);
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[SITENAME]", ConfigurationManager.AppSettings["SiteName"]);
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[PAGECONTENT]", supportTicketEmailHtmlCode);

                        string subject = "Post Query Reply | Demystify Fema";
                        string body = mainTemplateHtmlCode;
                        string displayName = ConfigurationManager.AppSettings["SiteName"];
                        isSentMail = Utility.SendMail(objSupportTicketReply.EmailId, string.Empty, string.Empty, subject, body, displayName, string.Empty, true);
                    }
                    else
                    {
                        var supportTicketEmailHtmlCode = System.IO.File.ReadAllText(string.Format("{0}", HttpContext.Current.Server.MapPath(string.Format("{0}{1}", ConfigurationManager.AppSettings["EmailTemplatePath"], ConfigurationManager.AppSettings["SupportTicketReplyForAdminEmailTemplate"]))));

                        var mainTemplateHtmlCode = System.IO.File.ReadAllText(string.Format("{0}", HttpContext.Current.Server.MapPath(string.Format("{0}{1}", ConfigurationManager.AppSettings["EmailTemplatePath"], ConfigurationManager.AppSettings["MainEmailTemplate"]))));
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[SITEURL]", ConfigurationManager.AppSettings["SiteUrl"]);
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[SITENAME]", ConfigurationManager.AppSettings["SiteName"]);
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[PAGECONTENT]", supportTicketEmailHtmlCode);

                        string subject = "Support Ticket Reply | Demystify Fema";
                        string body = mainTemplateHtmlCode;
                        string displayName = ConfigurationManager.AppSettings["SiteName"];
                        isSentMail = Utility.SendMail(objSupportTicketReply.EmailId, string.Empty, string.Empty, subject, body, displayName, string.Empty, true);
                    }

                    try
                    {
                        var objSupportTicketReplyMailSent = new SupportTicketReply()
                        {
                            SupportTicketReplyId = objSupportTicketReply.Result,
                            IsMailSentToUser = isSentMail,
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

                Utility.WriteLog("AddSupportTicketReply", addSupportTicketReplyRequest, "Error while adding supportticketreply. (SupportTicketReplyAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("supportticketreplies/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteSupportTicketReply(DeleteSupportTicketReplyRequest deleteSupportTicketReplyRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var supportTicketReply = new SupportTicketReply()
                {
                    SupportTicketReplyId = deleteSupportTicketReplyRequest.SupportTicketReplyId,
                    ModifiedBy = Utility.UserId
                };

                int result = iSupportTicketReply.DeleteSupportTicketReply(supportTicketReply);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "Query reply deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Query reply doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting query reply.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting query reply.";

                Utility.WriteLog("DeleteSupportTicketReply", deleteSupportTicketReplyRequest, "Error while deleting supportticketreply. (SupportTicketReplyAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
