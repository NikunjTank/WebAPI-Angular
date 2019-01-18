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

namespace DemystifyFema.Service.Controllers.Guest
{
    [AllowAnonymous]
    [RoutePrefix("api")]
    public class ContactUsguestController : ApiController
    {
        private IContactUs iContactUs;
        public ContactUsguestController()
        {
            try
            {
                iContactUs = new ContactUsRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("ContactUsguestController (guest)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("contactuss")]
        [ResponseType(typeof(List<GetContactUsResponse>))]
        public IHttpActionResult GetContactUs([FromUri]GetContactUsRequest getContactUsRequest)
        {
            var responses = new Responses();
            try
            {
                if (getContactUsRequest == null)
                    getContactUsRequest = new GetContactUsRequest();

                if (getContactUsRequest.PageSize == null)
                    getContactUsRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var contactUs = new ContactUs()
                {
                    ContactUsId = getContactUsRequest.ContactUsId,
                    SearchText = getContactUsRequest.SearchText,
                    IsActive = getContactUsRequest.IsActive,
                    PageNumber = getContactUsRequest.PageNumber,
                    PageSize = Convert.ToInt32(getContactUsRequest.PageSize),
                    IsPagingRequired = (getContactUsRequest.PageNumber != null) ? true : false,
                    OrderBy = getContactUsRequest.OrderBy,
                    OrderByDirection = getContactUsRequest.OrderByDirection
                };
                var contactUss = iContactUs.GetContactUs(contactUs);

                var contactUsList = new List<GetContactUsResponse>();
                foreach (var contactUsDetail in contactUss)
                {
                    contactUsList.Add(new GetContactUsResponse()
                    {
                        ContactUsId = Convert.ToInt32(contactUsDetail.ContactUsId),
                        Name = contactUsDetail.Name,
                        Email = contactUsDetail.Email,
                        Mobile = contactUsDetail.Mobile,
                        Comment = contactUsDetail.Comment,
                        IsActive = Convert.ToBoolean(contactUsDetail.IsActive),
                        CreatedBy = contactUsDetail.CreatedBy,
                        TotalPageCount = contactUsDetail.TotalPageCount,
                        TotalRecord = contactUsDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "ContactUs retrieved successfully";
                responses.Response = contactUsList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving contactus.";

                Utility.WriteLog("GetContactUs", getContactUsRequest, "Error while retrieving contactus. (ContactUsguestController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("contactuss/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddContactUs(AddContactUsRequest addContactUsRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var contactUs = new ContactUs()
                {
                    Name = addContactUsRequest.Name,
                    Email = addContactUsRequest.Email,
                    Mobile = addContactUsRequest.Mobile,
                    Comment = addContactUsRequest.Comment,
                    CreatedBy = Utility.UserId
                };
                int result = iContactUs.AddContactUs(contactUs);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "ContactUs added successfully.";
                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "ContactUs alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding contactus.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding contactus.";

                Utility.WriteLog("AddContactUs", addContactUsRequest, "Error while adding contactus. (ContactUsguestController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("contactuss/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteContactUs(DeleteContactUsRequest deleteContactUsRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                
                var contactUs = new ContactUs()
                {
                    ContactUsId = deleteContactUsRequest.ContactUsId,
                    ModifiedBy = Utility.UserId
                };

                int result = iContactUs.DeleteContactUs(contactUs);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "ContactUs deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "ContactUs doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting contactus.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting contactus.";

                Utility.WriteLog("DeleteContactUs", deleteContactUsRequest, "Error while deleting contactus. (ContactUsguestController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
