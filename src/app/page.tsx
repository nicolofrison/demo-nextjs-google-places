"use client";

import { Item } from "@/components/item";
import Image from "next/image";
import { nearbySearchByNewTextSearch, textSearch } from "./api/googlePlaces";

export default function Home() {
  async function getPlaceByTextSearch(textQuery: string) {
    const text = textQuery.trim();
    if (text.length === 0) {
      return [];
    }

    try {
      const places = await textSearch(textQuery);

      if (places.length === 0) {
        return [];
      }

      return places;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async function getPlaceByTextSearchAndNearby(textQuery: string) {
    const text = textQuery.trim();
    if (text.length === 0) {
      return [];
    }

    try {
      const places = await nearbySearchByNewTextSearch(textQuery);

      if (places.length === 0) {
        return [];
      }

      return places;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full text-sm">
        <h2>Get place by TextSearch api</h2>
        <Item placesProvider={getPlaceByTextSearch} />
      </div>
      <div className="w-full text-sm">
        <h2>Get place by mix between TextSearch and SearchNearby apis</h2>
        <Item placesProvider={getPlaceByTextSearchAndNearby} />
      </div>
    </main>
  );
}
