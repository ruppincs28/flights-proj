using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace demo.Models
{
    public class Package
    {
        string id;
        double longitude;
        double latitude;
        double price;
        double profit;
        string packageInfo;
        string companyName;
        string city;
        string arrivalTime;
        string departureTime;
        DateTime date;

        public Package(string id, double longitude, double latitude, double price, double profit, string packageInfo, string companyName, 
            string city, string arrivalTime, string departureTime, DateTime date)
        {
            this.Id = id;
            this.Longitude = longitude;
            this.Latitude = latitude;
            this.Price = price;
            this.Profit = profit;
            this.PackageInfo = packageInfo;
            this.CompanyName = companyName;
            this.City = city;
            this.ArrivalTime = arrivalTime;
            this.DepartureTime = departureTime;
            this.Date = date;
        }

        public Package()
        {
            //
            // Empty constructor for DataReader
            //
        }

        public string Id { get => id; set => id = value; }
        public double Longitude { get => longitude; set => longitude = value; }
        public double Latitude { get => latitude; set => latitude = value; }
        public double Price { get => price; set => price = value; }
        public double Profit { get => profit; set => profit = value; }
        public string PackageInfo { get => packageInfo; set => packageInfo = value; }
        public string CompanyName { get => companyName; set => companyName = value; }
        public string City { get => city; set => city = value; }
        public string ArrivalTime { get => arrivalTime; set => arrivalTime = value; }
        public string DepartureTime { get => departureTime; set => departureTime = value; }
        public DateTime Date { get => date; set => date = value; }


        public static List<Package> GetAll()
        {
            DBservices dbs = new DBservices();
            return dbs.getPackages();
        }

        public int insert()
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.insert(this);
            return numAffected;
        }
    }
}