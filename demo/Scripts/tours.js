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
var triposoCreds = "account=96G4PAPO&token=6uc7eck2lquram5s75yvbmnoq10j5f4f";
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
            '            <h3 class="text-muted"><img id="logo" src="vendor.png" /></h3>' +
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
        autoclose: true,
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
        if ('hasTourCompany' in localStorage) {
            $("#adminLoginForm").hide();
            $("#adminPanel").show();
        } else {
            $("#adminLoginForm").show();
            return;
        }
        ajaxCall("GET", `../api/packages?companyName=${localStorage["hasTourCompany"]}`, "", getOrdersSuccess, discountErr); // load orders from server
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
        $("#orderTable tr").removeClass("selected"); // remove selected class from rows that were selected before
        $("#discountEditDiv").hide();
    });

    $("#discountForm").submit(discountEditSubmitHandler); // wire the submit event of datatable edit form to a function
    $("#searchForm").submit(handleSearch);
    $("#myFlightsBTN").click(handleMyFlights);
    $('#arrivalTime, #departureTime').on("blur", validateTime);

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
                {
                    data: "Price",
                    render: function (data, type, row, meta) {
                        return `${row.Price.toFixed(2)} €`;
                    }
                },
                {
                    data: "Profit",
                    render: function (data, type, row, meta) {
                        return `${row.Profit.toFixed(2)} %`;
                    }
                },
                { data: "City" },
                {
                    data: "ArrivalTime",
                    render: function (data, type, row, meta) {
                        return row.ArrivalTime.split("T")[0];
                    }
                },
                {
                    data: "DepartureTime",
                    render: function (data, type, row, meta) {
                        return row.DepartureTime.split("T")[0];
                    }
                },
                {
                    data: "Date",
                    render: function (data, type, row, meta) {
                        return row.Date.split("T")[0];
                    }
                },
                {
                    data: "SalesProfit",
                    render: function (data, type, row, meta) {
                        return `${row.SalesProfit.toFixed(2)} €`;
                    }
                },
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
    let start = $("#startDATE").val();
    let arrival = $("#arrivalTime").val();
    let departure = $("#departureTime").val();
    let triposoQueryURL = getQueryURLTriposo(fromVal, start, start, arrival, departure);
    $.get(triposoQueryURL).done(handleSearchSuccess);
    $.get(triposoQueryURL).fail(handleSearchError);
    return false;
}


function handleSearchSuccess(data) {
    dataArr = data.results[0].days;

    if (dataArr.length === 0) {
        $("#tablePH").empty()
        $("#tablePH").append(
            '<div id="searchRes">No Results</div>'
        )
        return;
    }
    let sumPackage = 0;
    dataArr = dataArr[0].itinerary_items;
    cityPic = data.results[0].location.images[0].source_url;
    let packageInfoDict = {};
    let packageInfoSequence = [];
    let lastTitle;
    let city = data.results[0].location.id.replace(/_/g, " ");
    let startDate = $("#startDATE").val();
    for (var i = 0; i < dataArr.length; i++) {
        if (i === 0) {
            $("#tablePH").empty()
            $("#tablePH").append(
                '<br><div class="col-lg-12">' +
                '        <div class="panel panel-default" id="plannerPanel">'
                + '<div class="panel-body" id="plannerPanelBody"></div></div></div>'
            );
            $("#plannerPanelBody").append('<h3 id="planTitle">' + city + '</h3>' +
                '<h4 id="planDate">' + startDate + '</h4>');
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
            lastTitle = title;
        } else {
            packageInfoDict[lastTitle][poiName] = description;
        }
        packageInfoSequence.push(currentItem.title);
        $("#plannerPanelBody").append((title ? '<b>' + (title + '</b>' + '</br>') : "")
            + poiName + '</br>' + description + '</br>');
        updatePanelPic(cityPic, "#plannerPanel");
    }
    packageInfoDict['sequence'] = packageInfoSequence;
    packageInfoDict['cityPicURL'] = cityPic;
    let totalSum = sumPackage + transportationPrice;
    let sumStr = sumPackage ? `Package: ${sumPackage}€<br> +<br>Transportation: ${transportationPrice}€<br>Total: ${totalSum}€` : "";
    let packageInfoStr = JSON.stringify(packageInfoDict).replace(/'/g, "");
    dataStr = ` data-price="${totalSum}" \
                                                data-longitude="${data.results[0].location.coordinates.longitude}" \
                                                data-latitude="${data.results[0].location.coordinates.latitude}" \
                                                data-packageinfo='${packageInfoStr}' \
                                                data-arrivaltime="${$('#arrivalTime').val()}:00" \
                                                data-departuretime="${$('#departureTime').val()}:00" \
                                                data-city="${city}" \
                                                data-date="${startDate}" `;
    $("#plannerPanelBody").append(`<br><b>${sumStr}</b><br>`);
    $("#plannerPanelBody").append('<input type="button" class="addButton btn btn-primary" value="Order"' + dataStr + '/>');
    $(".addButton").on("click", function () {
        document.getElementById("orderForm").reset();
        let longitude = $(this).data("longitude");
        let latitude = $(this).data("latitude");
        let price = $(this).data("price");
        let packageInfo = $(this).data("packageinfo");
        let city = $(this).data("city");
        let arrivalTime = $(this).data("arrivaltime");
        let departureTime = $(this).data("departuretime");
        let date = $(this).data("date");
        $("#tablePH").hide();
        $("#companyName").val(localStorage['hasTourCompany']);
        $("#orderFrame").show();
        $('#orderForm').unbind('submit').submit(function () {
            let profit = parseFloat($("#profit").val().replace("%", ""));
            let o = {
                Id: uuidv4(),
                Longitude: longitude,
                Latitude: latitude,
                Price: parseFloat(parseFloat(price * (1.0 + profit / 100)).toFixed(2)),
                Profit: profit,
                PackageInfo: JSON.stringify(packageInfo),
                CompanyName: localStorage['hasTourCompany'],
                City: city,
                ArrivalTime: arrivalTime,
                DepartureTime: departureTime,
                Date: `${date}T10:20:00`
            };
            ajaxCall("POST", "../api/packages", JSON.stringify(o), packagePostSuccess, (err) => swal("Error: " + err));
            return false; // preventDefault
        });
    })
}


function getItineraryPriceByLabel(suspectedLabel, labelArrOfPoi) {
    for (var i = 0; i < labelArrOfPoi.length; i++) {
        if (suspectedLabel === labelArrOfPoi[i]) // suspected label was indeed correct
            return labelsPriceDict[suspectedLabel];
    }
    return 0;
}


function packagePostSuccess() {
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
    return `https://www.triposo.com/api/20200803/day_planner.json?location_id=${locationId.replace(/ /g, "_")}&start_date=${startDate}&end_date=${endDate}&arrival_time=${arrivalTime}&departure_time=${departureTime}&${triposoCreds}`
}


function getPoiQueryURLTriposo(id) {
    return `https://www.triposo.com/api/20200803/poi.json?id=${id}&fields=tag_labels&${triposoCreds}`
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
