export default  class OrderDetailModel{
     constructor(orderId,date,cusName,itemName, price,orderQty,subTotal,discount,finalTotal) {
         this.orderId = orderId;
         this.date = date;
         this.cusName = cusName;
         this.itemName = itemName;
         this.price = price;
         this.orderQty = orderQty;
         this.subTotal = subTotal;
         this.discount = discount;
         this.finalTotal = finalTotal;
     }
}