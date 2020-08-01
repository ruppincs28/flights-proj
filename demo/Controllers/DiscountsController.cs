using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using demo.Models;

namespace demo.Controllers
{
    public class DiscountsController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<Discount> Get()
        {
            return Discount.GetAll();
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public void Post([FromBody]Discount discount)
        {
            discount.insert();
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
            Discount.DeleteDiscount(id);
        }

        [HttpPut]
        [Route("api/discounts/edit")]
        public void modifyDiscount([FromBody]Discount discount)
        {
            Discount.ModifyDiscount(discount);
        }
    }
}