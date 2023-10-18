import PriceRecord from "../models/priceRecord.js";
import {
  reportNewPricingFound,
  reportNewUnitFound,
} from "../modules/events-manager/eventsManager.js";
import { reportError } from "../modules/logger/logger.js";

class trackerInterface {
  constructor() {
    this.foundPriceRecordDataObjects = [];
    this.createdPriceRecords = [];
    if (this.constructor === trackerInterface) {
      throw new TypeError(
        'Abstract class "trackerInterface" cannot be instantiated directly.'
      );
    }
  }

  async trackPrices() {
    throw new Error("This is an abstract method");
  }

  async _insertAllPriceRecordDataObjectsIntoDbAndCreateNotifications() {
    try {
      this.createdPriceRecords = [];
      let savePromises = [];
      for (const currentPriceRecordDataObject of this
        .foundPriceRecordDataObjects) {
        const newPriceRecord = new PriceRecord(currentPriceRecordDataObject);
        this.createdPriceRecords.push(newPriceRecord);
        savePromises.push(newPriceRecord.save());
      }
      if (savePromises.length > 0) {
        await Promise.all(savePromises);
        this._evaluateAndCreateCorrespondingNotifications();
      }
    } catch (err) {
      reportError(
        "trackerInterface._insertAllPriceRecordDataObjectsIntoDb",
        err
      );
    }
  }

  async _evaluateAndCreateCorrespondingNotifications() {
    try {
      for (const currentCreatedPriceRecord of this.createdPriceRecords) {
        try {
          const lastPriceRecordOfSameUnitBefore = await PriceRecord.findOne({
            complexName: currentCreatedPriceRecord.complexName,
            unit: currentCreatedPriceRecord.unit,
            numberOfBedrooms: currentCreatedPriceRecord.numberOfBedrooms,
            numberOfBathrooms: currentCreatedPriceRecord.numberOfBathrooms,
            _id: { $ne: currentCreatedPriceRecord._id },
          })
            .sort({ occurredAt: -1 }) // Sort by occurredAt in descending order
            .limit(1); // Limit to just one record

          if (!lastPriceRecordOfSameUnitBefore) {
            reportNewUnitFound(currentCreatedPriceRecord);
          } else {
            if (
              lastPriceRecordOfSameUnitBefore.price !==
              currentCreatedPriceRecord.price
            ) {
              reportNewPricingFound(
                currentCreatedPriceRecord,
                lastPriceRecordOfSameUnitBefore.price
              );
            }
          }
        } catch (err2) {
          reportError(
            "trackerInterface._evaluateAndCreateCorrespondingNotifications Inner",
            err2
          );
        }
      }
    } catch (err) {
      reportError(
        "trackerInterface._evaluateAndCreateCorrespondingNotifications",
        err
      );
    }
  }
}

export default trackerInterface;
