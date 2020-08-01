// wire all the buttons to their functions
function buttonEvents() {

    $(document).on("click", ".discountNewBtn", function () {
        $(".discountNewBtn").attr("data-clickedflag", "yes");
        $("#discountTable tr").removeClass("selected");
        $("#discountEditDiv").show();
        clearFields();
        $("#discountEditDiv :input").prop("disabled", false); // new mode: enable all controls in the form
    });

    $(document).on("click", ".discountEditBtn", function () {
        markSelected(this);
        $("#discountEditDiv").show();
        $("#discountEditDiv :input").prop("disabled", false); // edit mode: enable all controls in the form
        populateFields(); // fill the form fields according to the selected row
    });

    $(document).on("click", ".discountViewBtn", function () {
        markSelected(this);
        $("#discountEditDiv").show();
        row.className = 'selected';
        $("#discountEditDiv :input").attr("disabled", "disabled"); // view mode: disable all controls in the form
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
    $("#discountTable tr").removeClass("selected"); // remove seleced class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}

// Delete a car from the server
function deleteDiscount(id) {
    ajaxCall("DELETE", "../api/discounts/" + id, "", deleteSuccess, (err) => swal("Error: " + err));
}

function discountEditSubmitHandler() {
    let idToPass = 0; // dummy id to pass in "new" mode
    if (getDiscount())
        idToPass = getDiscount().Id; // actual id to pass in "edit" mode

    let discountToSave = {
        Id: idToPass,
        Airline: $("#discountAirline").val(),
        From: $("#discountFrom").val(),
        To: $("#discountTo").val(),
        StartDate: $("#discountStartDate").val(),
        EndDate: $("#discountEndDate").val(),
        DiscountRate: $("#discountRate").val(),
    }
    
    if ($(".discountNewBtn").data("clickedflag") === "yes") {
        ajaxCall("POST", "../api/discounts", JSON.stringify(discountToSave), insertSuccess, (err) => swal("Error: " + err));
        $(".discountNewBtn").attr("data-clickedflag", "no");
    } else {
        ajaxCall("PUT", "../api/discounts/edit", JSON.stringify(discountToSave), updateSuccess, (err) => swal("Error: " + err));
    }
    return false; // preventDefault
}

// fill the form fields
function populateFields() {
    discount = getDiscount();
    $("#discountAirline").val(discount.Airline);
    $("#discountFrom").val(discount.From);
    $("#discountTo").val(discount.To);
    $("#discountStartDate").val(discount.StartDate.split("T")[0]);
    $("#discountEndDate").val(discount.EndDate.split("T")[0]);
    $("#discountRate").val(discount.DiscountRate);
}


// fill the form fields
function clearFields() {
    $("#discountAirline").val("");
    $("#discountFrom").val("");
    $("#discountTo").val("");
    $("#discountStartDate").val("");
    $("#discountEndDate").val("");
    $("#discountRate").val("");
}

// get the selected discount, according to the row which is selected
function getDiscount() {
    return tbl.row('.selected').data();
}

// success callback function after update
function updateSuccess() {
    $('#discountInterfaceBTN').trigger('click'); // triggering this click will result in refreshing datatable with new values
    $("#discountEditDiv").hide();
    swal("Updated Successfuly!", "Great Job", "success");
}

// success callback function after insert
function insertSuccess() {
    $('#discountInterfaceBTN').trigger('click'); // triggering this click will result in refreshing datatable with new values
    $("#discountEditDiv").hide();
    swal("Inserted Successfuly!", "Great Job", "success");
}

// success callback function after delete
function deleteSuccess() {
    $('#discountInterfaceBTN').trigger('click'); // triggering this click will result in refreshing datatable with new values
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
