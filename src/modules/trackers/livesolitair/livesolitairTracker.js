import axios from "axios";
import trackerInterface from "../../../interfaces/trackerInterface.js";
import createPriceRecordDataObject from "../../../utils/createPriceRecordDataObject.js";
import UnexpectedResponseError from "../../errors/unexpectedResponseError.js";
import { logger, reportError } from "../../logger/logger.js";
import https from "https";

const propertyName = "Solitair";
class livesolitairTracker extends trackerInterface {
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
        "https://livesolitair.com/CmsSiteManager/callback.aspx?act=Proxy/GetUnits&available=true&honordisplayorder=true&siteid=8757847&leaseterm=12"
      );

      if (
        !responseData.data ||
        !responseData.data.units ||
        responseData.data.units.length === 0
      ) {
        throw new UnexpectedResponseError(
          "Unexpected response from server",
          responseData
        );
      }

      for (const currentAptWithPrice of responseData.data.units) {
        const currentPriceRecordDataObject = createPriceRecordDataObject(
          propertyName,
          currentAptWithPrice.name,
          currentAptWithPrice.numberOfBeds,
          currentAptWithPrice.numberOfBaths,
          currentAptWithPrice.squareFeet,
          currentAptWithPrice.rent
        );
        this.foundPriceRecordDataObjects.push(currentPriceRecordDataObject);
      }

      await super._insertAllPriceRecordDataObjectsIntoDbAndCreateNotifications();
    } catch (err) {
      reportError(`${this.constructor.name}.trackPrices`, err);
    }
  }
}

export default livesolitairTracker;
