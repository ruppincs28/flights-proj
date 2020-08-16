var codesUrl = "https://api.skypicker.com/locations?type=dump&locale=en-US&location_types=airport&limit=4000&active_only=true&sort=name";
var airlineCodesUrl = "https://api.skypicker.com/airlines?";
var triposoCreds = "account=FJOB5WE1&token=qu3z0x9m3ur20a5l6hzr5wmblv9mtpdo";
$(document).ready(function () {
    // populate datalist with data
    if (!('locationCodes' in localStorage)) {
        $.get(codesUrl).done((data) => {
            codesArr = data.locations
            localStorage['locationCodes'] = JSON.stringify(codesArr)
            populateDataList(codesArr)
        });
        $.get(codesUrl).fail((err) => {
            console.log(err);
        });
    } else { // localStorage already contains the location codes
        codesArr = JSON.parse(localStorage['locationCodes'])
        populateDataList(codesArr)
    }
    // populate datalist with data

    // get packages on page load
    ajaxCall("GET", "../api/packages", "", (data) => {
        console.log(data);
        localStorage["packagesUpdated"] = JSON.stringify(data);
        $("#loadingTabs").hide();
        $("#tabsNav").show();
    }, (err) => {
        console.log(err);
    });
    // get packages on page load

    // interface show/hide handling
    $("#searchBookFlights").click(() => {
        $("#mainFramePanel").attr('class', 'panel panel-primary');
        $("#mainFrameTitle").html("Flight Booking");
        $("#mainFrame").show();
        $("#adminLoginForm").hide();
        $("#adminPanel").hide();
        $("#flightBookForm").show();
    });
    $("#orderInterfaceBTN").click(() => {
        $("#flightBookForm").hide();
        $("#mainFramePanel").attr('class', 'panel panel-warning');
        $("#mainFrameTitle").html("Admin Interface");
        $("#mainFrame").show();
        if ('adminLoggedIn' in localStorage) {
            $("#adminLoginForm").hide();
            $("#adminPanel").show();
        } else {
            $("#adminLoginForm").show();
            return;
        }
        ajaxCall("GET", "../api/flights", "", getOrdersSuccess, discountErr); // load orders from server
        $("#orderInterface").show();
    });
    $("#discountInterfaceBTN").click(() => {
        $("#orderInterface").hide();
        ajaxCall("GET", "../api/discounts", "", getDiscountsSuccess, discountErr); // load discounts from server
        $("#discountInterface").show();
    });
    $("#cancelOrder").click(() => {
        $("#orderFrame").hide();
        $("#tablePH").show();
    });
    // interface show/hide handling

    // login submit
    $("#loginForm").submit(login);

    $("#discountCancelBTN").on("click", function () {
        discount = null;
        $("#discountEditDiv").hide();
    });

    $("#discountForm").submit(discountEditSubmitHandler); // wire the submit event to a function called f1
    $("#searchForm").submit(handleSearch);
    $("#myFlightsBTN").click(handleMyFlights);
    $('input[name="sources"], input[name="destinations"]').on("blur", validateInDataList);

    // validate dates in form
    dateStabilizer();
}
)


function getOrdersSuccess(orderdata) {
    if ($.fn.dataTable.isDataTable("#orderTable")) { // dont create datatable if it exists, will result in error
        redrawTable(orderTbl, orderdata);
        return;
    }

    try {
        orderTbl = $('#orderTable').DataTable({
            data: orderdata,
            pageLength: 5,
            scrollX: true,
            columns: [
                { data: "Id" },
                { data: "Email" },
                {
                    data: "Price",
                    render: function (data, type, row, meta) {
                        return `${row.Price} €`;
                    }
                },
                { data: "CodeFrom" },
                { data: "CodeTo" },
                {
                    data: "DepartureTime",
                    render: function (data, type, row, meta) {
                        return row.DepartureTime.replace("T", " ");
                    }
                },
                {
                    data: "ArrivalTime",
                    render: function (data, type, row, meta) {
                        return row.ArrivalTime.replace("T", " ");
                    }
                },
                { data: "Stops" },
                { data: "FlyDuration" },
                {
                    data: "OrderDate",
                    render: function (data, type, row, meta) {
                        return row.OrderDate.replace("T", " ");
                    }
                },
                { data: "Passengers" }
            ],
        });
        $("#orderLoading").hide();
        $("#orderEditForm").show();
        orderTbl.columns.adjust();
        buttonEvents();
    }

    catch (err) {
        console.log("err: " + err);
    }
}


