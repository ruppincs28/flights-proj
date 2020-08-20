using System;
using System.IO;
using System.Threading;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace Tests
{
    class ProjTests
    {
        static void Main(string[] args)
        {
            IWebDriver ChromeDriver = new ChromeDriver($"{Directory.GetCurrentDirectory()}");

            ChromeDriver.Navigate().GoToUrl("http://localhost:55739/Pages/flights.html");

            IWebElement searchFlightsElement = ChromeDriver.FindElement(By.Id("searchBookFlights"));
            IWebElement flyFrom = ChromeDriver.FindElement(By.Name("sources"));
            IWebElement flyTo = ChromeDriver.FindElement(By.Name("destinations"));
            IWebElement startDate = ChromeDriver.FindElement(By.Id("startDATE"));
            IWebElement endDate = ChromeDriver.FindElement(By.Id("endDATE"));
            IWebElement searchButton = ChromeDriver.FindElement(By.Id("searchBTN"));

            Thread.Sleep(5000);
            searchFlightsElement.Click();
            Thread.Sleep(1500);
            flyFrom.SendKeys("Ben Gurion");
            Thread.Sleep(1500);
            flyTo.SendKeys("Athens International");
            Thread.Sleep(1500);
            DateTime today = DateTime.Today;
            DateTime endDateTxt = DateTime.Today.AddDays(3);
            startDate.SendKeys(today.ToString());
            Thread.Sleep(1500);
            endDate.SendKeys(endDateTxt.ToString());
            Thread.Sleep(1500);
            searchButton.Click();
            Thread.Sleep(10000 * 3);
            ChromeDriver.Navigate().GoToUrl("http://localhost:55739/Pages/Tours.html");
            Thread.Sleep(10000);
            ChromeDriver.Quit();
        }
    }
}
