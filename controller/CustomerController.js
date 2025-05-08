import { customer_db } from "../db/db.js";
import CustomerModel from "../model/customerModel.js";

export function loadCustomer() {
    $("table tbody").empty(); // Changed selector to target the table body

    customer_db.forEach((item, index) => {
        let data = `<tr>
            <td>${item.customer_id}</td>
            <td>${item.customer_name}</td>
            <td>${item.customer_address}</td>
            <td>${item.customer_contact}</td>         
        </tr>`;
        $("table tbody").append(data);
    });
}

$("#customer-save").click(function () {
    let customer_id = $("#customer_id").val();
    let customer_name = $("#customerName").val();
    let customer_address = $("#customerAddress").val();
    let customer_contact = $("#customerContact").val();

    if (customer_id === '' || customer_name === '' || customer_address === '' || customer_contact === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Please fill all fields',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    } else {
        let customer_data = new CustomerModel(
            customer_id,
            customer_name,
            customer_address,
            customer_contact
        );

        customer_db.push(customer_data);
        console.log(customer_db);

        loadCustomer();

        // Close modal and clear form
        $('#customerModal').modal('hide');
        $('#customerModal form')[0].reset();

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });
    }
});


let selectedIndex = -1;
$('.cus-body').on('click', 'tr', function () {
    selectedIndex = $(this).index();
    let obj = customer_db[selectedIndex];

    let customerId = obj.customerId;
    let customerName = obj.customerName;
    let address = obj.address;
    let phoneNumber = obj.phoneNumber;

    $('#id').val(customerId);
    $('#name').val(customerName);
    $('#address').val(address);
    $('#number').val(phoneNumber);
})


$('.btn-outline-success').on('click', function () {
    $('#customerModal form')[0].reset();
});