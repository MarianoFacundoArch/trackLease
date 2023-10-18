import mongoose from "mongoose";
import configProvider from "../config-provider/configProvider.js";
import {logger} from "../logger/logger.js";

let isInitialized = false;
let isRemoteDbEnabled = false;
const initializeMongoose = async () => {
  if (isInitialized) return;

  if (configProvider.MONGODB_CONNECTIONSTRING) {
    isInitialized = true;

    const connectionOptions = {
      dbName: configProvider.MONGODB_DBNAME,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    };

    if (configProvider.REMOTE_MONGO_MAX_POOL_SIZE) {
      connectionOptions.maxPoolSize = configProvider.REMOTE_MONGO_MAX_POOL_SIZE;
    }
    await mongoose.connect(
      configProvider.MONGODB_CONNECTIONSTRING,
      connectionOptions
    );
    isRemoteDbEnabled = true;
  }
  logger.debug("Connected to MongoDB");
};

const getIsRemoteDbEnabled = () => {
  return isRemoteDbEnabled;
};

export { initializeMongoose, getIsRemoteDbEnabled };
