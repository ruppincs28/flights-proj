using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using demo.Models;

namespace demo.Controllers
{
    public class PackagesController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<Package> Get()
        {
            return Package.GetAll("noCompanyName");
        }

        // GET api/<controller>/5
        public IEnumerable<Package> Get(string companyname)
        {
            return Package.GetAll(companyname);
        }

        // POST api/<controller>
        public void Post([FromBody]Package package)
        {
            package.insert();
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(string id)
        {
            Package.DeletePackage(id);
        }

        [HttpPut]
        [Route("api/packages/edit")]
        public string modifyDiscount([FromBody]Package package)
        {
            return Package.ModifyPackage(package); // returns the new price
        }
    }
}