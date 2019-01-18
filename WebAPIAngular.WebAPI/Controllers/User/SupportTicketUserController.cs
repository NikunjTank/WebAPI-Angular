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
    public class SupportTicketUserController : ApiController
    {
        private ISupportTicket iSupportTicket;
        private IAuthorWriteUpDetail iAuthorWriteUpDetail;
        public SupportTicketUserController()
        {
            try
            {
                iSupportTicket = new SupportTicketRepository();
                iAuthorWriteUpDetail = new AuthorWriteUpDetailRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("SupportTicketUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("supporttickets")]
        [ResponseType(typeof(List<GetSupportTicketResponse>))]
        public IHttpActionResult GetSupportTicket([FromUri]GetSupportTicketRequest getSupportTicketRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getSupportTicketRequest == null)
                    getSupportTicketRequest = new GetSupportTicketRequest();

                if (getSupportTicketRequest.PageSize == null)
                    getSupportTicketRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var supportTicket = new SupportTicket()
                {
                    SupportTicketId = getSupportTicketRequest.SupportTicketId,
                    UserId = (getSupportTicketRequest.IsCurrentUser) ? Utility.UserId : (int?)null,
                    IsForPostQuery = getSupportTicketRequest.IsForPostQuery,
                    TopicId = getSupportTicketRequest.TopicId,
                    SubTopicId = getSupportTicketRequest.SubTopicId,
                    DepartmentId = getSupportTicketRequest.DepartmentId,
                    SearchText = getSupportTicketRequest.SearchText,
                    IsActive = getSupportTicketRequest.IsActive,
                    PageNumber = getSupportTicketRequest.PageNumber,
                    PageSize = Convert.ToInt32(getSupportTicketRequest.PageSize),
                    IsPagingRequired = (getSupportTicketRequest.PageNumber != null) ? true : false,
                    OrderBy = getSupportTicketRequest.OrderBy,
                    OrderByDirection = getSupportTicketRequest.OrderByDirection
                };
                var supportTickets = iSupportTicket.GetSupportTicket(supportTicket);

                var supportTicketList = new List<GetSupportTicketResponse>();
                foreach (var supportTicketDetail in supportTickets)
                {
                    supportTicketList.Add(new GetSupportTicketResponse()
                    {
                        SupportTicketId = supportTicketDetail.SupportTicketId,
                        UserId = supportTicketDetail.UserId,
                        DepartmentId = supportTicketDetail.DepartmentId,
                        DepartmentName = supportTicketDetail.DepartmentName,
                        TopicId = supportTicketDetail.TopicId,
                        SubTopicId = supportTicketDetail.SubTopicId,
                        TopicName = supportTicketDetail.TopicName,
                        SubTopicName = supportTicketDetail.SubTopicName,
                        QueryTitle = supportTicketDetail.QueryTitle,
                        Query = supportTicketDetail.Query,
                        IsActive = Convert.ToBoolean(supportTicketDetail.IsActive),
                        CreatedBy = supportTicketDetail.CreatedBy,
                        TotalPageCount = supportTicketDetail.TotalPageCount,
                        TotalRecord = supportTicketDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "Post query retrieved successfully";
                responses.Response = supportTicketList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving post query.";

                Utility.WriteLog("GetSupportTicket", getSupportTicketRequest, "Error while retrieving supportticket. (SupportTicketUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("supporttickets/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddSupportTicket(AddSupportTicketRequest addSupportTicketRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var supportTicket = new SupportTicket()
                {
                    UserId = Utility.UserId,
                    TopicId = addSupportTicketRequest.TopicId,
                    SubTopicId = addSupportTicketRequest.SubTopicId,
                    QueryTitle = addSupportTicketRequest.QueryTitle,
                    DepartmentId = addSupportTicketRequest.DepartmentId,
                    Query = addSupportTicketRequest.Query,
                    CreatedBy = Utility.UserId
                };
                int result = iSupportTicket.AddSupportTicket(supportTicket);
                if (result > 0)
                {
                    bool isSentMail = false;

                    if (addSupportTicketRequest.DepartmentId != null)
                    {
                        var supportTicketEmailHtmlCode = System.IO.File.ReadAllText(string.Format("{0}", HttpContext.Current.Server.MapPath(string.Format("{0}{1}", ConfigurationManager.AppSettings["EmailTemplatePath"], ConfigurationManager.AppSettings["SupportTicketForUserEmailTemplate"]))));

                        var mainTemplateHtmlCode = System.IO.File.ReadAllText(string.Format("{0}", HttpContext.Current.Server.MapPath(string.Format("{0}{1}", ConfigurationManager.AppSettings["EmailTemplatePath"], ConfigurationManager.AppSettings["MainEmailTemplate"]))));
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[SITEURL]", ConfigurationManager.AppSettings["SiteUrl"]);
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[SITENAME]", ConfigurationManager.AppSettings["SiteName"]);
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[PAGECONTENT]", supportTicketEmailHtmlCode);

                        string subject = "Support Ticket | Demystify Fema";
                        string body = mainTemplateHtmlCode;
                        string displayName = ConfigurationManager.AppSettings["SiteName"];
                        isSentMail = Utility.SendMail(ConfigurationManager.AppSettings["AdminEmailId"], string.Empty, string.Empty, subject, body, displayName, string.Empty, true);
                    }
                    else
                    {
                        var supportTicketEmailHtmlCode = System.IO.File.ReadAllText(string.Format("{0}", HttpContext.Current.Server.MapPath(string.Format("{0}{1}", ConfigurationManager.AppSettings["EmailTemplatePath"], ConfigurationManager.AppSettings["PostQueryForUserEmailTemplate"]))));

                        var mainTemplateHtmlCode = System.IO.File.ReadAllText(string.Format("{0}", HttpContext.Current.Server.MapPath(string.Format("{0}{1}", ConfigurationManager.AppSettings["EmailTemplatePath"], ConfigurationManager.AppSettings["MainEmailTemplate"]))));
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[SITEURL]", ConfigurationManager.AppSettings["SiteUrl"]);
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[SITENAME]", ConfigurationManager.AppSettings["SiteName"]);
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[PAGECONTENT]", supportTicketEmailHtmlCode);

                        string subject = "Post Query | Demystify Fema";
                        string body = mainTemplateHtmlCode;
                        string displayName = ConfigurationManager.AppSettings["SiteName"];
                        isSentMail = Utility.SendMail(ConfigurationManager.AppSettings["AdminEmailId"], string.Empty, string.Empty, subject, body, displayName, string.Empty, true);
                    }

                    try
                    {
                        var objSupportTicket = new SupportTicket()
                        {
                            SupportTicketId = result,
                            IsMailSentToAdmin = isSentMail,
                            ModifiedBy = Utility.UserId
                        };
                        iSupportTicket.UpdateSupportTicketMailSent(objSupportTicket);
                    }
                    catch (Exception ex)
                    {
                        Utility.WriteLog("AddSupportTicket", addSupportTicketRequest, "Error while update supportticket mailsent. (SupportTicketUserController)", ex.ToString());
                    }

                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "Post query added successfully.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding post query.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding post query.";

                Utility.WriteLog("AddSupportTicket", addSupportTicketRequest, "Error while adding supportticket. (SupportTicketUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
