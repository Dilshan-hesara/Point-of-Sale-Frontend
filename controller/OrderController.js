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

            const availableQty = parseInt($('#qty').val());
        }
    })
})


//
let cart = [];
//

$(document).ready(function() {
    // console.log("Customer DB:", customer_db);
    console.log(" DB:", item_db);
    setCurrentDate();
    generateOrderId();
    clearOrderForm();

    setTimeout(() => {
        setCurrentDate();
    }, 100);
});


function setCurrentDate() {
    const today = new Date().toISOString().split('T')[0];
    $('#orderDate').val(today);
    console.log(today);
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

$('#addtocart').click(function() {
    const code = $('#itemCode').val();
    const description = $('#description').val();
    const price = parseFloat($('#price').val());
    const getQty = parseInt($('#getQty').val());
    const customer = $('#custName').val();

    if (!code || !description || !price || !customer || !getQty    ){
        Swal.fire("Error", "Please select an item & customer & enter quantity", "error");
        return;
    }

    // if (getQty <= 0 || getQty > availableQty) {
    //     Swal.fire("Error", "Invalid quantity", "error");
    //     return;
    // }
    // let availableQty =parseInt($('#qty').val()); // Or any source

  

    if (getQty <= 0 || getQty >availableQty) {
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

    tot ==total;
    const discount = parseFloat($('#discount').val()) || 0;
    const finalTotal = total - discount;
    $('#subTotal').val(finalTotal.toFixed(2));

    const cash = parseFloat($('#cash').val()) || 0;
    if (cash > 0) {
        $('#balance').val((cash - finalTotal).toFixed(2));
    }
}



$('#placeOrder').click(function() {
    // Validate required fields
    const orderId = $('#orderId').val().trim();
    const date = new Date().toISOString().split('T')[0];
    const customerId = $('#selectCustomerId').val();
    const customerName = $('#custName').val().trim();
    const discount = parseFloat($('#discount').val()) || 0;
    const cash = parseFloat($('#cash').val()) || 0;

    if (!orderId || cart.length === 0 || !customerId) {
        Swal.fire("Error", "Please fill all required fields and add items to cart", "error");
        return;
    }
    if (!/^\d*\.?\d+$/.test(discount)) {
        Swal.fire("Invalid Input", "Please enter a numeric discount value.", "error");
        return;
    }


    if (discount < 0 || discount > 100) {
        Swal.fire("warning", "Invalid Discount Discount must be between 0% and 100%.","error");

        return;
    }


    const subTotal = cart.reduce((sum, item) => sum + item.total, 0);
    const finalTotal = subTotal - discount;
    const balance = cash - finalTotal;

    if (cash < finalTotal) {
        Swal.fire("Error", `Insufficient cash. Balance required: ${finalTotal - cash}`, "error");
        return;
    }

    const newOrder = new OrderModel(orderId, date, customerId, customerName, subTotal, discount, finalTotal, cash, balance);
    order_db.push(newOrder);

    cart.forEach(item => {
        const detail = new OrderDetailModel(
            orderId,
            date,
            customerName,
            item.code,
            item.description,
            item.price,
            item.orderQty,
            item.total,
            discount,
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
        text: `Order placed successfully! `,
        icon: "success",
        confirmButtonText: "OK"
    }).then(() => {
        clearOrderForm();
        generateOrderId();
        loadOrderDetailsData();
        setCurrentDate();
        loadDashboardCounts();
        loadItemTableData();
    });
});

$('#discount, #cash').on('input', function() {
    updateOrderTotals();
});

function updateOrderTotals() {
    const subTotal = cart.reduce((sum, item) => sum + item.total, 0);
    const discount = parseFloat($('#discount').val()) || 0;

    const discountAmount = subTotal * (discount / 100);
    const finalTotal = subTotal - discountAmount;

    const cash = parseFloat($('#cash').val()) || 0;
    const balance = cash - finalTotal;

    $('#subTotal').val(subTotal.toFixed(2));
    $('#finalTotal').val(finalTotal.toFixed(2));
    $('#balance').val(balance.toFixed(2));


    if (balance < 0) {
        $('#balance').css('color', 'red');
    } else {
        $('#balance').css('color', 'green');
    }
}

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


function loadDashboardCounts() {
    $('#customerCount').text(customer_db.length);
    $('#itemsCount').text(item_db.length);
    $('#ordersCount').text(order_db.length);
}