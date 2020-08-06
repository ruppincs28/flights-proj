function reverseDate(str) {
    splitStr = str.split('-')
    return splitStr[2] + '/' + splitStr[1] + '/' + splitStr[0]
}


function dateStabilizer() {
    $('#startDATE, #discountStartDate').attr('min', moment().format('YYYY-MM-DD'))
    $('#endDATE, #discountEndDate').attr('min', moment().format('YYYY-MM-DD'))

    $('#startDATE, #discountStartDate').on('change', function (e) {
        var startDate = $(this).val();
        var endDate = moment(startDate).add(1, 'days').format('YYYY-MM-DD');
        $('#endDATE, #discountEndDate').attr('min', endDate);
    })
}


function convertToHumanTime(unixTimeStamp) {
    // Months array
    var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Convert timestamp to milliseconds
    var date = new Date(unixTimeStamp * 1000);
    // Year
    var year = date.getFullYear();
    // Month
    var month = "0" + (date.getMonth() + 1);
    // Day
    var day = "0" + date.getDate();
    // Hours
    var hours = "0" + date.getHours();
    // Minutes
    var minutes = "0" + date.getMinutes();
    // Seconds
    var seconds = "0" + date.getSeconds();
    // Display date time in MM-dd-yyyy h:m:s format
    var convdataTime = year + '-' + month.substr(-2) + '-' + day.substr(-2) + ' ' + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return convdataTime;
}


function unixToHourMinute(seconds) {
    d = Number(seconds);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);

    let hDisplay = h > 0 ? h + "h" : "";
    let mDisplay = m > 0 ? m + "m" : "";
    let spaceNeeded = h > 0 ? " " : "";
    return `${hDisplay}${spaceNeeded}${mDisplay}`;
}


function isInBetween(leftBoundary, rightBoundary, input) {
    let leftDate = new Date(leftBoundary.split("T")[0]);
    let rightDate = new Date(rightBoundary.split("T")[0]);
    let checkDate = new Date(input.split(" ")[0]);

    if (checkDate >= leftDate && checkDate <= rightDate) {
        return true;
    } else {
        return false;
    }
}


function diffInMinutes(dt2, dt1) {
    dt2 = new Date(dt2);
    dt1 = new Date(dt1);
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}
