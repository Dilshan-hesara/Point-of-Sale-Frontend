// // In your OrderController.js or main script file
import { customer_db, item_db, order_db, order_details_db } from "../db/db.js";
import OrderModel from "../model/OrderModel.js";
import OrderDetailModel from "../model/OrderDetailModel.js";

// $('#selectCustomerId').change(function () {
//     var selectedValue = $(this).val();
//     customer_db.map(function (Customer) {
//         if (selectedValue.toString() === Customer.customerId.toString()) {
//             $('#cusName').val(Customer.customerName);
//
//         }
//     });
// });


//
// let cart = [];
//
// Initialize the form when page loads
$(document).ready(function() {
    loadCustomerOptions();
    console.log("Customer DB:", customer_db);

    // loadItemOptions();
    // generateOrderId();
    // setCurrentDate();
});
//
// function setCurrentDate() {
//     const today = new Date().toISOString().split('T')[0];
//     $('#orderDate').val(today);
// }
//
// function generateOrderId() {
//     if (order_db.length === 0) {
//         $('#orderId').val('ORD001');
//     } else {
//         const lastId = order_db[order_db.length - 1].orderId;
//         const num = parseInt(lastId.substring(3)) + 1;
//         $('#orderId').val('ORD' + num.toString().padStart(3, '0'));
//     }
// }
//
function loadCustomerOptions() {
    console.log("Customer DB:", customer_db);

    const select = $('#selectCustomerId');
    select.empty();

    // Add default option
    select.append('<option value="">Select Customer</option>');

    // Use map to generate all options, then join and append them
    const options = customer_db.map(customer =>
        `<option value="${customer.customerId}">${customer.customerId} - ${customer.customerName}</option>`
    ).join('');

    select.append(options);
}

