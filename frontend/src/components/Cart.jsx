import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../App";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    setIsOrderFormOpen,
  } = useCart();

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsOrderFormOpen(true);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-cream-paper border-l border-maize-gold/30"
        data-testid="cart-sheet"
      >
        <SheetHeader className="border-b border-maize-gold/30 pb-4">
          <SheetTitle className="font-serif text-2xl text-deep-char flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-saffron-blaze" />
            Your Order
            {cartCount > 0 && (
              <span className="bg-saffron-blaze text-white text-sm px-3 py-1 rounded-full">
                {cartCount} items
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-20 h-20 bg-maize-gold/20 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-deep-char/30" />
            </div>
            <p className="font-serif text-xl text-deep-char mb-2">
              Your cart is empty
            </p>
            <p className="font-sans text-deep-char/60 mb-6">
              Add some delicious items from our menu!
            </p>
            <Button
              onClick={() => setIsCartOpen(false)}
              className="bg-saffron-blaze text-white px-6 py-3 rounded-full"
              data-testid="browse-menu-btn"
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-180px)]">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.menu_item_id}
                  className="bg-white p-4 rounded-xl shadow-sm cart-item-enter"
                  data-testid={`cart-item-${item.menu_item_id}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-serif text-deep-char">{item.name}</h4>
                      <p className="font-sans text-saffron-blaze font-bold">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.menu_item_id)}
                      className="p-2 text-deep-char/40 hover:text-chili-red transition-colors"
                      data-testid={`remove-item-${item.menu_item_id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-cream-paper rounded-full p-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.menu_item_id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-deep-char hover:bg-maize-gold/30 transition-colors"
                        data-testid={`decrease-qty-${item.menu_item_id}`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-sans font-bold text-deep-char w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.menu_item_id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-deep-char hover:bg-maize-gold/30 transition-colors"
                        data-testid={`increase-qty-${item.menu_item_id}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-sans font-bold text-deep-char">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="border-t border-maize-gold/30 pt-4 space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="font-sans text-deep-char/70">Subtotal</span>
                <span className="font-sans font-bold text-deep-char">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                className="w-full bg-saffron-blaze text-white py-4 rounded-full font-bold hover:bg-chili-red transition-all btn-glow"
                data-testid="checkout-btn"
              >
                Proceed to Checkout
              </Button>

              <p className="font-sans text-xs text-deep-char/50 text-center">
                Delivery & service fees calculated at checkout
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
