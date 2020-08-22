function getMaxConnection(route) {
    result = [];
    let maxTimeSpentInCountry = 0;
    let maxConnection;
    let arrivalToMaxConnection;
    let departureFromMaxConnection;
    let timeSpentInCountry = 0;
    let departureTime, arrivalTime;
    for (var i = 0; i < route.length; i++) {
        let { id, cityFrom, flyFrom, flyTo, airline, dTime, aTime, flight_no, dTimeUTC, aTimeUTC } = route[i];
        departureTime = convertToHumanTime(dTime).replace(" ", "T");
        lastArrivalTime = arrivalTime;
        arrivalTime = convertToHumanTime(aTime).replace(" ", "T");
        currRouteObj = {
            Id: id,
            LegNum: i + 1,
            FlightNo: '' + flight_no,
            CityFrom: cityFrom,
            CodeFrom: flyFrom,
            CodeTo: flyTo,
            AirlineCode: airline,
            DepartureTime: convertToHumanTime(dTime).replace(" ", "T"),
            ArrivalTime: convertToHumanTime(aTime).replace(" ", "T"),
            FlyDuration: unixToHourMinute(aTimeUTC - dTimeUTC)
        }
        if ((i !== 0 && i != route.length - 1) || (route.length == 2 && i == 1)) { // calculate time in country
            timeSpentInCountry = diffInMinutes(departureTime, lastArrivalTime); // departure from current leg minus arrival to this leg
            if (timeSpentInCountry > maxTimeSpentInCountry) {
                maxTimeSpentInCountry = timeSpentInCountry;
                maxConnection = currRouteObj;
                arrivalToMaxConnection = lastArrivalTime;
                departureFromMaxConnection = departureTime;
            }
        }
    }
    return {
        lengthMaxConnection: maxTimeSpentInCountry / 60,
        maxConnectionObj: maxConnection,
        arrivalToMaxConnection: arrivalToMaxConnection,
        departureFromMaxConnection: departureFromMaxConnection
    };
}


function findPackage(city, arrival, departure) { // returns package obj if available, otherwise false
    if (!(arrival.split("T")[0] === departure.split("T")[0]) || diffInMinutes(departure, arrival) < 2 * 60) // we dont want clients rushing to see museums :)
        return false; // this connection is overnight, so the client has bigger problems than which museum they should visit :)
    let dateToSearchFor = arrival.split("T")[0];
    let valid = false;
    let packagesArr = JSON.parse(localStorage["packagesUpdated"]);
    let validItems = [];
    for (var i = 0; i < packagesArr.length; i++) {
        let currentItem = packagesArr[i];
        if ((currentItem.City === city) && (currentItem.Date.split("T")[0] === dateToSearchFor)) {  // we might have a match
            valid = validatePackageIsViable(currentItem.PackageInfo, city, arrival, departure); // but still need to validate this trip is viable for the clients hours
            if (valid)
                validItems.push(currentItem);
        }
    }
    if (validItems.length === 0)
        return false;
    // take the cheapest package that fits the client
    let minPrice = validItems[0].Price;
    let minPackage = validItems[0];
    for (var j = 0; j < validItems.length; j++) {
        if (validItems[j].Price < minPrice) {
            minPrice = validItems[j].Price;
            minPackage = validItems[j];
        }
    }
    return minPackage;
}


function validatePackageIsViable(packageInfo, city, arrival, departure) {
    // call triposo api and see that our package matches, return true/false accordingly
    packageInfo = JSON.parse(packageInfo);
    suspectedPackageSequence = packageInfo.sequence;
    let [startDate, startTime] = arrival.split('T');
    let [endDate, endTime] = departure.split('T');
    startTime = startTime.substring(0, startTime.length - 3);
    endTime = endTime.substring(0, endTime.length - 3);
    var triposoRes, triposoQueryURL = getQueryURLTriposo(city, startDate, endDate, startTime, endTime);
    jQuery.ajaxSetup({ async: false });
    $.get(triposoQueryURL).done((data) => {
        triposoRes = data;
    });
    $.get(triposoQueryURL).fail((err) => {
        console.log(err);
    });
    jQuery.ajaxSetup({ async: true });
    if (triposoRes.results[0].days.length === 0)
        return false;
    let itineraryArr = triposoRes.results[0].days[0].itinerary_items;
    let exactPackage = getExactPackageSequence(itineraryArr);
    let identical = ((exactPackage.length === suspectedPackageSequence.length) && exactPackage.every(function (value, index) { return value === suspectedPackageSequence[index] }));
    if (identical)
        return true;
    return false;
}


function getExactPackageSequence(package) {
    let packageSequenceResult = [];
    for (var i = 0; i < package.length; i++) {
        let currentItem = package[i];
        let title = currentItem.title;
        packageSequenceResult.push(title);
    }
    return packageSequenceResult;
}

function assemblePackageStr(maxConnectionStr, package) {
    let packageInfoParsed = JSON.parse(package.PackageInfo);
    let companyName = package.CompanyName;
    delete packageInfoParsed['sequence'];
    delete packageInfoParsed['cityPicURL'];
    let res = "";
    let resArr = [];
    let companyImg = JSON.parse(localStorage["companiesUpdated"]).find((company) => company.Username === companyName).Image;
    let uuid = uuidv4();
    res +=
        '<br><div class="col-lg-12">' +
        '        <div class="panel panel-default" id="' + uuid + '">' +
        '<div class="panel-body">' +
        '<h3 id="planTitle">' + package.City + '</h3>' +
        '<h4 id="planDate">' + package.Date.split("T")[0] + '</h4>';
    res += '<b>' + maxConnectionStr + '</b><br>';
    res += '<b>Were pleased to offer you a package that might lighten your stay in this connection :)</b><br><br>';
    for (k1 in packageInfoParsed) {
        res += (k1 ? '<b>' + (k1 + '</b>' + '</br>') : "");
        for (k2 in packageInfoParsed[k1]) {
            res += k2 + '</br>' + packageInfoParsed[k1][k2] + '</br>';
        }
    }
    res += '<h4>Offer By Company: ' + companyName + '</h4>';
    res += '<h4>Price: ' + package.Price + '€</h4>';
    res += '<img id="logo" src="' + companyImg + '" />';
    res += '</div></div></div>';
    resArr.push(res);
    resArr.push(uuid);
    return resArr;
}

function updatePanelPic(cityPic, divId) {
    $(divId).css('background',
        'linear-gradient(to bottom, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.65) 100%), url("' + cityPic + '")');
    $(divId).css('background-size', 'cover');
    $(divId).css('background-position', '50%');
    $(divId).css('background-repeat', 'no-repeat');
}


function handlePackageInOrderForm(selector) {
    // some adjustments are needed in order forms for package + flight combo
    $('label[for="package"]').remove();
    $('#package').remove();
    $('#packagePriceStr').remove();
    if ($(selector).data("haspackage") === "hasPackage") {
        $('label[for="agree"]').after('<label for="package">' +
            '<input type="checkbox" checked="checked" name="package" id="package" >&nbsp;&nbsp;Also include package for max connection' +
            '</label>');
        let total = parseInt($(selector).data("price").substring(0, $(selector).data("price").length - 2)) + parseInt($(selector).data("packageprice"));
        $("#flightPriceStr").after('<div id="packagePriceStr"><div><b>&nbsp;&nbsp;Price of package: '
            + $(selector).data("packageprice") + '€</b></div><div><b>&nbsp;&nbsp;Total Price: ' + total + '€' + '</b></div><br></div>');
        $('#package').click(function () {
            $("#packagePriceStr").toggle(this.checked);
        });
    }
}