import {customer_db, item_db, order_db} from "../db/db.js";
import CustomerModel from "../model/customerModel.js";


$(document).ready(function() {

    generateCustomerId();

});

function generateCustomerId() {
    if (customer_db.length === 0) {
        $('#customer_id').val('C001');
    } else {
        const lastId = customer_db[customer_db.length - 1].customerId;
        const num = parseInt(lastId.substring(3)) + 1;
        $('#customer_id').val('C' + num.toString().padStart(3, '0'));
    }
}



let selectedIndex = -1;

$("#add-customer").click(function (){

    $('#customerModal').modal('show');

})
$("#customer-save").click(function () {
    let customerId = $("#customer_id").val();
    let customerName = $("#customerName").val();
    let address = $("#customerAddress").val();
    let number = $("#customerContact").val();

    if (customerId === '' || customerName === '' || address === '' || number === '') {
        Swal.fire("Error", "Please fill all fields", "error");
    } else {
        const customer_data = new CustomerModel(customerId, customerName, address, number);
        customer_db.push(customer_data);
        loadCustomerTableData();
        loadCustomerDropdown();
        console.log(customer_db);

        $('#customerModal').modal('hide');
        $('#customerModal form')[0].reset();
        $('#selectCustomerId').append($('<option>').text(customerId));
        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true

        })
        generateCustomerId();
        loadDashboardCounts();

        // Swal.fire("Success", "Customer Added Successfully", "success");
    }
});

function loadDashboardCounts() {
    $('#customerCount').text(customer_db.length);
    $('#itemsCount').text(item_db.length);
    $('#ordersCount').text(order_db.length);
}


function loadCustomerDropdown() {
    $('#selectCustomerId').empty();
    $('#selectCustomerId').append(`<option>Select Customer ID</option>`);
    customer_db.forEach(customer => {
        $('#selectCustomerId').append(
            $('<option>', {
                value: customer.customerId,
                text: customer.customerId,
            })
        );
    });
}


$('#Cup').click(function () {
    if (selectedIndex === -1) {
        Swal.fire("Error", "Please select a customer to update", "error");
        return;
    }

    const selectedCustomer = customer_db[selectedIndex];
    $('#customer_idU').val(selectedCustomer.customerId);
    $('#customerNameU').val(selectedCustomer.customerName);
    $('#customerAddressU').val(selectedCustomer.address);
    $('#customerContactU').val(selectedCustomer.phoneNumber);

    $('#customerModalU').modal('show');
});

$('#customer-update').click(function () {

    if (selectedIndex === -1) {
        Swal.fire("Error", "Please select a customer to update", "error");
        return;
    }

    let customerId = $("#customer_idU").val();
    let customerName = $("#customerNameU").val();
    let address = $("#customerAddressU").val();
    let number = $("#customerContactU").val();

    if (selectedIndex === -1) {
        Swal.fire("Error", "Please select a customer to update", "error");
        return;
    }

    const updatedCustomer = new CustomerModel(customerId, customerName, address, number);
    customer_db[selectedIndex] = updatedCustomer;

    loadCustomerTableData();
    $('#customerModalU').modal('hide');
    $('#customerModalU form')[0].reset();
    selectedIndex = -1;

    Swal.fire("Updated!", "Customer has been updated.", "success");
});

$('#customer-delete').click(function () {
    if (selectedIndex === -1) {
        Swal.fire("Error", "Please select a customer to delete", "error");
        return;
    }

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            customer_db.splice(selectedIndex, 1);
            loadCustomerTableData();
            clearForm();
            loadCustomerDropdown();
            selectedIndex = -1;
            Swal.fire("Deleted!", "Customer has been deleted.", "success");
            loadDashboardCounts();
        }
    });
});

function loadCustomerTableData() {
    $('#customer-tbody').empty();
    customer_db.forEach((item, index) => {
        let row = `<tr>
            <td>${item.customerId}</td>
            <td>${item.customerName}</td>
            <td>${item.address}</td>
            <td>${item.phoneNumber}</td>
        </tr>`;
        $('#customer-tbody').append(row);
    });
}

$('#customer-tbody').on('click', 'tr', function () {
    selectedIndex = $(this).index();
    const customer = customer_db[selectedIndex];

    $('#customer_idU').val(customer.customerId);
    $('#customerNameU').val(customer.customerName);
    $('#customerAddressU').val(customer.address);
    $('#customerContactU').val(customer.phoneNumber);
});

function clearForm() {
    $('#customer_id').val('');
    $('#customerName').val('');
    $('#customerAddress').val('');
    $('#customerContact').val('');

    $('#customer_idU').val('');
    $('#customerNameU').val('');
    $('#customerAddressU').val('');
    $('#customerContactU').val('');
}

$('.btn-outline-success').on('click', function () {
    clearForm();
});
