import axios from "axios";
import trackerInterface from "../../../interfaces/trackerInterface.js";
import createPriceRecordDataObject from "../../../utils/createPriceRecordDataObject.js";
import UnexpectedResponseError from "../../errors/unexpectedResponseError.js";
import { logger, reportError } from "../../logger/logger.js";

class livesolitairTracker extends trackerInterface {
  constructor() {
    super();
  }

  async trackPrices() {
    logger.debug("livesolitairTracker.trackPrices");
    this.foundPriceRecordDataObjects = [];
    try {
      const responseData = await axios.get(
        "https://livesolitair.com/CmsSiteManager/callback.aspx?act=Proxy/GetUnits&available=true&honordisplayorder=true&siteid=8757847&leaseterm=12"
      );

      if (
        !responseData.data ||
        !responseData.data.units ||
        responseData.data.units.length === 0
      ) {
        throw new UnexpectedResponseError(
          "Unexpected response from solitair",
          responseData
        );
      }

      for (const currentAptWithPrice of responseData.data.units) {
        const currentPriceRecordDataObject = createPriceRecordDataObject(
          "Solitair",
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
      reportError("livesolitairTracker.trackPrices", err);
    }
  }
}

export default livesolitairTracker;
