import { useState } from "react";
import { X, Check, Phone, MapPin, User, Mail, FileText } from "lucide-react";
import { useCart } from "../App";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OrderForm = () => {
  const {
    cartItems,
    cartTotal,
    clearCart,
    isOrderFormOpen,
    setIsOrderFormOpen,
  } = useCart();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    order_type: "takeaway",
    delivery_address: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrderTypeChange = (value) => {
    setFormData({ ...formData, order_type: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.customer_phone) {
      toast.error("Please fill in your name and phone number");
      return;
    }

    if (formData.order_type === "delivery" && !formData.delivery_address) {
      toast.error("Please enter your delivery address");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        ...formData,
        items: cartItems,
        total: cartTotal,
      };

      const response = await axios.post(`${API}/orders`, orderData);
      setOrderId(response.data.id);
      setOrderComplete(true);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOrderFormOpen(false);
    setOrderComplete(false);
    setFormData({
      customer_name: "",
      customer_phone: "",
      customer_email: "",
      order_type: "takeaway",
      delivery_address: "",
      notes: "",
    });
  };

  return (
    <Dialog open={isOrderFormOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-lg bg-cream-paper border-maize-gold/30 max-h-[90vh] overflow-y-auto"
        data-testid="order-form-dialog"
      >
        {orderComplete ? (
          // Success State
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-guacamole-green rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-serif text-3xl text-deep-char mb-3">
              Order Confirmed!
            </h2>
            <p className="font-sans text-deep-char/70 mb-2">
              Thank you for your order.
            </p>
            <p className="font-sans text-sm text-deep-char/50 mb-6">
              Order ID: {orderId.slice(0, 8).toUpperCase()}
            </p>
            <div className="bg-white p-4 rounded-xl mb-6">
              <p className="font-sans text-deep-char">
                We'll call you at{" "}
                <span className="font-bold">{formData.customer_phone}</span> to
                confirm your order.
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="bg-saffron-blaze text-white px-8 py-3 rounded-full"
              data-testid="close-order-success"
            >
              Done
            </Button>
          </div>
        ) : (
          // Order Form
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-deep-char">
                Complete Your Order
              </DialogTitle>
            </DialogHeader>

            {/* Order Summary */}
            <div className="bg-white p-4 rounded-xl mb-6">
              <h3 className="font-sans font-bold text-deep-char mb-3">
                Order Summary
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.menu_item_id}
                    className="flex justify-between text-sm"
                  >
                    <span className="font-sans text-deep-char/70">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-sans text-deep-char">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-maize-gold/30 mt-3 pt-3 flex justify-between">
                <span className="font-sans font-bold text-deep-char">Total</span>
                <span className="font-sans font-bold text-saffron-blaze text-lg">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Order Type */}
              <div>
                <label className="font-sans text-sm text-deep-char/70 mb-2 block">
                  Order Type *
                </label>
                <Select
                  value={formData.order_type}
                  onValueChange={handleOrderTypeChange}
                >
                  <SelectTrigger
                    className="w-full rounded-xl border-2 border-maize-gold/30"
                    data-testid="order-type-select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                    <SelectItem value="dine-in" data-testid="order-type-dinein">Dine-in</SelectItem>
                    <SelectItem value="takeaway" data-testid="order-type-takeaway">Takeaway</SelectItem>
                    <SelectItem value="delivery" data-testid="order-type-delivery">Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Customer Name */}
              <div>
                <label className="font-sans text-sm text-deep-char/70 mb-2 block">
                  Your Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-char/40" />
                  <Input
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="pl-10 rounded-xl border-2 border-maize-gold/30"
                    data-testid="order-name-input"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="font-sans text-sm text-deep-char/70 mb-2 block">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-char/40" />
                  <Input
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    placeholder="0400 000 000"
                    className="pl-10 rounded-xl border-2 border-maize-gold/30"
                    data-testid="order-phone-input"
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="font-sans text-sm text-deep-char/70 mb-2 block">
                  Email (optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-char/40" />
                  <Input
                    name="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="pl-10 rounded-xl border-2 border-maize-gold/30"
                    data-testid="order-email-input"
                  />
                </div>
              </div>

              {/* Delivery Address (Conditional) */}
              {formData.order_type === "delivery" && (
                <div>
                  <label className="font-sans text-sm text-deep-char/70 mb-2 block">
                    Delivery Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3 w-4 h-4 text-deep-char/40" />
                    <Textarea
                      name="delivery_address"
                      value={formData.delivery_address}
                      onChange={handleChange}
                      placeholder="Enter your full address"
                      className="pl-10 rounded-xl border-2 border-maize-gold/30 resize-none"
                      rows={2}
                      data-testid="order-address-input"
                    />
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label className="font-sans text-sm text-deep-char/70 mb-2 block">
                  Special Instructions (optional)
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-3 w-4 h-4 text-deep-char/40" />
                  <Textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any allergies or special requests?"
                    className="pl-10 rounded-xl border-2 border-maize-gold/30 resize-none"
                    rows={2}
                    data-testid="order-notes-input"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-saffron-blaze text-white py-4 rounded-full font-bold hover:bg-chili-red transition-all"
                data-testid="place-order-btn"
              >
                {loading ? (
                  <span className="spinner w-5 h-5 border-white"></span>
                ) : (
                  `Place Order • $${cartTotal.toFixed(2)}`
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;
