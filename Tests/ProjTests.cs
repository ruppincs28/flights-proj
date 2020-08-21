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
            string indexPageUrl = "http://localhost:55739/Pages/index.html";
            string flightsPageUrl = "http://localhost:55739/Pages/flights.html";
            string toursPageUrl = "http://localhost:55739/Pages/tours.html";
            ChromeDriver.Navigate().GoToUrl(indexPageUrl);

            IWebElement packageLogo = ChromeDriver.FindElement(By.XPath("//img[@src='vendor.png']"));
            Thread.Sleep(10000);
            packageLogo.Click();

            IWebElement registerCompanyButton = ChromeDriver.FindElement(By.Id("registerCompany"));
            Thread.Sleep(6000);
            registerCompanyButton.Click();

            IWebElement userCompanyNameEntry = ChromeDriver.FindElement(By.Id("companyUsername"));
            Thread.Sleep(3000);
            userCompanyNameEntry.SendKeys("testCompanySelenium2");

            IWebElement userCompanyImageEntry = ChromeDriver.FindElement(By.Id("companyImage"));
            Thread.Sleep(3000);
            userCompanyImageEntry.SendKeys("https://thelogocompany.net/wp-content/uploads/2018/07/amazing-tours.png");

            IWebElement userCompanyPasswordEntry = ChromeDriver.FindElement(By.Id("companyPassword"));
            Thread.Sleep(3000);
            userCompanyPasswordEntry.SendKeys("1234");

            IWebElement userCompanyAgreeCheckbox = ChromeDriver.FindElement(By.Id("companyAgree"));
            Thread.Sleep(3000);
            userCompanyAgreeCheckbox.Click();
            userCompanyAgreeCheckbox.Click();

            IWebElement submitCompanyRegisterButton = ChromeDriver.FindElement(By.Id("submitCompanyRegister"));
            Thread.Sleep(3000);
            submitCompanyRegisterButton.Click();

            Thread.Sleep(6000);


            IWebElement searchMenuButton = ChromeDriver.FindElement(By.Id("searchBookFlights"));
            Thread.Sleep(5000);
            searchMenuButton.Click();

            IWebElement destinationCityEntry  = ChromeDriver.FindElement(By.Name("sources"));
            Thread.Sleep(3000);
            destinationCityEntry.SendKeys("Istanbul");



            Thread.Sleep(3000);
            DateTime today = DateTime.Today.AddDays(3);
            DateTime endDateTxt = today.AddDays(3);
            IWebElement startDate = ChromeDriver.FindElement(By.Id("startDATE"));
            startDate.SendKeys(today.ToString());

            Thread.Sleep(3000);
            IWebElement arrivalTimeEntry = ChromeDriver.FindElement(By.Id("arrivalTime"));
            arrivalTimeEntry.SendKeys("09:00");

            Thread.Sleep(3000);
            IWebElement departureTimeEntry  = ChromeDriver.FindElement(By.Id("departureTime"));
            departureTimeEntry.SendKeys("20:00");

            Thread.Sleep(5000);
            IWebElement searchButton = ChromeDriver.FindElement(By.Id("searchBTN"));
            searchButton.Click();
            searchButton.Click();

            Thread.Sleep(15000);
            ChromeDriver.FindElement(By.XPath("//input[@class='addButton btn btn-primary'][@value='Order']")).Click();

            Thread.Sleep(5000);
            IWebElement profitEntry  = ChromeDriver.FindElement(By.Id("profit"));
            profitEntry.SendKeys("15%");

            Thread.Sleep(3000);
            IWebElement placeOrederButton = ChromeDriver.FindElement(By.Id("submitOrder"));
            placeOrederButton.Click();

            Thread.Sleep(2000);
            ChromeDriver.FindElement(By.XPath("//button[@class='swal-button swal-button--confirm']")).Click();

            Thread.Sleep(6000);
            IWebElement adminInterfaceButton  = ChromeDriver.FindElement(By.Id("orderInterfaceBTN"));
            adminInterfaceButton.Click();

            Thread.Sleep(7000);
            IWebElement logoutButton  = ChromeDriver.FindElement(By.TagName("a"));
            logoutButton.Click();

            Thread.Sleep(3000);
            IWebElement flyFrom = ChromeDriver.FindElement(By.Name("sources"));
            ChromeDriver.Navigate().GoToUrl(flightsPageUrl);

            Thread.Sleep(7000);
            searchMenuButton = ChromeDriver.FindElement(By.Id("searchBookFlights"));
            searchMenuButton.Click();

            Thread.Sleep(1500);
            flyFrom = ChromeDriver.FindElement(By.Name("sources"));
            flyFrom.SendKeys("Ben Gurion");
            Thread.Sleep(1500);

            IWebElement flyTo = ChromeDriver.FindElement(By.Name("destinations"));
            flyTo.SendKeys("Athens International");
            Thread.Sleep(1500);

            IWebElement endDate = ChromeDriver.FindElement(By.Id("endDATE"));
            startDate = ChromeDriver.FindElement(By.Id("startDATE"));
            startDate.SendKeys(today.ToString());
            Thread.Sleep(1500);
            endDate.SendKeys(endDateTxt.ToString());

            Thread.Sleep(1500);
            searchButton = ChromeDriver.FindElement(By.Id("searchBTN"));
            searchButton.Click();
            Thread.Sleep(10000);

            IWebElement showPackageInFlightButton = ChromeDriver.FindElement(By.ClassName("hasTooltip"));
            showPackageInFlightButton.Click();
            Thread.Sleep(6000);

            IWebElement orderFlightWithPackageButton = ChromeDriver.FindElement(By.XPath("//tr[contains(@class, 'hasTooltip')]//input"));
            orderFlightWithPackageButton.Click();
            Thread.Sleep(10000);

            ChromeDriver.Quit();
        }
    }
}
