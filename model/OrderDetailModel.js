export default  class OrderDetailModel{
     constructor(OrderId,Date,cusName,ItemName, Price,OrderQty,SubTotal,DiscountRate,Discount,FinalTotal) {
         this._OrderId = OrderId;
         this._Date = Date;
         this._cusName = cusName;
         this._ItemName = ItemName;
         this._Price = Price;
         this._OrderQty = OrderQty;
         this._SubTotal = SubTotal;
         this._Discount = Discount;
         this._FinalTotal = FinalTotal;
     }
}