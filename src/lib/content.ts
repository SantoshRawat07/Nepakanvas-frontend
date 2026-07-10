import { createPersistedStore, useStore } from "./store";
import { ARTWORKS as SEED_ARTWORKS, type Artwork } from "./artworks";
import { ASSETS } from "./assets";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface EditableArtwork extends Artwork {
  description: string;
  featured: boolean;
}

interface ContentState {
  artworks: EditableArtwork[];
  team: TeamMember[];
  hero: { eyebrow: string; title: string; subtitle: string };
}

const SEED: ContentState = {
  hero: {
    eyebrow: "Handcrafted in Nepal — Est. 2021",
    title: "Where Ideas\nBecome Art.",
    subtitle:
      "A studio dedicated to turning your favourite moments and ideas into timeless canvas, portrait and wall art — painted by hand.",
  },
  artworks: SEED_ARTWORKS.map((a) => ({
    ...a,
    description:
      "Painted by hand on premium cotton canvas using archival acrylics. Signed by the artist and shipped ready to hang, with careful protective packaging.",
    featured: true,
  })),
  team: [
    { id: "t1", name: "Nirajan K.", role: "Lead Artist & Founder", bio: "Portrait & canvas specialist with 8+ years of studio practice.", image: ASSETS.artistHolding },
    { id: "t2", name: "Sneha M.", role: "Wall Art Director", bio: "Large-scale murals for hotels, cafés and residences across the valley.", image: ASSETS.fourFace },
    { id: "t3", name: "Aakash R.", role: "Live Event Painter", bio: "Wedding & ceremony live paintings, delivered on the same day.", image: ASSETS.portraitGirl },
  ],
};

export const contentStore = createPersistedStore<ContentState>("nk_content_v1", SEED);

export const useHero = () => useStore(contentStore, (s) => s.hero);
export const useArtworks = () => useStore(contentStore, (s) => s.artworks);
export const useTeam = () => useStore(contentStore, (s) => s.team);

export const contentActions = {
  updateHero: (patch: Partial<ContentState["hero"]>) =>
    contentStore.set((s) => ({ ...s, hero: { ...s.hero, ...patch } })),
  upsertArtwork: (a: EditableArtwork) =>
    contentStore.set((s) => {
      const i = s.artworks.findIndex((x) => x.id === a.id);
      const next = [...s.artworks];
      if (i >= 0) next[i] = a;
      else next.unshift(a);
      return { ...s, artworks: next };
    }),
  deleteArtwork: (id: string) =>
    contentStore.set((s) => ({ ...s, artworks: s.artworks.filter((a) => a.id !== id) })),
  upsertTeam: (m: TeamMember) =>
    contentStore.set((s) => {
      const i = s.team.findIndex((x) => x.id === m.id);
      const next = [...s.team];
      if (i >= 0) next[i] = m;
      else next.push(m);
      return { ...s, team: next };
    }),
  deleteTeam: (id: string) =>
    contentStore.set((s) => ({ ...s, team: s.team.filter((m) => m.id !== id) })),
  reset: () => contentStore.set(SEED),
};

export function getArtworkById(id: string): EditableArtwork | undefined {
  return contentStore.get().artworks.find((a) => a.id === id);
}
