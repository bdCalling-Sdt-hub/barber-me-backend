import axios from "axios";
import config from "../config";

interface Location {
    coordinates: [number, number];
}

const getDistanceFromCoordinates = async (
    destination: Location,
    origin: Location
): Promise<number | null> => {
    const apiKey = config.google_maps;

    // Validate input
    if (
        !Array.isArray(origin?.coordinates) ||
        origin.coordinates.length !== 2 ||
        !Array.isArray(destination?.coordinates) ||
        destination.coordinates.length !== 2
    ) {
        console.error("Invalid origin or destination coordinates.");
        return null;
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.coordinates[0]},${origin.coordinates[1]}&destinations=${destination.coordinates[0]},${destination.coordinates[1]}&key=${apiKey}`;

    try {
        // Make API request with a timeout
        const response = await axios.get(url, { timeout: 5000 }); // 5-second timeout
        const data = response.data;

        // Validate response structure
        const distanceInMeters =
            data?.rows?.[0]?.elements?.[0]?.distance?.value;
        if (data?.rows?.[0]?.elements?.[0]?.status === "OK" && distanceInMeters) {
            return distanceInMeters / 1000; // Convert meters to kilometers
        } else {
            console.error(
                "Google Maps API responded with an unexpected structure or error.",
                data
            );
            return null;
        }
    } catch (error: unknown) {
        console.error("Error occurred while fetching distance:", error);
        return null;
    }
};

export default getDistanceFromCoordinates;