using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using demo.Models.DataBaseServices;

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
        double salesProfit;

        public Package(string id, double longitude, double latitude, double price, double profit, string packageInfo, string companyName, 
            string city, string arrivalTime, string departureTime, DateTime date, double salesProfit)
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
            this.SalesProfit = salesProfit;
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
        public double SalesProfit { get => salesProfit; set => salesProfit = value; }

        public static List<Package> GetAll(string companyName)
        {
            PacagesDBService pacagesDBService = new PacagesDBService();
            return pacagesDBService.getPackages(companyName);
        }

        public int insert()
        {
            PacagesDBService pacagesDBService = new PacagesDBService();
            int numAffected = pacagesDBService.insert(this);
            return numAffected;
        }

        public static void UpdateRevenue(string packageId, int numPassengers) // number of passengers is needed to calculate revenue
        {
            // read the package table from the database into a dbs object
            PacagesDBService dbs = new PacagesDBService();
            dbs = dbs.readPackage(packageId);

            foreach (DataRow dr in dbs.dt.Rows)
            {
                double profitForOnePackage = (Convert.ToDouble(dr["Price"])) - (Convert.ToDouble(dr["Price"]) / (1 + (Convert.ToDouble(dr["Profit"]) / 100)));
                double newSalesProfit = Convert.ToDouble(dr["Salesprofit"]) + (profitForOnePackage * numPassengers);
                dr["Salesprofit"] = newSalesProfit;
            }
            // update the DB
            dbs.update();
        }

        public static string ModifyPackage(Package package)
        {
            // read the discount table from the database into a dbs object
            PacagesDBService dbs = new PacagesDBService();
            dbs = dbs.readPackage(package.Id);

            double newPrice = 0;

            foreach (DataRow dr in dbs.dt.Rows)
            {
                double originalPrice = Convert.ToDouble(dr["Price"]) / (1 + (Convert.ToDouble(dr["Profit"]) / 100));
                newPrice = originalPrice * (1 + (package.Profit / 100));
                dr["Price"] = newPrice;
                dr["Profit"] = package.Profit;
            }
            // update the DB
            dbs.update();

            // return updated price string
            return $"{newPrice}€";
        }

        public static void DeletePackage(string id)
        {
            // read the discount table from the database into a dbs object
            PacagesDBService dbs = new PacagesDBService();
            dbs = dbs.readPackage(id);

            foreach (DataRow dr in dbs.dt.Rows)
            {
                dr.Delete();
            }
            // update the DB
            dbs.update();
        }
    }
}