using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using demo.Models.DataBaseServices;

namespace demo.Models
{
    public class Airport
    {
        string id;
        string name;
        double lng;
        double lat;
        string city;
        string country;

        public Airport(string id, string name, double lng, double lat, string city, string country)
        {
            this.Id = id;
            this.Name = name;
            this.Lng = lng;
            this.Lat = lat;
            this.City = city;
            this.Country = country;
        }

        public string Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }
        public double Lng { get => lng; set => lng = value; }
        public double Lat { get => lat; set => lat = value; }
        public string City { get => city; set => city = value; }
        public string Country { get => country; set => country = value; }

        public static int insert(List<Airport> airports)
        {
            AirportsDBService airAirportsDbService = new AirportsDBService();
            int numAffected = airAirportsDbService.insert(airports);
            return numAffected;
        }


    }
}