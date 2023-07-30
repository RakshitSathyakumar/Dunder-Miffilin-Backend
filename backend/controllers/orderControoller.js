const orderSchema = require("../models/orderSchema");
const productSchema = require("../models/productSchema");
const userSchema = require("../models/userSchema");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const errorHandler = require("../utils/errorHandler");
// post new order
exports.newOrder = asyncErrorHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await orderSchema.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    order,
  });
});
// Single order by id
exports.getSingleOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await orderSchema
    .findById(req.params.id)
    .populate("user", "name email");

  if (!order) {
    return next(new errorHandler("Order Not Found", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});
// delete a single order by id : admin
exports.deleteSingleOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await orderSchema.findById(req.params.id);
  if (!order) {
    return next(
      new errorHandler("order not found pls check the credentials", 404)
    );
  }
  await order.deleteOne();
  res.status(201).json({
    success: true,
  });
});

// update order details 
exports.updateOrderDetails = asyncErrorHandler(async(req,res,next)=>{
  const order = await orderSchema.findById(req.params.id);

  if (!order) {
    return next(
      new errorHandler("order not found pls check the credentials", 404)
    );
  }

  if(order.orderStatus === "Delivered"){
    return next(new errorHandler("Your Order is alredy delivered pls check your order",401));
  }

  order.orderItems.forEach(async(ele) => {
    await updateStock(ele.product,ele.quantity);
  });

  order.orderStatus = req.body.status;
  if(req.body.status === "Delivered"){
    order.deliveredAt = Date.now();
  }
  await order.save({validateBeforeSave:false});

  res.status(200).json({
    success:true,
  })
});

async function updateStock(id,quantity){
  const product = await productSchema.findById(id);
  product.stock -= quantity;
  await product.save({validateBeforeSave:false});
}

// get all orders --admin route
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {
  const orders = await orderSchema.find();
  const totalOrders = await orderSchema.countDocuments();

  let totalCostToCompany = 0;
  for (let i = 0; i < orders.length; i++) {
    const element = orders[i].totalPrice;
    totalCostToCompany += element;
  }

  res.status(200).json({
    success: true,
    totalCostToCompany,
    totalOrders,
    orders,
  });
});
// my ordrers
exports.myOrders = async (req, res, next) => {
  try {
    const myOrder = await orderSchema.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      myOrder,
    });
  } catch (error) {
    return next(new errorHandler("some error has occurred", 500));
  }
};
