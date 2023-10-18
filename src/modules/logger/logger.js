import log4js from "log4js";
import ErrorLog from "../../models/errorLog.js";
import configProvider from "../config-provider/configProvider.js";
// @ts-ignore
log4js.configure({
  appenders: {
    consoleAppender: { type: "console" },
  },
  categories: {
    // default: { appenders: ['webrtcMainRootAppender'], level: 'error' }
    default: {
      appenders: ["consoleAppender"],
      level: configProvider.LOG_LEVEL,
    },
  },
});
// console.log(chalk.yellow("Started logging for MediaSuite"));
const logger = log4js.getLogger("F-LeaseTracker");

const reportError = (nameOfFunctionGeneratingTheError, errorObject) => {
  logger.error(
    "Error on " +
      nameOfFunctionGeneratingTheError +
      ": " +
      errorObject.toString()
  );

  createLogEntryInDbIfEnabled(nameOfFunctionGeneratingTheError, errorObject);
};

const createLogEntryInDbIfEnabled = async (
  nameOfFunctionGeneratingTheError,
  errorObject
) => {
  try {
    if (configProvider.CREATE_DB_LOG_FOR_ERRORS) {
      const newLog = new ErrorLog({
        nameOfFunctionGeneratingTheError: nameOfFunctionGeneratingTheError,
        errorObject: errorObject,
      });

      await newLog.save();
    }
  } catch (err) {
    logger.error("Error on createLogEntryInDb: " + err.toString());
  }
};

export { logger, reportError };
