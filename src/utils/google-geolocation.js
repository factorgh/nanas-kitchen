import { notification } from "antd";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
console.log(GOOGLE_MAPS_API_KEY);

// const MATRIX_API_KEY = import.meta.env.VITE_MATRIX_API_KEY;
const IQ_API_KEY = import.meta.env.VITE_IQ_API_KEY;
export const getHumanReadableLocation = async (lat, lng) => {
  try {
    // const response = await axios.get(
    //   `https://api.distancematrix.ai/maps/api/geocode/json?latlng=${lat},${lng}&language=uk&key=${MATRIX_API_KEY}`
    // );
    const response = await axios.get(
      `https://us1.locationiq.com/v1/reverse?key=${IQ_API_KEY}&lat=${lat}&lon=${lng}&format=json&`
    );

    console.log(
      "----------------------------------------Distance Matrix",
      response
    );
    const results = response.data;
    console.log(
      "------------------------------------------------------------------------------"
    );
    console.log(results);
    return results.address.town;
  } catch (error) {
    notification.error({
      message: "Error fetching address",
      description: error.message,
    });
    throw error;
  }
};

// export const getHumanReadableLocation = async (lat, lng) => {
//   try {
//     const response = await axios.get(
//       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
//     );
//     const results = response.data.results;

//     console.log(results);

//     if (results.length > 0) {
//       // Iterate through the results to find the first suitable address
//       const validAddress = results.find(
//         (result) => !/^J[RW]/.test(result.formatted_address.split(",")[0]) // Exclude Plus Codes like JW or JR
//       );

//       if (validAddress) {
//         return validAddress.formatted_address;
//       }

//       // Fallback if no suitable address is found, return the second item if possible
//       if (results[1]) {
//         return results[1].formatted_address;
//       }

//       // Otherwise, default to the first result
//       return results[0].formatted_address;
//     } else {
//       throw new Error("No address found for the given coordinates.");
//     }
//   } catch (error) {
//     notification.error({
//       message: "Error fetching address",
//       description: error.message,
//     });
//     throw error;
//   }
// };

// Handle googleMap in new Browsers Window
export const getGoogleMapsLink = (lat, lng) => {
  return `https://www.google.com/maps?q=${lat},${lng}`;
};
