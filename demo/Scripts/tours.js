var codesUrl = "https://api.skypicker.com/locations?type=dump&locale=en-US&location_types=airport&limit=4000&active_only=true&sort=name";
var airlineCodesUrl = "https://api.skypicker.com/airlines?";
var labelsPriceDict = {
    eatingout: 20,
    do: 15,
    hotels: 100,
    nightlife: 15,
    sightseeing: 10,
    tours: 30
};
var defaultPoiPrice = 5;
var priceOfPoiToReturn = 0;
var transportationPrice = 10;
var triposoCreds = "account=MLMIQSMM&token=0dxs7hkxphxfvovs2xmxk2vourmpbxmp";
$(document).ready(function () {
    // main navbar dynamic render
    if (!('hasTourCompany' in localStorage)) {
        $("#mainContainer").prepend('<div class="header clearfix" id="tabsNav" style="display: none;">' +
            '            <nav>' +
            '                <ul class="nav nav-pills pull-right">' +
            '                    <li role="presentation" class="active"><a id="orderInterfaceBTN" href="#"><span class="glyphicon glyphicon-log-in"></span>&nbsp;&nbsp;Login</a></li>' +
            '                    <li role="presentation"><a id="registerCompany" href="#">Register new Tour Company</a></li>' +
            '                </ul>' +
            '            </nav>' +
            '            <h3 class="text-muted"><img id="logo" src="logo.png" /></h3>' +
            '        </div>');
    } else {
        $("#mainContainer").prepend('<div class="header clearfix" id="tabsNav" style="display: none;">' +
            '            <nav>' +
            '                <ul class="nav nav-pills pull-right">' +
            '                    <li role="presentation" class="active"><a href="#" onclick="localStorage.clear(); location.reload();"><span class="glyphicon glyphicon-log-out"></span>&nbsp;&nbsp;Logout</a></li>' +
            '                    <li role="presentation"><a id="searchBookFlights" href="#">Order tour packages</a></li>' +
            '                    <li role="presentation"><a id="orderInterfaceBTN" href="#">Admin interface</a></li>' +
            '                </ul>' +
            '            </nav>' +
            '            <h3 class="text-muted"><img id="logo" src="' + localStorage["tourCompanyImageURL"] + '" /></h3>' +
            '        </div>');
    }
    // main navbar dynamic render

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

    // get discounts on page load
    var triposoQueryURL = getQueryURLTriposo("Amsterdam", "2020-09-7", "2020-09-9", "4:19", "17:19");
    $.get(triposoQueryURL).done((data) => {
        console.log(data);
        //localStorage["discountsUpdated"] = JSON.stringify(data);
        $("#loadingTabs").hide();
        $("#tabsNav").show();
    });
    $.get(triposoQueryURL).fail((err) => {
        console.log(err);
    });

    // clock
    $('.clockpicker').clockpicker({
        placement: 'top',
        align: 'left',
        donetext: 'Done'
    });

    // interface show/hide handling
    $("#searchBookFlights").click(() => {
        $("#mainFramePanel").attr('class', 'panel panel-info');
        $("#mainFrameTitle").html("Order Packages");
        $("#mainFrame").show();
        $("#adminLoginForm").hide();
        $("#adminPanel").hide();
        $("#flightBookForm").show();
    });
    $("#orderInterfaceBTN").click(() => {
        $("#flightBookForm").hide();
        $("#registerCompanyForm").hide();
        $("#mainFramePanel").attr('class', 'panel panel-warning');
        $("#mainFrameTitle").html("Package Management Interface");
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
    $("#registerCompany").click(() => {
        $("#mainFramePanel").attr('class', 'panel panel-primary');
        $("#mainFrameTitle").html("Flight Booking");
        $("#mainFrame").show();
        $("#adminLoginForm").hide();
        $("#adminPanel").hide();
        $("#mainFrame").show();

        $("#registerCompanyForm").show();
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
    $("#registerForm").submit(register);

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
    let qstring = "../api/companies?username=" + $("#username").val() + "&password=" + $("#password").val();
    ajaxCall("GET", qstring, "", loginSuccess, loginErr);
    return false; // preventDefault
}


function register() {
    // handle register logic
    let qstring = "../api/companies"
    ajaxCall("POST", qstring, JSON.stringify({
        Username: $("#companyUsername").val(),
        Password: $("#companyPassword").val(), Image: $("#companyImage").val()
    }),
        registerSuccess, registerErr);
    return false; // preventDefault
}


function loginSuccess(data) {
    let [validated, companyName, imageURL] = data.split("`");
    if (validated === "Validated") {
        localStorage['hasTourCompany'] = companyName;
        localStorage['tourCompanyImageURL'] = imageURL;
        swal("logged in successfully as company: " + companyName, "Great Job", "success");
        location.reload();
    }
    else {
        swal("wrong credentials");
    }
}


function loginErr() {
    alert("something went wrong with authentication");
}


function registerSuccess(data) {
    let [validated, companyName, imageURL] = data.split("`");
    if (validated === "Validated") {
        loginSuccess(data);
    }
    else {
        swal("company already exists");
    }
}


function registerErr() {
    alert("something went wrong with registration");
}


function validateInDataList() {
    let parsedArr = JSON.parse(localStorage['locationCodes'])

    if (typeof parsedArr.find(x => x.city.name === $(this).val()) === "undefined") {
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
        let code = codesArr[i].city.name;
        let name = codesArr[i].city.country.name;
        $("datalist").append('<option label="' + name + '"' + ' value="' + code + '">');
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
    let triposoQueryURL = getQueryURLTriposo("Amsterdam", start, start, "15:12", "19:19");
    $.get(triposoQueryURL).done(handleSearchSuccess);
    $.get(triposoQueryURL).fail(handleSearchError);
    return false;
}


function handleSearchSuccess(data) {
    dataArr = data.results[0].days[0]
    if (dataArr.length === 0) {
        $("#tablePH").empty()
        $("#tablePH").append(
            '<div id="searchRes">No Results</div>'
        )
        return;
    }
    let sumPackage = 0;
    dataArr = dataArr.itinerary_items
    cityPic = data.results[0].location.images[0].source_url;
    let packageInfoDict = {};
    let lastTitle;
    for (var i = 0; i < dataArr.length; i++) {
        if (i === 0) {
            $("#tablePH").empty()
            $("#tablePH").append(
                '<br><div class="col-lg-12">' +
                '        <div class="panel panel-default" id="plannerPanel">'
                + '<div class="panel-body" id="plannerPanelBody"></div></div></div>'
            );
            $("#plannerPanelBody").append('<h3 id="planTitle">' + data.results[0].location.id + '</h3>' +
                '<h4 id="planDate">' + $("#startDATE").val() + '</h4>');
        }
        let currentItem = dataArr[i];
        let poiQueryURL = getPoiQueryURLTriposo(currentItem.poi.id);
        let title = currentItem.title ? capitalize(currentItem.title) : "";
        let description = currentItem.description;
        let poiName = currentItem.poi.name;
        jQuery.ajaxSetup({ async: false });
        $.get(poiQueryURL).done((data) => {
            dataAsArr = data.results[0].tag_labels; // labels of current itinerary
            for (let label in labelsPriceDict) { // dict of prices for common itineraries
                priceOfPoiToReturn = getItineraryPriceByLabel(label, dataAsArr);
                if (priceOfPoiToReturn !== 0)
                    return;
            }
            priceOfPoiToReturn = defaultPoiPrice;
        });
        $.get(poiQueryURL).fail((err) => {
            console.log(err);
        });
        jQuery.ajaxSetup({ async: true });
        sumPackage += priceOfPoiToReturn;
        if (title !== "") { // load associative array with package info on each iteration
            packageInfoDict[title] = {};
            packageInfoDict[title][poiName] = description;
        } else {
            packageInfoDict[lastTitle][poiName] = description;
        }
        $("#plannerPanelBody").append((title ? '<b>' + (title + '</b>' + '</br>') : "")
            + poiName + '</br>' + description + '</br>');
        updatePanelPic(cityPic);
        lastTitle = title;
        //$("#resultPH").append(
        //    '<tr data-toggle="collapse" data-target="#entry' + i + '" class="accordion-toggle">' +
        //    '<td><button class="btn btn-default btn-xs"><span class="glyphicon glyphicon-eye-open"></span></button></td>' +
        //    '<td>' + price + '</td>' +
        //    '<td>' + departureTime + '</td>' +
        //    '<td>' + arrivalTime + '</td>' +
        //    '<td>' + from + '</td>' +
        //    '<td>' + to + '</td>' +
        //    '<td>' + stops + '</td>' +
        //    '<td>' + airline + '</td>' +
        //    '<td>' + '<center><input type="button" class="addButton" value="Order"' + dataStr + '/>' + '</center></td>' +
        //    '</tr>' +
        //    '<tr>' +
        //    '<td colspan="12" class="hiddenRow">' + '<div id="entry' + i + '" class="accordian-body collapse">' + maxConnectionStr + '</div>' + '</td>' +
        //    '</tr>'
        //);
    }
    let totalSum = sumPackage + transportationPrice;
    let sumStr = sumPackage ? `Package: ${sumPackage}€<br> +<br>Transportation: ${transportationPrice}€<br>Total: ${totalSum}€` : "";
    console.log(packageInfoDict);
    let packageInfoStr = JSON.stringify(packageInfoDict);
    dataStr = ` data-price="${totalSum}" \
                                                data-longitude="${data.results[0].location.coordinates.longitude}" \
                                                data-latitude="${data.results[0].location.coordinates.latitude}" \
                                                data-packageinfo='${packageInfoStr.replace("'", "")}' \
                                                data-arrivaltime="${$('#arrivalTime').val()}" \
                                                data-departuretime="${$('#departureTime').val()}" \
                                                data-date="${$('#startDATE').val()}" `;
    $("#plannerPanelBody").append(`<br><b>${sumStr}</b><br>`);
    $("#plannerPanelBody").append('<input type="button" class="addButton btn btn-primary" value="Order"' + dataStr + '/>');
    $(".addButton").on("click", function () {
        //document.getElementById("orderForm").reset();
        //let flightId = $(this).data("flightid");
        //let price = parseFloat($(this).data("price"));
        //let departureTime = $(this).data("departuretime").replace(" ", "T");
        //let arrivalTime = $(this).data("arrivaltime").replace(" ", "T");
        //let from = $(this).data("from");
        //let codeFrom = $(this).data("codefrom");
        //let to = $(this).data("to");
        //let codeTo = $(this).data("codeto");
        //let stops = $(this).data("stops");
        //let airline = $(this).data("airline");
        //let numStops = $(this).data("numstops");
        //let flyDuration = $(this).data("flyduration");
        //let legArr = constructLegs($(this).data("route"), flightId);
        //let orderDate = moment().format("YYYY-MM-DDTHH:mm:ss");
        //$("#tablePH").hide();
        //$("#orderFrame").show();
        //$('#orderForm').unbind('submit').submit(function () {
        //    let o = {
        //        Id: flightId,
        //        Price: price,
        //        DepartureTime: departureTime,
        //        ArrivalTime: arrivalTime,
        //        From: from,
        //        CodeFrom: codeFrom,
        //        To: to,
        //        CodeTo: codeTo,
        //        Stops: stops,
        //        Airline: airline,
        //        NumStops: numStops,
        //        FlyDuration: flyDuration,
        //        LegArr: legArr,
        //        OrderDate: orderDate,
        //        Passengers: $("#orderNames").val(),
        //        Email: $("#orderEmail").val()
        //    }
        //    ajaxCall("POST", "../api/flights", JSON.stringify(o), flightPostSuccess, (err) => swal("Error: " + err));
        //    return false; // preventDefault
        //});
        console.log($(this).data());
        return false;
    })
}


function updatePanelPic(cityPic) {
    $("#plannerPanel").css('background',
        'linear-gradient(to bottom, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.65) 100%), url("' + cityPic + '")');
    $("#plannerPanel").css('background-size', '100% 100%');
    $("#plannerPanel").css('background-position', 'center');
    $("#plannerPanel").css('background-repeat', 'no-repeat');
}


function getItineraryPriceByLabel(suspectedLabel, labelArrOfPoi) {
    for (var i = 0; i < labelArrOfPoi.length; i++) {
        if (suspectedLabel === labelArrOfPoi[i]) // suspected label was indeed correct
            return labelsPriceDict[suspectedLabel];
    }
    return 0;
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
    return `https://www.triposo.com/api/20200803/day_planner.json?location_id=${locationId}&start_date=${startDate}&end_date=${endDate}&arrival_time=${arrivalTime}&departure_time=${departureTime}&${triposoCreds}`
}


function getPoiQueryURLTriposo(id) {
    return `https://www.triposo.com/api/20200803/poi.json?id=${id}&fields=tag_labels&${triposoCreds}`
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
            }
        }
    }
    return {
        lengthMaxConnection: maxTimeSpentInCountry / 60,
        maxConnectionObj: maxConnection
    };
}


function capitalize(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}
