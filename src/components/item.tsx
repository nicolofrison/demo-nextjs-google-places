"use client";

import { useState } from "react";
import SearchSelect, { SearchSelectOptions } from "./searchSelect";
import { placePhoto } from "@/app/api/googlePlaces";

type ItemProps = {
  placesProvider: (searchString: string) => Promise<any[]>;
};

export function Item({ placesProvider }: ItemProps) {
  const [places, setPlaces] = useState<any[]>([]);
  const [addressOptions, setAddressOptions] = useState<SearchSelectOptions>({});

  const [address, setAddress] = useState<string>("");
  const [selected, setSelected] = useState<any>();

  const [image, setImage] = useState<string>("");

  const retrieveResults = (searchString: string) => {
    const text = searchString.trim();
    if (text.length === 0) {
      setAddressOptions({});
      return;
    }

    setAddressOptions({
      "": {
        text: "Loading...",
        disabled: true,
      },
    });

    setAddress(searchString);

    placesProvider(searchString).then((p) => {
      setPlaces(p);

      setAddressOptions(
        p.reduce((acc, curr) => {
          return {
            ...acc,
            [curr.id]: { text: curr.displayName.text },
          };
        }, {} as SearchSelectOptions)
      );
    });
  };

  function onSelectChange(selectedPlaceId: string) {
    const place = places.find((p) => p.id === selectedPlaceId);

    setAddress(place.formattedAddress);
    setSelected(place);

    if (!place.photos || place.photos.length === 0) {
      setImage("");

      return;
    }

    const photo = place.photos[0];

    placePhoto(photo.name, photo.widthPx)
      .then((p) => {
        setImage(p);
      })
      .catch((e) => console.error(e));
  }

  return (
    <div>
      <div className="w-full">
        <SearchSelect
          options={addressOptions}
          value={address}
          onInputChange={retrieveResults}
          onSelectChange={onSelectChange}
        />
      </div>
      <div className="flex flex-nowrap items-center">
        <textarea
          className="w-2/3"
          rows={10}
          readOnly
          value={selected && JSON.stringify(selected, null, 2)}
        />
        <div className="w-1/3">
          {selected && image ? (
            <img src={image} alt="Image" />
          ) : (
            selected && <p>No image provided by the google apis</p>
          )}
        </div>
      </div>
    </div>
  );
}
