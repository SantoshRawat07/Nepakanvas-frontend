"use client";
import { useEffect } from "react";
import { authActions } from "@/lib/auth";

export function AuthHydrator() {
  useEffect(() => { authActions.checkAuth(); }, []);
  return null;
}