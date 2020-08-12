﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using demo.Models;

namespace demo.Controllers
{
    public class CompaniesController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(string username, string password)
        {
            Company c = Company.validateCompany(username, password);
            return c != null ? $"Validated`{c.Username}`{c.Image}" : "Failed`Failed`Failed";
        }

        // POST api/<controller>
        public string Post([FromBody]Company company)
        {
            int numAffected = company.insert();
            return numAffected != 0 ? $"Validated`{company.Username}`{company.Image}" : "Failed`Failed`Failed";
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}