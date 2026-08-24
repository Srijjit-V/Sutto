export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  swatch: string; // preview color, purely cosmetic
}

export const shopItems: ShopItem[] = [
  { id: "theme-coin", name: "Golden Theme", description: "A warm gold accent for Nibble's card.", cost: 20, swatch: "var(--color-coin)" },
  { id: "theme-success", name: "Fresh Theme", description: "A bright green accent for Nibble's card.", cost: 20, swatch: "var(--color-success)" },
  { id: "theme-accent", name: "Sunset Theme", description: "A bold orange accent for Nibble's card.", cost: 30, swatch: "var(--color-accent)" },
  { id: "hat-party", name: "Party Hat", description: "A little cosmetic flair for Nibble.", cost: 50, swatch: "var(--color-primary)" },
];
