import portrait from "../assets/portrait.webp";
import balen from "../assets/balen.webp";
import family from "../assets/family.webp";
import girl from "../assets/girl.webp";
import buddha from "../assets/buddha.webp";
import person from "../assets/person.webp";
import flower from "../assets/flower.jpeg";
import wallpainting from "../assets/wallpainting.jpeg";
import pm from "../assets/pm.webp";
import weeding from "../assets/weeding.jpeg";

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
  { id: "girl-flower", title: "Plumeria Girl", image: portrait.src, category: "Portrait", price: "Rs 800", size: '3"×3"', artist: "Studio NK" },
  { id: "balen", title: "Mayor Portrait Study", image: balen.src, category: "Canvas", price: "Rs 1,200", size: '3"×3"', artist: "Studio NK" },
  { id: "four-face", title: "Four Faces — Made to Remember", image: family.src, category: "Portrait", price: "Rs 2,400", size: '6"×6"', artist: "Studio NK" },
  { id: "girl", title: "Girl portrait — Smile", image: girl.src, category: "Portrait", price: "Rs 800", size: '3"×3"', artist: "Studio NK" },
  { id: "buddha", title: "Little Buddha", image: buddha.src, category: "Modern", price: "Rs 600", size: '3"×3"', artist: "Studio NK" },
  { id: "person", title: "From the Studio", image: person.src, category: "Canvas", price: "Rs 800", size: '3"×3"', artist: "Studio NK" },
  { id: "flower", title: "Flower Study", image: flower.src, category: "Nature", price: "Rs 600", size: '3"×3"', artist: "Studio NK" },
  { id: "wallpainting", title: "Wall Painting", image: wallpainting.src, category: "Wall Art", price: "Rs 1,500", size: '12"×12"', artist: "Studio NK" },
  { id: "weeding", title: "Wedding Painting", image: weeding.src, category: "Modern", price: "Rs 1,500", size: '12"×12"', artist: "Studio NK" },
  { id: "pm", title: "Prime Minister Portrait", image: pm.src, category: "Portrait", price: "Rs 1,200", size: '3"×3"', artist: "Studio NK" },
];

export const CATEGORIES = ["All", "Canvas", "Portrait", "Nature", "Modern", "Abstract", "Wall Art"] as const;