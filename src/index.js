import configProvider from "./modules/config-provider/configProvider.js";
import { initializeMongoose } from "./modules/mongoose/mongoose.js";
import bezelMiamiTracker from "./modules/trackers/bezelmiami/bezelMiamiTracker.js";
import flamingPointTracker from "./modules/trackers/flamingopoint/flamingoPointTracker.js";
import flamingoSouthBeachTracker from "./modules/trackers/framingosouthbeach/flamingoSouthBeachTracker.js";
import livesolitairTracker from "./modules/trackers/livesolitair/livesolitairTracker.js";
import metroEdgewaterTracker from "./modules/trackers/metroedgewater/metroEdgewaterTracker.js";
import muzeMetMiamiTracker from "./modules/trackers/muzemetmiami/muzemetmiamitracker.js";
import theWatermarkBiscayneBayTracker from "./modules/trackers/thewatermacbiscaynebay/theWatermarcBiscayneBayTracker.js";

await initializeMongoose();

const createTrackersAndTrackPrices = () => {
  const liveSolitairTrackingInstance = new livesolitairTracker();
  liveSolitairTrackingInstance.trackPrices();
  const flamingoPointTrackerInstance = new flamingPointTracker();
  flamingoPointTrackerInstance.trackPrices();
  const flamingoSouthBeachTrackerInstance = new flamingoSouthBeachTracker();
  flamingoSouthBeachTrackerInstance.trackPrices();
  const muzeMetMiamiTrackerInstance = new muzeMetMiamiTracker();
  muzeMetMiamiTrackerInstance.trackPrices();
  const theWatermarkBiscayneBayTrackerInstance =
    new theWatermarkBiscayneBayTracker();
  theWatermarkBiscayneBayTrackerInstance.trackPrices();
  const bezelMiamiTrackerInstance = new bezelMiamiTracker();
  bezelMiamiTrackerInstance.trackPrices();
  const metroEdgewaterTrackerInstace = new metroEdgewaterTracker();
  metroEdgewaterTrackerInstace.trackPrices();
};

createTrackersAndTrackPrices();

setInterval(() => {
  createTrackersAndTrackPrices();
}, configProvider.RUN_TRACKERS_EVERY_X_MINUTES * 60 * 1000);
