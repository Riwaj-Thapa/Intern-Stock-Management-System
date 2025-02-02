import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrUpdateOrder = async (req, res) => {
  try {
    const { orderNumber, customer, items, status, total } = req.body;
    const orderId = req.params.id;

    // If updating an order
    if (orderId) {
      const existingOrder = await Order.findById(orderId);
      if (!existingOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Update order and adjust inventory if status is changing to "Completed"
      if (status === "Completed" && existingOrder.status !== "Completed") {
        await adjustProductQuantities(items, true);
      }

      existingOrder.orderNumber = orderNumber;
      existingOrder.customer = customer;
      existingOrder.items = items;
      existingOrder.status = status;
      existingOrder.total = total;

      await existingOrder.save();
      return res.status(200).json(existingOrder);
    }

    // If creating a new order
    const newOrder = new Order({
      orderNumber,
      customer,
      items,
      status,
      total,
    });

    // Adjust inventory for new completed orders
    if (status === "Completed") {
      await adjustProductQuantities(items, true);
    }

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating or updating order:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// Adjust product quantities when an order is created or updated
const adjustProductQuantities = async (items, decrease) => {
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) throw new Error(`Product not found: ${item.product}`);

    product.quantity = decrease
      ? product.quantity - item.quantity
      : product.quantity + item.quantity;

    if (product.quantity < 0) {
      throw new Error(`Insufficient stock for product: ${product.name}`);
    }

    await product.save();
  }
};


export const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
