// wire all the buttons to their functions
function buttonEvents() {

    $(document).on("click", ".discountEditBtn", function () {
        markSelected(this);
        $("#discountEditDiv").show();
        enableEditModeAllowedControls(); // enable LOGICALLY allowed controls
        populateFields(); // fill the form fields according to the selected row
    });

    $(document).on("click", ".discountViewBtn", function () {
        markSelected(this);
        $("#discountEditDiv").show();
        row.className = 'selected';
        $("#discountEditDiv :input").attr("disabled", "disabled"); // view mode: disable all controls in the form
        $("#discountCancelBTN").prop("disabled", false); // view mode: enable cancel button
        populateFields();
    });

    $(document).on("click", ".discountDeleteBtn", function () {
        markSelected(this);
        swal({ // this will open a dialogue
            title: "Are you sure ??",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
            .then(function (willDelete) {
                if (willDelete) deleteDiscount(getDiscount().Id);
                else swal("Not Deleted!");
            });
    });
}

// mark the selected row
function markSelected(btn) {
    $("#orderTable tr").removeClass("selected"); // remove selected class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}

// Delete a car from the server
function deleteDiscount(id) {
    ajaxCall("DELETE", "../api/packages/" + id, "", deleteSuccess, (err) => swal("Error: " + err));
}

function discountEditSubmitHandler() {
    idToPass = getDiscount().Id;

    let discountToSave = {
        Id: idToPass,
        Price: parseFloat($("#discountPrice").val()),
        Profit: parseFloat($("#discountProfitPerSale").val().replace("%", "")),
        City: $("#discountTo").val(),
        ArrivalTime: `${$("#discountArrivalTime").val()}:00`,
        DepartureTime: `${$("#discountDepartureTime").val()}:00`,
        Date: $("#discountDate").val(),
        SalesProfit: parseFloat($("#discountSalesProfit").val()),
    }
    
    ajaxCall("PUT", "../api/packages/edit", JSON.stringify(discountToSave), updateSuccess, (err) => swal("Error: " + err));
    return false; // preventDefault
}

// fill the form fields
function populateFields() {
    discount = getDiscount();
    $("#discountPrice").val(discount.Price);
    $("#discountProfitPerSale").val(`${discount.Profit}%`);
    $("#discountTo").val(discount.City);
    $("#discountArrivalTime").val(discount.ArrivalTime);
    $("#discountDepartureTime").val(discount.DepartureTime);
    $("#discountDate").val(discount.Date.split("T")[0]);
    $("#discountSalesProfit").val(discount.SalesProfit);
}

// fill the form fields
function clearFields() {
    $("#discountPrice").val("");
    $("#discountProfitPerSale").val("");
    $("#discountTo").val("");
    $("#discountArrivalTime").val("");
    $("#discountDepartureTime").val("");
    $("#discountDate").val("");
    $("#discountSalesProfit").val("");
}

// get the selected discount, according to the row which is selected
function getDiscount() {
    return orderTbl.row('.selected').data();
}

// success callback function after update
function updateSuccess(newPrice) {
    $('#orderInterfaceBTN').trigger('click'); // triggering this click will result in refreshing datatable with new values
    $("#discountEditDiv").hide();
    swal("Updated Successfuly! New Price Of Package: " + newPrice, "Great Job", "success");
}

// success callback function after delete
function deleteSuccess() {
    $('#orderInterfaceBTN').trigger('click'); // triggering this click will result in refreshing datatable with new values
    $("#discountEditDiv").hide();
    swal("Deleted Successfuly!", "Great Job", "success");
}

// redraw a datatable with new data
function redrawTable(tbl, data) {
    tbl.clear();
    for (var i = 0; i < data.length; i++) {
        tbl.row.add(data[i]);
    }
    tbl.draw();
}

// enable the allowed controls in edit form 
function enableEditModeAllowedControls() {
    $("#discountEditDiv :input").attr("disabled", "disabled"); // edit mode: disable all controls
    $("#discountProfitPerSale").prop("disabled", false); // edit mode: enable the only logically editable control
    $("#discountSaveBTN, #discountCancelBTN").prop("disabled", false); // edit mode: enable save and cancel buttons
}