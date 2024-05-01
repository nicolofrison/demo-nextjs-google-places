"use client";

import { Item } from "@/components/item";
import Image from "next/image";
import { textSearch } from "./api/googlePlaces";

export default function Home() {
  async function getPlace(textQuery: string) {
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Item placesProvider={getPlace} />
      </div>
    </main>
  );
}
