export default  class OrderDetailModel{
     constructor(orderId,Date,cusName,ItemName, Price,OrderQty,SubTotal,Discount,finalTotal) {
         this.orderId = orderId;
         this.date = Date;
         this.cusName = cusName;
         this.itemName = ItemName;
         this.price = Price;
         this.orderQty = OrderQty;
         this.subTotal = SubTotal;
         this.discount = Discount;
         this.finalTotal = finalTotal;
     }
}