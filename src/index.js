import configProvider from "./modules/config-provider/configProvider.js";
import { initializeMongoose } from "./modules/mongoose/mongoose.js";
import flamingPointTracker from "./modules/trackers/flamingopoint/flamingoPointTracker.js";
import flamingoSouthBeachTracker from "./modules/trackers/framingosouthbeach/flamingoSouthBeachTracker.js";
import livesolitairTracker from "./modules/trackers/livesolitair/livesolitairTracker.js";

await initializeMongoose();

const createTrackersAndTrackPrices = () => {
  const liveSolitairTrackingInstance = new livesolitairTracker();
  liveSolitairTrackingInstance.trackPrices();
  const flamingoPointTrackerInstance = new flamingPointTracker();
  flamingoPointTrackerInstance.trackPrices();
  const flamingoSouthBeachTrackerInstance = new flamingoSouthBeachTracker();
  flamingoSouthBeachTrackerInstance.trackPrices();
};

createTrackersAndTrackPrices();

setInterval(() => {
  createTrackersAndTrackPrices();
}, configProvider.RUN_TRACKERS_EVERY_X_MINUTES * 60 * 1000);
