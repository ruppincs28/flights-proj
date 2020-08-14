using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace demo.Models
{
    public class Package
    {
        double longitude;
        double latitude;
        int price;
        string packageInfo;
        string arrivalTime;
        string departureTime;
        DateTime date;

        public Package(double longitude, double latitude, int price, string packageInfo, string arrivalTime, string departureTime, DateTime date)
        {
            this.Longitude = longitude;
            this.Latitude = latitude;
            this.Price = price;
            this.PackageInfo = packageInfo;
            this.ArrivalTime = arrivalTime;
            this.DepartureTime = departureTime;
            this.Date = date;
        }

        public double Longitude { get => longitude; set => longitude = value; }
        public double Latitude { get => latitude; set => latitude = value; }
        public int Price { get => price; set => price = value; }
        public string PackageInfo { get => packageInfo; set => packageInfo = value; }
        public string ArrivalTime { get => arrivalTime; set => arrivalTime = value; }
        public string DepartureTime { get => departureTime; set => departureTime = value; }
        public DateTime Date { get => date; set => date = value; }
    }
}