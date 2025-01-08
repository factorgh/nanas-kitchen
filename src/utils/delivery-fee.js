import { notification } from "antd";
import manualLocations from "./manual-locations";

export const deriveDeliveryRate = (location) => {
  // Check if location is valid

  if (!location) return;

  const existingLoc = manualLocations.find((loc) => loc.name === location);

  if (!existingLoc)
    notification.error({ message: `Delivery not available for ${location}` });

  // If location is found, return its price, else return 0
  if (existingLoc) {
    return existingLoc.price;
  } else {
    return 0;
  }
};
