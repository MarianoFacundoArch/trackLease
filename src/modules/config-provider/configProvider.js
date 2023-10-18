import dotenvExtended from "dotenv-extended";
import dotenvParseVariables from "dotenv-parse-variables";

const configProvider = dotenvParseVariables(
  dotenvExtended.load({
    silent: true,
    errorOnMissing: false,
    errorOnExtra: true,
    includeProcessEnv: true,
    assignToProcessEnv: true,
    overrideProcessEnv: false,
    errorOnRegex: true,
  })
);

export default configProvider;