//
// function loadItemOptions() {
//     const select = $('#code');
//     select.empty();
//     select.append('<option value="">Select Item</option>');
//
//     item_db.forEach(item => {
//         select.append(`<option value="${item.item_code}">${item.item_code} - ${item.item_description}</option>`);
//     });
// }
//
// // Customer selection handler
// $('#selectCustomerId').change(function() {
//     const selectedId = $(this).val();
//     const customer = customer_db.find(c => c.customerId === selectedId);
//     if (customer) {
//         $('#custName').val(customer.customerName);
//     } else {
//         $('#custName').val('');
//     }
// });
//
// // Item selection handler
// $('#code').change(function() {
//     const selectedCode = $(this).val();
//     const item = item_db.find(i => i.item_code === selectedCode);
//     if (item) {
//         $('#description').val(item.item_description);
//         $('#price').val(item.item_price.toFixed(2));
//         $('#qty').val(item.item_qty);
//         $('#getQty').val('1'); // Default quantity to 1
//         $('#getQty').focus();
//     } else {
//         $('#description').val('');
//         $('#price').val('');
//         $('#qty').val('');
//         $('#getQty').val('');
//     }
// });
//
// // Add to cart button handler
// $('.btn-outline-primary').click(function() {
//     const code = $('#code').val();
//     const description = $('#description').val();
//     const price = parseFloat($('#price').val());
//     const getQty = parseInt($('#getQty').val());
//     const availableQty = parseInt($('#qty').val());
//
//     if (!code || !description || !price || !getQty) {
//         Swal.fire("Error", "Please select an item and enter quantity", "error");
//         return;
//     }
//
//     if (getQty <= 0 || getQty > availableQty) {
//         Swal.fire("Error", "Invalid quantity", "error");
//         return;
//     }
//
//     const total = price * getQty;
//
//     // Check if item already exists in cart
//     const existingItemIndex = cart.findIndex(item => item.code === code);
//     if (existingItemIndex >= 0) {
//         // Update existing item
//         cart[existingItemIndex].orderQty += getQty;
//         cart[existingItemIndex].total += total;
//     } else {
//         // Add new item
//         const item = {
//             code,
//             description,
//             price,
//             orderQty: getQty,
//             total
//         };
//         cart.push(item);
//     }
//
//     renderCartTable();
//     calculateTotal();
//
//     // Clear item selection
//     $('#code').val('');
//     $('#description').val('');
//     $('#qty').val('');
//     $('#price').val('');
//     $('#getQty').val('');
// });
//
// function renderCartTable() {
//     $('#cart-table-body').empty();
//     cart.forEach((item, index) => {
//         $('#cart-table-body').append(`
//             <tr>
//                 <td>${item.code}</td>
//                 <td>${item.description}</td>
//                 <td>${item.price.toFixed(2)}</td>
//                 <td>${item.orderQty}</td>
//                 <td>${item.total.toFixed(2)}</td>
//                 <td><button class="btn btn-danger btn-sm" onclick="removeItem(${index})">Remove</button></td>
//             </tr>
//         `);
//     });
// }
//
// window.removeItem = function(index) {
//     cart.splice(index, 1);
//     renderCartTable();
//     calculateTotal();
// };
//
// function calculateTotal() {
//     const total = cart.reduce((sum, item) => sum + item.total, 0);
//     $('#total').val(total.toFixed(2));
//
//     const discount = parseFloat($('#discount').val()) || 0;
//     const finalTotal = total - discount;
//     $('#subTotal').val(finalTotal.toFixed(2));
//
//     // Calculate balance if cash is entered
//     const cash = parseFloat($('#cash').val()) || 0;
//     if (cash > 0) {
//         $('#balance').val((cash - finalTotal).toFixed(2));
//     }
// }
//
// // Place Order button handler
// $('.btn-outline-success').click(function() {
//     const orderId = $('#orderId').val();
//     const date = $('#orderDate').val();
//     const customerId = $('#selectCustomerId').val();
//     const customerName = $('#custName').val();
//     const discount = parseFloat($('#discount').val()) || 0;
//     const cash = parseFloat($('#cash').val()) || 0;
//     const balance = parseFloat($('#balance').val()) || 0;
//
//     if (!orderId || !date || !customerId || cart.length === 0) {
//         Swal.fire("Error", "Please fill all required fields and add items to cart", "error");
//         return;
//     }
//
//     if (order_db.some(order => order.orderId === orderId)) {
//         Swal.fire("Error", "Order ID already exists", "error");
//         return;
//     }
//
//     // 1. Create and store OrderModel
//     const newOrder = new OrderModel(orderId, date, customerId);
//     order_db.push(newOrder);
//
//     // 2. Calculate totals
//     const subTotal = cart.reduce((sum, item) => sum + item.total, 0);
//     const finalTotal = subTotal - discount;
//
//     // 3. Loop through cart and store each OrderDetailModel
//     cart.forEach(item => {
//         const detail = new OrderDetailModel(
//             orderId,
//             date,
//             customerName,
//             item.description,
//             item.price,
//             item.orderQty,
//             subTotal,
//             discount,
//             discount,
//             finalTotal
//         );
//         order_details_db.push(detail);
//
//         // Deduct from item stock
//         const dbItem = item_db.find(i => i.item_code === item.code);
//         if (dbItem) {
//             dbItem.item_qty -= item.orderQty;
//         }
//     });
//
//     // 4. Show success message
//     Swal.fire({
//         title: "Success!",
//         text: "Order placed successfully!",
//         icon: "success",
//         confirmButtonText: "OK"
//     }).then(() => {
//         // 5. Clear UI and reset form
//         clearOrderForm();
//         generateOrderId();
//     });
// });
//
// function clearOrderForm() {
//     $('#orderDate').val('');
//     $('#selectCustomerId').val('');
//     $('#custName').val('');
//     $('#code').val('');
//     $('#description').val('');
//     $('#qty').val('');
//     $('#price').val('');
//     $('#getQty').val('');
//     $('#total').val('');
//     $('#discount').val('');
//     $('#subTotal').val('');
//     $('#cash').val('');
//     $('#balance').val('');
//     $('#cart-table-body').empty();
//     cart = [];
// }
//
// // Recalculate when discount or cash changes
// $('#discount, #cash').on('input', function() {
//     calculateTotal();
// });