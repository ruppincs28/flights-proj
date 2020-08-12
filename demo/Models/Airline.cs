﻿using System.Collections.Generic;

namespace demo.Models
{
    public class Airline
    {
        string id;
        string name;

        public Airline(string id, string name)
        {
            this.Id = id;
            this.Name = name;
        }

        public string Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }

        public static int insert(List<Airline> airlines)
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.insert(airlines);
            return numAffected;
        }


    }
}