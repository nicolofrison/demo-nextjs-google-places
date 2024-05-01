'use server';

// https://developers.google.com/maps/documentation/places/web-service/overview

const googleApiKey = process.env.GOOGLE_MAPS_API_KEY as string;

export type NewGooglePlace = {
	id: string;
	displayName: {
		text: string;
		language: string;
	};
	formattedAddress: string;
	photos?: any[];
	location?: {
		latitude: number;
		longitude: number;
	};
};

export async function textSearch(textQuery: string) {
	const x = await fetch('https://places.googleapis.com/v1/places:searchText', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Goog-Api-Key': googleApiKey,
			'X-Goog-FieldMask': [
				'places.id',
				'places.displayName',
				'places.formattedAddress',
				'places.photos',
				'places.location',
			].join(','),
		},
		body: JSON.stringify({
			textQuery: textQuery,
			languageCode: 'en',
		}),
	});

	const data = await x.json();

	return data.places;
}

export async function nearbySearch(lat: number, lng: number, radius: number) {
	const x = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Goog-Api-Key': googleApiKey,
			'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.photos,places.id',
		},
		body: JSON.stringify({
			locationRestriction: {
				circle: {
					center: {
						latitude: lat,
						longitude: lng,
					},
					radius: radius,
				},
			},
			languageCode: 'en',
		}),
	});

	const data = await x.json();

	return data.places;
}

export async function placePhoto(resourceName: string, maxWidthPx?: number, maxHeightPx?: number) {
	const queryParams: any = {
		key: googleApiKey,
		skipHttpRedirect: 'true',
	};

	if (maxWidthPx) {
		queryParams.maxWidthPx = maxWidthPx;
	}

	if (maxHeightPx) {
		queryParams.maxHeightPx = maxHeightPx;
	}

	if (Object.keys(queryParams).length === 2) {
		throw new Error(
			`Either the maxHeightPx parameter, the maxWidthPx parameter, or both have to be defined`,
		);
	}

	const queryParamsText = Object.entries(queryParams)
		.reduce((acc, curr) => {
			acc.push(curr[0] + '=' + curr[1]);
			return acc;
		}, [] as string[])
		.join('&');

	const x = await fetch(
		`https://places.googleapis.com/v1/${resourceName}/media?${queryParamsText}`,
	);

	const data = await x.json();

	return data.photoUri;
}

// MIX API

export async function nearbySearchByNewTextSearch(textQuery: string) {
	const places: NewGooglePlace[] = await textSearch(textQuery);

	if (places.length === 0) {
		return [];
	}

	// If the textQuery is an address, usually it doesn't have a photo
	let { finalPlaces, placesWithoutPhoto } = places.reduce(
		(acc, curr) => {
			if (curr.photos?.length ?? 0 > 0) {
				acc.finalPlaces.push(curr);
			} else if (curr.location) {
				acc.placesWithoutPhoto.push(curr);
			}

			return acc;
		},
		{ finalPlaces: [], placesWithoutPhoto: [] } as {
			finalPlaces: NewGooglePlace[];
			placesWithoutPhoto: NewGooglePlace[];
		},
	);

	for (let i = 0; i < placesWithoutPhoto.length; i++) {
		const p = placesWithoutPhoto[i];

		const placesNearby: NewGooglePlace[] = await nearbySearch(
			p.location?.latitude as number,
			p.location?.longitude as number,
			50,
		);

		const placesNearbyByAddressSimilarity = placesNearby.filter(
			p1 => p.formattedAddress === p1.formattedAddress,
		);

		if (placesNearbyByAddressSimilarity.every(p1 => p1.id !== p.id)) {
			finalPlaces = [...finalPlaces, p];
		}

		finalPlaces = [...finalPlaces, ...placesNearbyByAddressSimilarity];
	}

	return finalPlaces;
}
