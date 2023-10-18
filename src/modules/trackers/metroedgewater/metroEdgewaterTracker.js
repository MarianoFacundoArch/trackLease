import axios from "axios";
import trackerInterface from "../../../interfaces/trackerInterface.js";
import createPriceRecordDataObject from "../../../utils/createPriceRecordDataObject.js";
import UnexpectedResponseError from "../../errors/unexpectedResponseError.js";
import { logger, reportError } from "../../logger/logger.js";
import https from "https";

const propertyName = "MetroEdgewater";
class metroEdgewaterTracker extends trackerInterface {
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
      const responseData = await axiosInstance.post(
        "https://metroedgewater.com/floorplans/",
        "action=available-units&building=1",
        {
          headers: {
            Accept: "*/*",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Origin: "https://metroedgewater.com",
            Pragma: "no-cache",
            Referer: "https://metroedgewater.com/floorplans/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest",
            "sec-ch-ua":
              '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
          },
        }
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
          currentAptWithPrice.unit,
          currentAptWithPrice.bedroom,
          currentAptWithPrice.bathroom,
          currentAptWithPrice.sq_ft,
          currentAptWithPrice.min_rent
        );
        this.foundPriceRecordDataObjects.push(currentPriceRecordDataObject);
      }

      await super._insertAllPriceRecordDataObjectsIntoDbAndCreateNotifications();
    } catch (err) {
      reportError(`${this.constructor.name}.trackPrices`, err);
    }
  }
}

export default metroEdgewaterTracker;
