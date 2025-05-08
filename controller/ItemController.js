import {customer_db, item_db} from "../db/db.js";
import ItemModel from "../model/ItemModel.js";


$("#saveAddItemBtn").click(function () {
    let item_code = $("#item_code").val();
    let item_description = $("#itemDescription").val();
    let item_qty = $("#itemQty").val();
    let item_price = $("#itemPrice").val();

    if (item_code === '' || item_description === '' || item_qty === '' || item_price === '') {
        Swal.fire("Error", "Please fill all fields", "error");
    } else {
        const item_data = new ItemModel(item_code, item_description, item_qty, item_price);
        item_db.push(item_data);
        loadCustomerTableData();

        $('#ItemModal').modal('hide');
        $('#ItemModal form')[0].reset();

        Swal.fire("Success", "Item Added Successfully", "success");
    }
});


function loadCustomerTableData() {
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