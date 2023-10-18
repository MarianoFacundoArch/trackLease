import axios from "axios";
import trackerInterface from "../../../interfaces/trackerInterface.js";
import createPriceRecordDataObject from "../../../utils/createPriceRecordDataObject.js";
import UnexpectedResponseError from "../../errors/unexpectedResponseError.js";
import { logger, reportError } from "../../logger/logger.js";
import https from "https";

const propertyName = "MuzeMetMiami";
class muzeMetMiamiTracker extends trackerInterface {
  constructor() {
    super();
  }

  async trackPrices() {
    logger.debug(`${this.constructor.name}.trackPrices`);
    this.foundPriceRecordDataObjects = [];
    try {
      const axiosInstance = axios.create({
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });

      const floorPlansData = await axiosInstance.get(
        "https://www.muzemetmiami.com/ajax/planspricing/"
      );

      const floorPlanIdToConfig = {};
      if (
        !floorPlansData ||
        !floorPlansData.data ||
        !Array.isArray(floorPlansData.data) ||
        floorPlansData.data.length === 0
      ) {
        throw new UnexpectedResponseError(
          "Unexpected response from server",
          floorPlansData
        );
      }

      for (const currentFloorplan of floorPlansData.data) {
        floorPlanIdToConfig[currentFloorplan.FloorPlanID] = currentFloorplan;
      }

      const responseData = await axiosInstance.get(
        "https://www.muzemetmiami.com/ajax/availability/"
      );

      if (
        !responseData.data ||
        !Array.isArray(responseData.data) ||
        responseData.data.length === 0
      ) {
        throw new UnexpectedResponseError(
          "Unexpected response from server",
          responseData
        );
      }

      for (const currentAptWithPrice of responseData.data) {
        const currentFloorPlanConfig =
          floorPlanIdToConfig[currentAptWithPrice.FloorplanID];
        if (!currentFloorPlanConfig) {
          reportError(
            `${this.constructor.name}.trackPrices`,
            `FloorplanID ${currentAptWithPrice.FloorplanID} not found in floorPlanIdToConfig`
          );
          continue;
        }
        const currentPriceRecordDataObject = createPriceRecordDataObject(
          propertyName,
          currentAptWithPrice.ApartmentNumber,
          currentFloorPlanConfig.Bedrooms,
          currentFloorPlanConfig.Bathrooms,
          currentAptWithPrice.SqFt,
          currentAptWithPrice.MinPrice
        );
        this.foundPriceRecordDataObjects.push(currentPriceRecordDataObject);
      }

      await super._insertAllPriceRecordDataObjectsIntoDbAndCreateNotifications();
    } catch (err) {
      reportError(`${this.constructor.name}.trackPrices`, err);
    }
  }
}

export default muzeMetMiamiTracker;
