import axios from "axios";
import trackerInterface from "../../../interfaces/trackerInterface.js";
import createPriceRecordDataObject from "../../../utils/createPriceRecordDataObject.js";
import UnexpectedResponseError from "../../errors/unexpectedResponseError.js";
import { logger, reportError } from "../../logger/logger.js";
import https from "https";

const propertyName = "FlamingoPoint";
class flamingPointTracker extends trackerInterface {
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
      const responseData = await axiosInstance.get(
        "https://www.flamingo-point.com/en/apartments/residences/_jcr_content.residences.json"
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
        const currentPriceRecordDataObject = createPriceRecordDataObject(
          propertyName,
          currentAptWithPrice.unitName,
          currentAptWithPrice.bedrooms,
          currentAptWithPrice.bathrooms,
          currentAptWithPrice.sqft,
          currentAptWithPrice.minRent
        );
        this.foundPriceRecordDataObjects.push(currentPriceRecordDataObject);
      }

      await super._insertAllPriceRecordDataObjectsIntoDbAndCreateNotifications();
    } catch (err) {
      reportError(`${this.constructor.name}.trackPrices`, err);
    }
  }
}

export default flamingPointTracker;
