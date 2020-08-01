using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace demo.Models
{
    public class Leg
    {
        string id;
        string tripId;
        int legNum;
        string flightNo;
        string codeFrom;
        string codeTo;
        string airlineCode;
        DateTime departureTime;
        DateTime arrivalTime;
        string flyDuration;

        public Leg(string id, string tripId, int legNum, string flightNo, string codeFrom, string codeTo, 
            string airlineCode, DateTime departureTime, DateTime arrivalTime, string flyDuration)
        {
            this.Id = id;
            this.TripId = tripId;
            this.LegNum = legNum;
            this.FlightNo = flightNo;
            this.CodeFrom = codeFrom;
            this.CodeTo = codeTo;
            this.AirlineCode = airlineCode;
            this.DepartureTime = departureTime;
            this.ArrivalTime = arrivalTime;
            this.FlyDuration = flyDuration;
        }

        public string Id { get => id; set => id = value; }
        public string TripId { get => tripId; set => tripId = value; }
        public int LegNum { get => legNum; set => legNum = value; }
        public string FlightNo { get => flightNo; set => flightNo = value; }
        public string CodeFrom { get => codeFrom; set => codeFrom = value; }
        public string CodeTo { get => codeTo; set => codeTo = value; }
        public string AirlineCode { get => airlineCode; set => airlineCode = value; }
        public DateTime DepartureTime { get => departureTime; set => departureTime = value; }
        public DateTime ArrivalTime { get => arrivalTime; set => arrivalTime = value; }
        public string FlyDuration { get => flyDuration; set => flyDuration = value; }
    }
}