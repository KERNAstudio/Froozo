import {
  Beef,
  CakeSlice,
  Citrus,
  Coffee,
  Cookie,
  CupSoda,
  Croissant,
  Drumstick,
  EggFried,
  Flame,
  IceCreamBowl,
  Leaf,
  Pizza,
  Salad,
  Sandwich,
  Soup,
  Utensils,
  Wheat,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Illustrated stand-ins per menu category — no fabricated food photography. */
const icons: Record<string, LucideIcon> = {
  pizza: Pizza,
  burger: Beef,
  salad: Salad,
  pasta: Soup,
  "stuffed-nanza": Flame,
  sandwiches: Sandwich,
  wraps: Croissant,
  "bread-buns": Wheat,
  "fries-tornado": Drumstick,
  nachos: EggFried,
  momos: Leaf,
  "kulhad-pizza": Pizza,
  maggi: Soup,
  "waffle-pancakes": CakeSlice,
  shakes: IceCreamBowl,
  "bubble-waffle": Cookie,
  mocktails: Citrus,
  beverages: Coffee,
  drinks: CupSoda,
};

export function CategoryIcon({
  id,
  className = "size-4",
}: {
  id: string;
  className?: string;
}) {
  const Icon = icons[id] ?? Utensils;
  return <Icon className={className} aria-hidden strokeWidth={1.6} />;
}