function getDiscountsSuccess(discountdata) {
    localStorage["discountsUpdated"] = JSON.stringify(discountdata); // maintain most recent discount arr

    if ($.fn.dataTable.isDataTable("#discountTable")) { // dont create datatable if it exists, will result in error
        redrawTable(tbl, discountdata);
        return;
    }

    try {
        tbl = $('#discountTable').DataTable({
            data: discountdata,
            pageLength: 5,
            columns: [
                {
                    render: function (data, type, row, meta) {
                        let dataDiscount = "data-discountId='" + row.Id + "'";

                        editBtn = "<button type='button' class = 'discountEditBtn btn btn-success' " + dataDiscount + "> Edit </button>";
                        viewBtn = "<button type='button' class = 'discountViewBtn btn btn-info' " + dataDiscount + "> View </button>";
                        deleteBtn = "<button type='button' class = 'discountDeleteBtn btn btn-danger' " + dataDiscount + "> Delete </button>";
                        return editBtn + viewBtn + deleteBtn;
                    }
                },
                { data: "Id" },
                { data: "Airline" },
                { data: "From" },
                { data: "To" },
                {
                    data: "StartDate",
                    render: function (data, type, row, meta) {
                        return row.StartDate.split("T")[0];
                    }
                },
                {
                    data: "EndDate",
                    render: function (data, type, row, meta) {
                        return row.EndDate.split("T")[0];
                    }
                },
                { data: "DiscountRate" }
            ],
        });
        $("#discountLoading").hide();
        $("#discountEditForm").show();
        tbl.columns.adjust();
        buttonEvents();
    }

    catch (err) {
        console.log("err: " + err);
    }
}

// this function is activated in case of a failure
function discountErr(err) {
    swal("Error: " + err);
}


function login() {
    // handle login logic
    let qstring = "../api/admins?username=" + $("#username").val() + "&password=" + $("#password").val();
    ajaxCall("GET", qstring, "", loginSuccess, loginErr);
    return false; // preventDefault
}


function loginSuccess(data) {
    if (data === "Validated") {
        localStorage['adminLoggedIn'] = "loggedIn";
        swal("logged in successfully!", "Great Job", "success");
        $('#orderInterfaceBTN').trigger('click');
    }
    else {
        swal("wrong credentials");
    }
}


function loginErr() {
    alert("something went wrong with authentication");
}


function validateInDataList() {
    let parsedArr = JSON.parse(localStorage['locationCodes'])

    if (typeof parsedArr.find(x => x.name === $(this).val()) === "undefined") {
        this.validity.valid = false;
        this.setCustomValidity('Value not from list');
    }
    else {
        this.validity.valid = true;
        this.setCustomValidity('');
    }
}


function populateDataList(codesArr) {
    for (var i = 0; i < codesArr.length; i++) {
        let code = codesArr[i].code;
        let name = codesArr[i].name;
        $("datalist").append('<option label="' + code + '"' + ' value="' + name + '">');
    }
}


function handleMyFlights() {
    ajaxCall("GET", "../api/flights", "", handleGetSuccess, handleGetErr);
}


