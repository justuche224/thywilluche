import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";

export interface CartItem {
    variantId: string;
    bookId: string;
    bookTitle: string;
    bookSlug: string;
    variantName: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (variantId: string) => void;
    updateItemQuantity: (variantId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (newItem: CartItem) => {
                const items = get().items;
                const existingItem = items.find(
                    (item) => item.variantId === newItem.variantId
                );
                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.variantId === newItem.variantId
                                ? {...item, quantity: item.quantity + newItem.quantity}
                                : item
                        ),
                    });
                } else {
                    set({items: [...items, newItem]});
                }
            },
            removeItem: (variantId: string) =>
                set((state) => ({
                    items: state.items.filter(
                        (item) => item.variantId !== variantId
                    ),
                })),
            updateItemQuantity: (variantId: string, quantity: number) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.variantId === variantId
                            ? {...item, quantity}
                            : item
                    ),
                })),
            clearCart: () => set({items: []}),
            getTotalPrice: () => {
                const items = get().items;
                return items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },
            getTotalItems: () => {
                const items = get().items;
                return items.reduce((total, item) => total + item.quantity, 0);
            },
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);