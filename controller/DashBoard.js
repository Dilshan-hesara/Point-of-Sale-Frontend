import {customer_db,item_db,order_db} from "../db/db.js";

$(document).ready(function () {
    loadDashboardCounts();
});

function loadDashboardCounts() {
    $('#customerCount').text(customer_db.length);
    $('#itemsCount').text(item_db.length);
    $('#ordersCount').text(order_db.length);
}

