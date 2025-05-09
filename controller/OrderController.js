import { customer_db, item_db, order_db, order_details_db } from "../db/db.js";
import OrderModel from "../model/OrderModel.js";
import OrderDetailModel from "../model/OrderDetailModel.js";

$('#selectCustomerId').change(function () {
    var selectedValue = $(this).val();
    customer_db.map(function (Customer) {
        if (selectedValue.toString() === Customer.customerId.toString()) {
            $('#custName').val(Customer.customerName);
        }
    });
});

$('#itemCode').change(function () {
    var selectedValue = $(this).val();
    item_db.map(function (Item) {
        if (selectedValue.toString() === Item.item_code.toString()) {
            $('#description').val(Item.item_description);
            $('#price').val(Item.item_price);
            $('#qty').val(Item.item_qty);

        }
    })
})


//
let cart = [];
//

$(document).ready(function() {
    // console.log("Customer DB:", customer_db);
    console.log(" DB:", item_db);
    generateOrderId();
    setCurrentDate();
});


function setCurrentDate() {
    const today = new Date().toISOString().split('T')[0];
    $('#orderDate').val(today);
}

function generateOrderId() {
    if (order_db.length === 0) {
        $('#orderId').val('ORD001');
    } else {
        const lastId = order_db[order_db.length - 1].orderId;
        const num = parseInt(lastId.substring(3)) + 1;
        $('#orderId').val('ORD' + num.toString().padStart(3, '0'));
    }
}






const availableQty = parseInt($('#qty').val());

// Add to cart button handler
$('#addtocart').click(function() {
    const code = $('#itemCode').val();
    const description = $('#description').val();
    const price = parseFloat($('#price').val());
    const getQty = parseInt($('#getQty').val());

    // if (!code || !description || !price || !getQty) {
    //     Swal.fire("Error", "Please select an item and enter quantity", "error");
    //     return;
    // }

    if (getQty <= 0 || getQty > availableQty) {
        Swal.fire("Error", "Invalid quantity", "error");
        return;
    }

    const total = price * getQty;

    const existingItemIndex = cart.findIndex(item => item.code === code);
    if (existingItemIndex >= 0) {
        cart[existingItemIndex].orderQty += getQty;
        cart[existingItemIndex].total += total;
    } else {
        const item = {
            code,
            description,
            price,
            orderQty: getQty,
            total
        };
        cart.push(item);
    }

    renderCartTable();
    calculateTotal();

    $('#itemCode').val('');
    $('#description').val('');
    $('#qty').val('');
    $('#price').val('');
    $('#getQty').val('');
});

function renderCartTable() {
    $('#cart-table-body').empty();
    cart.forEach((item, index) => {
        $('#cart-table-body').append(`
            <tr>
                <td>${item.code}</td>
                <td>${item.description}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.orderQty}</td>
                <td>${item.total.toFixed(2)}</td>
                <td><button class="btn btn-danger btn-sm" onclick="removeItem(${index})">Remove</button></td>
            </tr>
        `);
    });
}

window.removeItem = function(index) {
    cart.splice(index, 1);
    renderCartTable();
    calculateTotal();
};

function calculateTotal() {
    const total = cart.reduce((sum, item) => sum + item.total, 0);
    $('#total').val(total.toFixed(2));

    const discount = parseFloat($('#discount').val()) || 0;
    const finalTotal = total - discount;
    $('#subTotal').val(finalTotal.toFixed(2));

    const cash = parseFloat($('#cash').val()) || 0;
    if (cash > 0) {
        $('#balance').val((cash - finalTotal).toFixed(2));
    }
}

$('#placeOrder').click(function() {
    const orderId = $('#orderId').val();
    const date = $('#orderDate').val();
    const customerId = $('#selectCustomerId').val();
    const customerName = $('#custName').val();
    const discount = parseFloat($('#discount').val()) || 0;
    const cash = parseFloat($('#cash').val()) || 0;
    const balance = parseFloat($('#balance').val()) || 0;

    // if (!orderId || !date || !customerId || cart.length === 0) {
    //     Swal.fire("Error", "Please fill all required fields and add items to cart", "error");
    //     return;
    // }

    if (order_db.some(order => order.orderId === orderId)) {
        Swal.fire("Error", "Order ID already exists", "error");
        return;
    }

    const newOrder = new OrderModel(orderId, date, customerId);
    order_db.push(newOrder);

    const subTotal = cart.reduce((sum, item) => sum + item.total, 0);
    const finalTotal = subTotal - discount;

    cart.forEach(item => {
        const detail = new OrderDetailModel(
            orderId,
            date,
            customerName,
            item.description,
            item.price,
            item.orderQty,
            subTotal,

            discount ,

        finalTotal

        );
        order_details_db.push(detail);

        const dbItem = item_db.find(i => i.item_code === item.code);
        if (dbItem) {
            dbItem.item_qty -= item.orderQty;
        }
    });

    Swal.fire({
        title: "Success!",
        text: "Order placed successfully!",
        icon: "success",
        confirmButtonText: "OK"
    }).then(() => {

        clearOrderForm();
        generateOrderId();
        loadOrderDetailsData();
        setCurrentDate();
    });
});

function clearOrderForm() {

    console.log(order_db);
    console.log(order_details_db);
    $('#orderDate').val('');
    $('#selectCustomerId').val('');
    $('#custName').val('');
    $('#code').val('');
    $('#description').val('');
    $('#qty').val('');
    $('#price').val('');
    $('#getQty').val('');
    $('#total').val('');
    $('#discount').val('');
    $('#subTotal').val('');
    $('#cash').val('');
    $('#balance').val('');
    $('#cart-table-body').empty();
    cart = [];
}

$('#discount, #cash').on('input', function() {
    calculateTotal();
});


const loadOrderDetailsData = () => {
    $('#orderView-table').empty();
    order_details_db.map((item, index) =>{
        let orderId = item.orderId;
        let date = item.date;
        let customerName = item.cusName;
        let itemName = item.itemName;
        let price = item.price;
        let OrQty = item.orderQty;
        let subTotal = item.subTotal;
        let discount = item.discount;
        let finalTotal = item.finalTotal;

        let data = `<tr>
                     <td>${orderId}</td>
                     <td>${date}</td>
                     <td>${customerName}</td>
                     <td>${itemName}</td>
                     <td>${price}</td>
                     <td>${OrQty}</td>
                     <td>${subTotal}</td>
                     <td>${discount}</td>
                     <td>${finalTotal}</td>
                     
  
                     
                 </tr>`
        $('#orderView-table').append(data);
    })
}