function handleSearch() {
    // value attribute will be used to find airport code
    let fromVal = $('input[name="sources"]').val();
    let toVal = $('input[name="destinations"]').val();

    let from = $('#sources [value="' + fromVal + '"]').attr('label');
    let to = $('#destinations [value="' + toVal + '"]').attr('label');
    let start = $("#startDATE").val();
    let end = $("#endDATE").val();
    let url = getQueryURL(from, to, reverseDate(start), reverseDate(end))
    $("#tablePHLoader").show();
    $("#tablePH").hide();
    ajaxCall("GET", url, "", handleSearchSuccess, handleSearchError);
    return false;
}


function handleSearchSuccess(data) {
    dataArr = data.data
    if (dataArr.length === 0) {
        $("#tablePH").empty()
        $("#tablePH").append(
            '<div id="searchRes">No Results</div>'
        )
        return;
    }
    let rowsWithTooltip = [];
    for (var i = 0; i < dataArr.length; i++) {
        if (i === 0) {
            $("#tablePH").empty()
            $("#tablePH").append(
                '<br><div class="col-lg-12">' +
                '        <div class="panel panel-default">' +
                '            <div class="panel-heading">' +
                '                <h3>Search Query Results</h3>' +
                '            </div>' + '<div class="panel-body">' +
                '<table class="table table-condensed" style="border-collapse:collapse;">' +
                '                    <thead>' +
                '                        <tr>' +
                '                            <th>&nbsp;</th>' +
                '                            <th>Price</th>' +
                '                            <th>Departure time</th>' +
                '                            <th>Arrival time</th>' +
                '                            <th>From</th>' +
                '                            <th>To</th>' +
                '                            <th>Stops</th>' +
                '                            <th>Airline name</th>' +
                '                            <th>Order</th>' +
                '                        </tr>' +
                '                    </thead>' +
                '                    <tbody id="resultPH"></tbody></table></div></div></div>'
            );
        }
        let currentItem = dataArr[i]
        let flightId = currentItem.id
        let price = currentItem.conversion.EUR + ' €'
        let departureTime = convertToHumanTime(currentItem.dTime)
        let arrivalTime = convertToHumanTime(currentItem.aTime)
        let from = currentItem.cityFrom + ', ' + currentItem.countryFrom.name
        let codeFrom = currentItem.flyFrom
        let to = currentItem.cityTo + ', ' + currentItem.countryTo.name
        let codeTo = currentItem.flyTo
        let flyDuration = currentItem.fly_duration
        var stops = ''
        let airline = currentItem.route[0].airline
        for (var j = 0; j < currentItem.route.length; j++) {
            if (currentItem.route.length === 1) {
                break;
            }
            currentRoute = currentItem.route[j]
            stops += currentRoute.cityTo + ', '
        }
        if (stops !== '') {
            let targetCity = to.split(',')[0]
            stops = stops.replace(targetCity, "")
            stops = stops.substring(0, stops.length - 4)
        } else {
            stops = 'Direct flight'
        }
        let numStops = (stops === 'Direct flight') ? 0 : (stops.match(/,/g) || []).length + 1;
        let route = JSON.stringify(currentItem.route);
        let newPrice = discountCheck(numStops, codeFrom, codeTo, airline, price, departureTime, arrivalTime);
        let newPriceStr = (newPrice !== false) ? ('<td id="discounted">' + newPrice + ' €' + '</td>') : ('<td>' + price + '</td>');
        dataStr = ` data-price="${newPrice ? newPrice : price}" \
                                                data-departuretime="${departureTime}" \
                                                data-flightid="${flightId}" \
                                                data-arrivaltime="${arrivalTime}" \
                                                data-from="${from}" \
                                                data-codefrom="${codeFrom}" \
                                                data-codeto="${codeTo}" \
                                                data-to="${to}" \
                                                data-route='${route}' \
                                                data-stops="${stops}" \
                                                data-numstops="${numStops}" \
                                                data-flyduration="${flyDuration}" \
                                                data-airline="${airline}" `
        let maxConnectionAssArr = getMaxConnection(currentItem.route);
        let maxConnectionStr = maxConnectionAssArr.maxConnectionObj ? `Length of max connection: 
                ${maxConnectionAssArr.lengthMaxConnection}, in: ${maxConnectionAssArr.maxConnectionObj.CityFrom}, hours: ${maxConnectionAssArr.arrivalToMaxConnection} - ${maxConnectionAssArr.departureFromMaxConnection}`
            : `No connection`;
        let packageStr = findPackage(maxConnectionAssArr.maxConnectionObj.CityFrom,
            maxConnectionAssArr.arrivalToMaxConnection, maxConnectionAssArr.departureFromMaxConnection);
        let rowStr;
        console.log("SAK : " + packageStr)
        if (packageStr === 'test')
            rowStr = '<tr data-toggle="collapse" data-target="#entry' + i + '" class="accordion-toggle ' + 'hasTooltip' + '">';
        else
            rowStr = '<tr data-toggle="collapse" data-target="#entry' + i + '" class="accordion-toggle">';
        $("#resultPH").append(
            rowStr +
            '<td><button class="btn btn-default btn-xs"><span class="glyphicon glyphicon-eye-open"></span></button></td>' +
            '<td>' + price + '</td>' +
            '<td>' + departureTime + '</td>' +
            '<td>' + arrivalTime + '</td>' +
            '<td>' + from + '</td>' +
            '<td>' + to + '</td>' +
            '<td>' + stops + '</td>' +
            '<td>' + airline + '</td>' +
            '<td>' + '<center><input type="button" class="addButton" value="Order"' + dataStr + '/>' + '</center></td>' +
            '</tr>' +
            '<tr>' +
            '<td colspan="12" class="hiddenRow">' + '<div id="entry' + i + '" class="accordian-body collapse">' + maxConnectionStr + '</div>' + '</td>' +
            '</tr>'
        );
    }
    $("#tablePHLoader").hide();
    $("#tablePH").show();
    $('body').tooltip();
    $(".addButton").on("click", function () {
        document.getElementById("orderForm").reset();
        let flightId = $(this).data("flightid");
        let price = parseFloat($(this).data("price"));
        let departureTime = $(this).data("departuretime").replace(" ", "T");
        let arrivalTime = $(this).data("arrivaltime").replace(" ", "T");
        let from = $(this).data("from");
        let codeFrom = $(this).data("codefrom");
        let to = $(this).data("to");
        let codeTo = $(this).data("codeto");
        let stops = $(this).data("stops");
        let airline = $(this).data("airline");
        let numStops = $(this).data("numstops");
        let flyDuration = $(this).data("flyduration");
        let legArr = constructLegs($(this).data("route"), flightId);
        let orderDate = moment().format("YYYY-MM-DDTHH:mm:ss");
        $("#tablePH").hide();
        $("#orderFrame").show();
        $('#orderForm').unbind('submit').submit(function () {
            let o = {
                Id: flightId,
                Price: price,
                DepartureTime: departureTime,
                ArrivalTime: arrivalTime,
                From: from,
                CodeFrom: codeFrom,
                To: to,
                CodeTo: codeTo,
                Stops: stops,
                Airline: airline,
                NumStops: numStops,
                FlyDuration: flyDuration,
                LegArr: legArr,
                OrderDate: orderDate,
                Passengers: $("#orderNames").val(),
                Email: $("#orderEmail").val()
            }
            ajaxCall("POST", "../api/flights", JSON.stringify(o), flightPostSuccess, (err) => swal("Error: " + err));
            return false; // preventDefault
        });
    })
}


