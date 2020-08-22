using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using demo.Models.DataBaseServices;

namespace demo.Models
{
    public class Flight
    {
        string id;
        double price;
        DateTime departureTime;
        DateTime arrivalTime;
        string from;
        string codeFrom;
        string to;
        string codeTo;
        string stops;
        string airline;
        string numStops;
        string flyDuration;
        private List<Leg> legArr;
        DateTime orderDate;
        string passengers;
        string email;
        string packageId;

        static public List<Flight> list = new List<Flight>();

        public string Id { get => id; set => id = value; }
        public double Price { get => price; set => price = value; }
        public DateTime DepartureTime { get => departureTime; set => departureTime = value; }
        public DateTime ArrivalTime { get => arrivalTime; set => arrivalTime = value; }
        public string From { get => from; set => from = value; }
        public string CodeFrom { get => codeFrom; set => codeFrom = value; }
        public string To { get => to; set => to = value; }
        public string CodeTo { get => codeTo; set => codeTo = value; }
        public string Stops { get => stops; set => stops = value; }
        public string Airline { get => airline; set => airline = value; }
        public string NumStops { get => numStops; set => numStops = value; }
        public string FlyDuration { get => flyDuration; set => flyDuration = value; }
        public List<Leg> LegArr { get => legArr; set => legArr = value; }
        public DateTime OrderDate { get => orderDate; set => orderDate = value; }
        public string Passengers { get => passengers; set => passengers = value; }
        public string Email { get => email; set => email = value; }
        public string PackageId { get => packageId; set => packageId = value; }

        public Flight(string id, double price, DateTime departureTime, DateTime arrivalTime, string from, 
                        string codeFrom, string to, string codeTo, string stops, string airline, string numStops, 
                            string flyDuration, List<Leg> legArr, DateTime orderDate, string passengers, string email, string packageId)
        {
            this.Id = id;
            this.Price = price;
            this.DepartureTime = departureTime;
            this.ArrivalTime = arrivalTime;
            this.From = from;
            this.CodeFrom = codeFrom;
            this.To = to;
            this.CodeTo = codeTo;
            this.Stops = stops;
            this.Airline = airline;
            this.NumStops = numStops;
            this.FlyDuration = flyDuration;
            this.LegArr = legArr;
            this.OrderDate = orderDate;
            this.Passengers = passengers;
            this.Email = email;
            this.PackageId = packageId;
        }

        public Flight()
        {
            //
            // Empty constructor for DataReader
            //
        }

        public int insert()
        {
            FlightsDBService flightsDBService = new FlightsDBService();
            int numAffected = flightsDBService.insert(this);
            LegsDBService legsDBService = new LegsDBService();
            int numAffected2 = legsDBService.insert(this.LegArr);
            return numAffected;
        }

        public static DateTime GetDateTime(string dateStr)
        {
            return DateTime.ParseExact(dateStr, "MM-dd-yyyy HH:mm:ss", CultureInfo.InvariantCulture);
        }

        public static List<Flight> GetAll()
        {
            FlightsDBService flightsDBService = new FlightsDBService();
            return flightsDBService.getFlights();
        }

        public static void DeleteFlight(string email)
        {
            // read the discount table from the database into a dbs object
            FlightsDBService dbs = new FlightsDBService();
            dbs = dbs.readFlight(email);

            foreach (DataRow dr in dbs.dt.Rows)
            {
                dr.Delete();
            }
            // update the DB
            dbs.update();
        }
    }
}