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


function findPackage(city, arrival, departure) { // returns package string if available, otherwise false
    if (!(arrival.split("T")[0] === departure.split("T")[0]))
        return false; // this connection is overnight, so the client has bigger problems than which museum they should visit :)
    let dateToSearchFor = arrival.split("T")[0];
    let valid = false;
    let packagesArr = JSON.parse(localStorage["packagesUpdated"]);
    for (var i = 0; i < packagesArr.length; i++) {
        let currentItem = packagesArr[i];
        console.log(currentItem.City, city, currentItem.Date.split("T")[0], dateToSearchFor)
        if ((currentItem.City === city) && (currentItem.Date.split("T")[0] === dateToSearchFor)) {  // we might have a match
            valid = validatePackageIsViable(currentItem.PackageInfo, city, arrival, departure); // but still need to validate this trip is viable for the clients hours
            if (valid)
                return 'test';
        }
    }
    return false;
}


function validatePackageIsViable(packageInfo, city, arrival, departure) {
    // call triposo api and see that our package matches, return true/false accordingly
    packageInfo = JSON.parse(packageInfo);
    suspectedPackageSequence = packageInfo.sequence;
    console.log(suspectedPackageSequence)
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
    console.log(identical)
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
    console.log(packageSequenceResult)
    return packageSequenceResult;
}