function findPackage(city, arrival, departure) { // returns package string if available, otherwise false
    if (!(arrival.split("T")[0] === departure.split("T")[0]))
        return false; // this connection is overnight, so the client has bigger problems than which museum they should visit :)
    let dateToSearchFor = arrival.split("T")[0];
    let valid = false;
    packagesArr = JSON.parse(localStorage["packagesUpdated"]);
    for (var i = 0; i < packagesArr.length; i++) {
        let currentItem = packagesArr[i];
        if (currentItem.City === city && currentItem.Date.split("T")[0] === dateToSearchFor) {  // we might have a match
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
    packageInfo = JSON.stringify(objectKeysToLowerCase(packageInfo));
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
    let exactPackage = JSON.stringify(objectKeysToLowerCase(getExactPackage(itineraryArr)));
    console.log(exactPackage)
    console.log(packageInfo)
    let identical = comparePackages(JSON.parse(exactPackage), JSON.parse(packageInfo));
    console.log(identical)
    if (identical)
        return true;
    return false;
}


function comparePackages(pkg1, pkg2) {
    for (var i = 0; i < pkg1.length; i++) {
        try {
            if (pkg1[i].length !== pkg2[i].length)
                return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    return true;
}


function getExactPackage(package) {
    let packageResult = {};
    let lastTitle;
    for (var i = 0; i < package.length; i++) {
        let currentItem = package[i];
        let title = currentItem.title;
        let description = currentItem.description;
        let poiName = currentItem.poi.name;
        if (title !== "") { // load associative array with package info on each iteration
            packageResult[title] = {};
            packageResult[title][poiName] = description;
        } else {
            packageResult[lastTitle][poiName] = description;
        }
        lastTitle = title;
    }
    return packageResult;
}


function flightPostSuccess() {
    $('#cancelOrder').trigger('click');
    swal("Ordered Successfully!", "Great Job", "success");
}


function handleSearchError(err) {
    console.log(err.responseJSON.ExceptionMessage)
}


function getQueryURL(from, to, dateFrom, dateTo) {
    return `https://api.skypicker.com/flights?flyFrom=${from}&to=${to}&dateFrom=${dateFrom}&dateTo=${dateTo}&partner=picky`
}


function getQueryURLTriposo(locationId, startDate, endDate, arrivalTime, departureTime) {
    return `https://www.triposo.com/api/20200803/day_planner.json?location_id=${locationId}&start_date=${startDate}
                &end_date=${endDate}&arrival_time=${arrivalTime}&departure_time=${departureTime}&${triposoCreds}`
}


function constructLegs(route, tripId) {
    result = []
    for (var i = 0; i < route.length; i++) {
        let { id, flyFrom, flyTo, airline, dTime, aTime, flight_no, dTimeUTC, aTimeUTC } = route[i];
        routeObj = {
            Id: id,
            TripId: tripId,
            LegNum: i + 1,
            FlightNo: '' + flight_no,
            CodeFrom: flyFrom,
            CodeTo: flyTo,
            AirlineCode: airline,
            DepartureTime: convertToHumanTime(dTime).replace(" ", "T"),
            ArrivalTime: convertToHumanTime(aTime).replace(" ", "T"),
            FlyDuration: unixToHourMinute(aTimeUTC - dTimeUTC)
        }
        result.push(routeObj);
    }
    return result;
}


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


function discountCheck(numstops, from, to, airline, price, fromDate, toDate) {
    // returns false if no discount, otherwise returns the updated price
    if (numstops !== 0) {
        return false;
    }

    let discountsArr = JSON.parse(localStorage["discountsUpdated"]);

    for (var i = 0; i < discountsArr.length; i++) {
        let currentDiscount = discountsArr[i];
        if (from === currentDiscount.From && to === currentDiscount.To && airline === currentDiscount.Airline) {
            if (isInBetween(currentDiscount.StartDate, currentDiscount.EndDate, fromDate)
                && isInBetween(currentDiscount.StartDate, currentDiscount.EndDate, toDate)) {
                let discountRate = parseInt(currentDiscount.DiscountRate.replace("%", ""));
                return parseInt(parseFloat(price) * (1 - (discountRate / 100)));
            }

        }
    }
    return false;
}


let objectKeysToLowerCase = function (origObj) {
    return Object.keys(origObj).reduce(function (newObj, key) {
        let val = origObj[key];
        let newVal = (typeof val === 'object') ? objectKeysToLowerCase(val) : val;
        newObj[key.toLowerCase()] = newVal;
        return newObj;
    }, {});
}