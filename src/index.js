import configProvider from "./modules/config-provider/configProvider.js";
import { initializeMongoose } from "./modules/mongoose/mongoose.js";
import livesolitairTracker from "./modules/trackers/livesolitair/livesolitairTracker.js";

await initializeMongoose();

const createTrackersAndTrackPrices = () => {
  const liveSolitairTracker = new livesolitairTracker();
  liveSolitairTracker.trackPrices();
};

createTrackersAndTrackPrices();

setInterval(() => {
  createTrackersAndTrackPrices();
}, configProvider.RUN_TRACKERS_EVERY_X_MINUTES * 60 * 1000);
