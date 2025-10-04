"use client";

import { Button } from "@/components/ui/button";
import { useCartStore, CartItem } from "@/lib/cart";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface BookVariant {
  id: string;
  variant: string;
  price: number;
  imageUrl: string;
  status: string;
}

interface Book {
  id: string;
  tittle: string;
  slug: string;
}

const AddToCart = ({ book, variant }: { book: Book; variant: BookVariant }) => {
  const { items, addItem, removeItem, updateItemQuantity } = useCartStore();
  const cartItem = items.find(
    (item: CartItem) => item.variantId === variant.id
  );

  const handleAddToCart = () => {
    if (variant.status !== "Available") {
      toast.error("This item is not available");
      return;
    }

    addItem({
      variantId: variant.id,
      bookId: book.id,
      bookTitle: book.tittle,
      bookSlug: book.slug,
      variantName: variant.variant,
      price: variant.price,
      image: variant.imageUrl,
      quantity: 1,
    });
    toast.success("Item added to cart");
  };

  const handleIncrement = () => {
    if (cartItem) {
      updateItemQuantity(variant.id, cartItem.quantity + 1);
      toast.success("Item quantity updated");
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      if (cartItem.quantity === 1) {
        removeItem(variant.id);
        toast.success("Item removed from cart");
      } else {
        updateItemQuantity(variant.id, cartItem.quantity - 1);
        toast.success("Item quantity updated");
      }
    }
  };

  return (
    <>
      {!cartItem ? (
        <Button
          size="sm"
          className="w-full gap-1 text-xs bg-green-500 text-black hover:bg-green-600 disabled:bg-gray-300 disabled:text-gray-500"
          onClick={handleAddToCart}
          disabled={variant.status !== "Available"}
        >
          <ShoppingCart className="h-3 w-3" />
          {variant.status === "Available" ? "Add to Cart" : variant.status}
        </Button>
      ) : (
        <div className="flex items-center justify-between w-full">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 text-black"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDecrement();
            }}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm font-medium">{cartItem.quantity}</span>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 text-black"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleIncrement();
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      )}
    </>
  );
};

export default AddToCart;
