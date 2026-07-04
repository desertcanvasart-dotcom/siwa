import { ShoppingCart, X } from "lucide-react";
import { Link } from "wouter";

interface Experience {
  id: string;
  title: string;
  price: number;
}

interface CartBarProps {
  cartItems: Experience[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartBar({ cartItems, onRemoveItem, onClearCart }: CartBarProps) {
  if (cartItems.length === 0) return null;

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-travel-teal text-white shadow-lg border-t">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Cart Summary */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">
                {cartItems.length} experience{cartItems.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            
            <div className="text-lg font-bold">
              ${totalPrice}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            
            {/* Cart Items Preview */}
            <div className="hidden md:flex items-center gap-2 max-w-md overflow-hidden">
              {cartItems.slice(0, 3).map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1 text-sm"
                >
                  <span className="truncate max-w-20">{item.title}</span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {cartItems.length > 3 && (
                <span className="text-sm text-white/80">
                  +{cartItems.length - 3} more
                </span>
              )}
            </div>

            {/* Clear Cart */}
            <button
              onClick={onClearCart}
              className="text-white/80 hover:text-white transition-colors text-sm"
            >
              Clear
            </button>

            {/* View Cart / Plan Trip */}
            <Link
              href="/plan-trip"
              className="bg-white text-travel-teal px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Plan Trip →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}