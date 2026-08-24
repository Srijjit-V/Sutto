export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  swatch: string; // preview color, purely cosmetic
}

export const shopItems: ShopItem[] = [
  { id: "theme-sunny", name: "Sunny Theme", description: "A warm yellow accent for Nibble's card.", cost: 20, swatch: "var(--color-sunny)" },
  { id: "theme-grass", name: "Grass Theme", description: "A fresh green accent for Nibble's card.", cost: 20, swatch: "var(--color-grass)" },
  { id: "theme-coral", name: "Coral Theme", description: "A bold coral accent for Nibble's card.", cost: 30, swatch: "var(--color-coral)" },
  { id: "hat-party", name: "Party Hat", description: "A little cosmetic flair for Nibble.", cost: 50, swatch: "var(--color-plum)" },
];
