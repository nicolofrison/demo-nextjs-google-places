# Demo Next.js Google Places

This project demonstrates the difference between the Google APIs' simple textSearch and the combination of textSearch and nearbySearch.

## Purpose

The main purpose of this project is to showcase the discrepancy between the simple textSearch and the combination of textSearch and nearbySearch functionalities provided by Google Places API.

### Simple textSearch

When using the simple textSearch functionality, if searching by address instead of the place name for example, it would find only one place related to the street, possibly neglecting other establishments at the same address.

### Combination of textSearch and nearbySearch

In contrast, combining textSearch and nearbySearch can yield more comprehensive results. It can locate all the places with the same address, offering a broader range of options compared to simple textSearch, making the search by address effective, compared to the search by textSearch only.

## Getting Started

To get started with this project, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Set up your Google Places API credentials inside the `.env` as follows:

```
GOOGLE_MAPS_API_KEY=<API KEY from google>
```

5. The API KEY provided has to have access to the google [Places API (New)](https://console.cloud.google.com/apis/library/places.googleapis.com)
6. Run the project using `npm run dev`.
7. Explore the provided examples to see the difference between the two search functionalities.

## Additional Resources

For more information on Google Places API and how to utilize its various features, refer to the [official documentation](https://developers.google.com/places/web-service/intro).

## Contributors

- [Nicolò Frison](https://github.com/nicolofrison)

Feel free to contribute to this project by opening issues or pull requests. Your feedback and contributions are highly appreciated!

## License

This project is licensed under the [MIT License](LICENSE).
