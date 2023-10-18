import configProvider from "./modules/config-provider/configProvider.js";
import { initializeMongoose } from "./modules/mongoose/mongoose.js";
import livesolitairTracker from "./modules/trackers/livesolitair/livesolitairTracker.js";

await initializeMongoose();

const tracker = new livesolitairTracker();

tracker.trackPrices();
