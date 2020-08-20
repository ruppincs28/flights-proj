using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using demo.Models.DataBaseServices;

namespace demo.Models
{
    public class Admin
    {
        string username;
        string password;

        public Admin()
        {

        }


        public Admin(string username, string password)
        {
            this.Username = username;
            this.Password = password;
        }

        public string Username { get => username; set => username = value; }
        public string Password { get => password; set => password = value; }

        public static bool validateAdmin(string username, string password)
        {
            AdminsDBService adminsDBService = new AdminsDBService();
            Admin returnVal = adminsDBService.getAdmin(username);
            if (returnVal != null)
            {
                return returnVal.Password == password ? true : false;
            } 
            return false;
        }

    }
}