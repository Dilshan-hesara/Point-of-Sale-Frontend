import {customer_db, item_db, order_db} from "../db/db.js";
import ItemModel from "../model/itemModel.js";

let selectedIndex = -1;


$(document).ready(function() {

    generateItemId();
});


function generateItemId() {
    if (item_db.length === 0) {
        $('#item_code').val('I001');
    } else {
        const lastId = item_db[item_db.length - 1].item_code;
        const num = parseInt(lastId.substring(3)) + 1;
        $('#item_code').val('I' + num.toString().padStart(3, '0'));
    }
}


$('#Ia').click(function () {
    $('#itemModal').modal('show');

});

$("#saveAddItemBtn").click(function () {
    let item_code = $("#item_code").val();
    let item_description = $("#itemDescription").val();
    let item_qty = $("#itemQty").val();
    let item_price = $("#itemPrice").val();

    if (item_code === '' || item_description === '' || item_qty === '' || item_price === '') {
        Swal.fire("Error", "Please fill all fields", "error");
    }


    if (!/^[A-Za-z\s.,'-]{3,}$/.test(item_description)) {
        Swal.fire("Error", "Description must be  characters", "error");
        return false;
    }

    if (!/^[1-9]\d*$/.test(item_qty)) {
        Swal.fire("Error", "Quantity must be a positive whole number", "error");
        return false;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(item_price)) {
        Swal.fire("Error", "Price must be a positive number ", "error");
        return false;
    }
    else {
        const item_data = new ItemModel(item_code, item_description, item_qty, item_price);
        item_db.push(item_data);
        loadItemTableData();
        loadItemCMB();

        $('#itemModal').modal('hide');
        $('#itemModal form')[0].reset();

        $('#itemCode').append($('<option>').text(item_code));
        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true

        })

        generateItemId();
        loadDashboardCounts();


        // Swal.fire("Success", "Item Added Successfully", "success");
    }
});

function loadItemCMB() {
    $('#itemCode').empty();
    $('#itemCode').append(`<option>Select Item ID</option>`);
    item_db.forEach(item => {
        $('#itemCode').append(
            $('<option>', {
                value: item.item_code,
                text: item.item_code
            })
        );
    });
}
 function loadItemTableData() {
    $('#item-tbody').empty();
    item_db.forEach((item, index) => {
        let row = `<tr>
            <td>${item.item_code}</td>
            <td>${item.item_description}</td>
            <td>${item.item_qty}</td>
            <td>${item.item_price}</td>
        </tr>`;
        $('#item-tbody').append(row);
    });
}

$('#Iup').click(function () {
    if (selectedIndex === -1) {
        Swal.fire("Error", "Please select a Item to update", "error");
        return;
    }

    const selectedItem = item_db[selectedIndex];
    $('#item_codeU').val(selectedItem.item_code);
    $('#itemDescriptionU').val(selectedItem.item_description);
    $('#itemQtyU').val(selectedItem.item_qty);
    $('#itemPriceU').val(selectedItem.item_price);

    $('#itemModalU').modal('show');
});

$('#UpdateItemBtnU').click(function () {

    if (selectedIndex === -1) {
        Swal.fire("Error", "Please select a Item to update", "error");
        return;
    }

    let ItemId = $("#item_codeU").val();
    let dese = $("#itemDescriptionU").val();
    let qty = $("#itemQtyU").val();
    let price= $("#itemPriceU").val();

    if (selectedIndex === -1) {
        Swal.fire("Error", "Please select a Item to update", "error");
        return;
    }


    if (!/^[A-Za-z\s.,'-]{3,}$/.test(dese)) {
        Swal.fire("Error", "Description must be  characters", "error");
        return false;
    }

    if (!/^[1-9]\d*$/.test(qty)) {
        Swal.fire("Error", "Quantity must be a positive whole number", "error");
        return false;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(price)) {
        Swal.fire("Error", "Price must be a positive number ", "error");
        return false;
    }

    const updatedItem = new ItemModel(ItemId,dese, qty, price);
    item_db[selectedIndex] = updatedItem;

    loadItemTableData();
    $('#itemModalU').modal('hide');
    $('#itemModalU form')[0].reset();
    selectedIndex = -1;

    Swal.fire("Updated!", "Item has been updated.", "success");
});

$('#item-tbody').on('click', 'tr', function () {
    selectedIndex = $(this).index();
    const item = item_db[selectedIndex];

    $('#item_codeU').val(item.item_code);
    $('#itemDescriptionU').val(item.item_description);
    $('#itemQtyU').val(item.item_qty);
    $('#itemPriceU').val(item.item_price);
});


$('#item-delete').click(function () {
    if (selectedIndex === -1) {
        Swal.fire("Error", "Please select a Item to delete", "error");
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
            item_db.splice(selectedIndex, 1);
            loadItemTableData();
            selectedIndex = -1;
            Swal.fire("Deleted!", "Item has been deleted.", "success");
            loadItemCMB();
            loadDashboardCounts();

        }
    });

});


function loadDashboardCounts() {
    $('#customerCount').text(customer_db.length);
    $('#itemsCount').text(item_db.length);
    $('#ordersCount').text(order_db.length);
}