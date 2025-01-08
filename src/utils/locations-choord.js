import manualLocations from "./manual-locations";

export const deriveLocationsChoord = (name) => {
  if (!name) return;

  const availableChoords = manualLocations.find((loc) => loc.name === name);
  if (availableChoords) {
    const formattedChoords =
      availableChoords.latitude + "," + availableChoords.longitude;
    return formattedChoords;
  }
};
