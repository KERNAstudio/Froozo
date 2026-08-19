import burgerSprite from "@/assets/burger-sprite.webp";

export type SpriteSheet = {
  src: string;
  cols: number;
  rows: number;
  /** last real frame index; sheets with blank padding cells stop before the end */
  lastFrame: number;
};

export type FoodConfig = {
  id: string;
  label: string;
  /** null until we have a real assembly clip for this dish */
  sprite: SpriteSheet | null;
};

export const burger: FoodConfig = {
  id: "burger",
  label: "Burger",
  sprite: { src: burgerSprite, cols: 9, rows: 8, lastFrame: 71 },
};
export const pizza: FoodConfig = { id: "pizza", label: "Pizza", sprite: null };
export const milkshake: FoodConfig = { id: "milkshake", label: "Shake", sprite: null };

export const foodConfigs: FoodConfig[] = [burger, pizza, milkshake];

/** The dish currently featured on the homepage hero. */
export const featuredFood = burger;
