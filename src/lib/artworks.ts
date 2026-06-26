import { ASSETS } from "./assets";

export interface Artwork {
  id: string;
  title: string;
  image: string;
  category: "Portrait" | "Canvas" | "Nature" | "Modern" | "Abstract" | "Wall Art";
  price: string;
  size: string;
  artist: string;
}

export const ARTWORKS: Artwork[] = [
  { id: "girl-flower", title: "Plumeria Girl", image: ASSETS.portraitGirl, category: "Portrait", price: "Rs 800", size: '3"×3"', artist: "Studio NK" },
  { id: "balen", title: "Mayor Portrait Study", image: ASSETS.portraitBalen, category: "Portrait", price: "Rs 1,200", size: '3"×3"', artist: "Studio NK" },
  { id: "four-face", title: "Four Faces — Made to Remember", image: ASSETS.fourFace, category: "Portrait", price: "Rs 2,400", size: '6"×6"', artist: "Studio NK" },
  { id: "ronaldo", title: "Icon — Smile", image: ASSETS.portraitRonaldo, category: "Portrait", price: "Rs 800", size: '3"×3"', artist: "Studio NK" },
  { id: "buddha", title: "Little Buddha", image: ASSETS.buddha, category: "Modern", price: "Rs 600", size: '3"×3"', artist: "Studio NK" },
  { id: "artist", title: "From the Studio", image: ASSETS.artistHolding, category: "Canvas", price: "Rs 800", size: '3"×3"', artist: "Studio NK" },
];

export const CATEGORIES = ["All", "Canvas", "Portrait", "Nature", "Modern", "Abstract", "Wall Art"] as const;
