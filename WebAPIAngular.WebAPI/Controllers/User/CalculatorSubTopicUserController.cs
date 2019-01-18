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
    public class CalculatorSubTopicUserController : ApiController
    {
        private ICalculatorSubTopic iCalculatorSubTopic;
        public CalculatorSubTopicUserController()
        {
            try
            {
                iCalculatorSubTopic = new CalculatorSubTopicRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("CalculatorSubTopicUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("calculatorsubtopics")]
        [ResponseType(typeof(List<GetCalculatorSubTopicResponse>))]
        public IHttpActionResult GetCalculatorSubTopic([FromUri]GetCalculatorSubTopicRequest getCalculatorSubTopicRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getCalculatorSubTopicRequest == null)
                    getCalculatorSubTopicRequest = new GetCalculatorSubTopicRequest();

                if (getCalculatorSubTopicRequest.PageSize == null)
                    getCalculatorSubTopicRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var calculatorSubTopic = new CalculatorSubTopic()
                {
                    CalculatorSubTopicId = getCalculatorSubTopicRequest.CalculatorSubTopicId,
                    FEMAModuleId = getCalculatorSubTopicRequest.FEMAModuleId,
                    SearchText = getCalculatorSubTopicRequest.SearchText,
                    IsActive = getCalculatorSubTopicRequest.IsActive,
                    PageNumber = getCalculatorSubTopicRequest.PageNumber,
                    PageSize = Convert.ToInt32(getCalculatorSubTopicRequest.PageSize),
                    IsPagingRequired = (getCalculatorSubTopicRequest.PageNumber != null) ? true : false,
                    OrderBy = getCalculatorSubTopicRequest.OrderBy,
                    OrderByDirection = getCalculatorSubTopicRequest.OrderByDirection
                };
                var calculatorSubTopics = iCalculatorSubTopic.GetCalculatorSubTopic(calculatorSubTopic);

                var calculatorSubTopicList = new List<GetCalculatorSubTopicResponse>();
                foreach (var calculatorSubTopicDetail in calculatorSubTopics)
                {
                    calculatorSubTopicList.Add(new GetCalculatorSubTopicResponse()
                    {
                        CalculatorSubTopicId = calculatorSubTopicDetail.CalculatorSubTopicId,
                        FEMAModuleId = calculatorSubTopicDetail.FEMAModuleId,
                        CalculatorSubTopicName = calculatorSubTopicDetail.CalculatorSubTopicName,
                        IsAmountOfContraventionNeeded = calculatorSubTopicDetail.IsAmountOfContraventionNeeded,
                        IsTotalNoOfAPR_AAC_FCGPRNeeded = calculatorSubTopicDetail.IsTotalNoOfAPR_AAC_FCGPRNeeded,
                        IsActive = Convert.ToBoolean(calculatorSubTopicDetail.IsActive),
                        CreatedBy = calculatorSubTopicDetail.CreatedBy,
                        TotalPageCount = calculatorSubTopicDetail.TotalPageCount,
                        TotalRecord = calculatorSubTopicDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "CalculatorSubTopic retrieved successfully";
                responses.Response = calculatorSubTopicList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving calculatorsubtopic.";

                Utility.WriteLog("GetCalculatorSubTopic", getCalculatorSubTopicRequest, "Error while retrieving calculatorsubtopic. (CalculatorSubTopicUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
