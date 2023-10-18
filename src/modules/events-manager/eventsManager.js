import { logger, reportError } from "../logger/logger.js";
import axios from "axios";
import configProvider from "../config-provider/configProvider.js";
import EventLog from "../../models/eventLog.js";
const reportNewUnitFound = async (priceRecord) => {
  try {
    if (!priceRecord) throw new Error("priceRecord is null or undefined");
    const notificationText = `New unit at ${priceRecord.complexName} - ${priceRecord.numberOfBedrooms}b${priceRecord.numberOfBathrooms}b - ${priceRecord.squareFeet}sqft - $${priceRecord.price} - Unit: ${priceRecord.unit}`;
    await axios.post(configProvider.IFTT_ENDPOINT, {
      value1: notificationText,
    });
    const newEvent = new EventLog({
      description: notificationText,
    });
    await newEvent.save();
    logger.debug(notificationText);
  } catch (err) {
    reportError("eventsManager.reportNewUnitFound", err);
  }
};

const reportNewPricingFound = async (priceRecord, oldPrice) => {
  try {
    if (!priceRecord) throw new Error("priceRecord is null or undefined");
    const notificationText = `Price change at ${priceRecord.complexName} - ${priceRecord.numberOfBedrooms}b${priceRecord.numberOfBathrooms}b - ${priceRecord.squareFeet}sqft - $${oldPrice} -> $${priceRecord.price} - Unit: ${priceRecord.unit}`;
    await axios.post(configProvider.IFTT_ENDPOINT, {
      value1: notificationText,
    });

    const newEvent = new EventLog({
      description: notificationText,
    });
    await newEvent.save();

    logger.debug(notificationText);
  } catch (err) {
    reportError("eventsManager.reportNewPricingFound", err);
  }
};

export { reportNewUnitFound, reportNewPricingFound };
