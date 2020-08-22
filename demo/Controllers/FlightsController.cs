using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using demo.Models;

namespace demo.Controllers
{
    public class FlightsController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<Flight> Get()
        {
            return Flight.GetAll();
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public void Post([FromBody]Flight flight)
        {
            if (flight.insert() != 0)
            {
                Package.UpdateRevenue(flight.PackageId, (flight.Passengers.Split(',').Length - 1) + 1);
            }
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }

        [HttpDelete]
        [Route("api/flights/deleteByEmail")]
        public void Delete(string email)
        {
            Flight.DeleteFlight(email);
        }
    }
}