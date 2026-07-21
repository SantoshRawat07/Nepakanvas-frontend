"use client";

import { useSyncExternalStore } from "react";
import { apiGet, apiPostForm, apiPutForm, apiDelete } from "./api";
import type { TeamMember } from "./content";

interface BackendTeamMember {
  _id: string;
  name: string;
  title: string;
  description: string;
  profileImage: string;
}

function mapTeamMember(t: BackendTeamMember): TeamMember {
  return {
    id: t._id,
    name: t.name,
    role: t.title,
    bio: t.description,
    image: t.profileImage,
  };
}

let team: TeamMember[] = [];
let loaded = false;
let loading = false;
let error: string | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const EMPTY: TeamMember[] = [];

async function fetchTeam() {
  if (loading) return;
  loading = true;
  error = null;
  emit();
  try {
    const data = await apiGet<BackendTeamMember[]>("/admin/teams");
    team = data.map(mapTeamMember);
    loaded = true;
  } catch (e: any) {
    error = e.message ?? "Failed to load team";
  } finally {
    loading = false;
    emit();
  }
}

export function getTeamSnapshot(): TeamMember[] {
  if (!loaded && !loading) fetchTeam();
  return team;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!loaded && !loading) fetchTeam();
  return () => listeners.delete(cb);
}

export function useTeamBackend() {
  return useSyncExternalStore(subscribe, () => team, () => EMPTY);
}

export function useTeamStatus() {
  return { loading, error };
}

export const teamActions = {
  refresh: fetchTeam,

  async create(input: {
    name: string;
    title: string;
    description: string;
    profileImage: File;
  }) {
    const fd = new FormData();
    fd.append("name", input.name);
    fd.append("title", input.title);
    fd.append("description", input.description);
    fd.append("profileImage", input.profileImage);
    await apiPostForm("/admin/teams", fd);
    await fetchTeam();
  },

  async update(id: string, input: {
    name?: string;
    title?: string;
    description?: string;
    profileImage?: File | null;
  }) {
    const fd = new FormData();
    if (input.name !== undefined) fd.append("name", input.name);
    if (input.title !== undefined) fd.append("title", input.title);
    if (input.description !== undefined) fd.append("description", input.description);
    if (input.profileImage) fd.append("profileImage", input.profileImage);
    await apiPutForm(`/admin/teams/${id}`, fd);
    await fetchTeam();
  },

  async remove(id: string) {
    await apiDelete(`/admin/teams/${id}`);
    await fetchTeam();
  },
};