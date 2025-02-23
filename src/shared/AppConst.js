const env = "DEV";
// const env = 'PRE';
// const env = 'PRD';

/* app version */
const versionDev = "0.1.0";
const versionPre = "0.1.0";
const versionPrd = "0.1.0";

const dev = {
  APP_NAME: "Cat Shop System ",
  APP_SHORT_NAME: "Cat",
  APP_CODE: "Cat",
  APP_VERSION: versionDev,
  ENV: env,
  ENV_DESC: "สำหรับทดสอบ Develop",
  CONSOLE_LOG: true,
  SESSION_EXPIRED_MINUTES: 720 /* minutes */,
  // API_URL: "http://10.0.0.208/SRM/",
  API_URL: "https://localhost:7258/",
  DEVELOPMENT_DOCUMENTS_URL: "http://10.0.0.202:8060/",
};

// const pre = {
//     APP_NAME: 'Software Request Management',
//     APP_SHORT_NAME: 'SRM',
//     APP_CODE: 'SRM',
//     APP_VERSION: versionPre,
//     ENV: env,
//     ENV_DESC: 'สำหรับทดสอบ Pre-Production',
//     CONSOLE_LOG: true,
//     SESSION_EXPIRED_MINUTES: 720, /* minutes */
//     API_URL: "http://10.0.0.208/SRM_Pre/",
//     DEVELOPMENT_DOCUMENTS_URL: 'http://10.0.0.202:8060/',
// };

// const prd = {
//     APP_NAME: 'Software Request Management',
//     APP_SHORT_NAME: 'SRM',
//     APP_CODE: 'SRM',
//     APP_VERSION: versionPrd,
//     ENV: env,
//     ENV_DESC: "",
//     CONSOLE_LOG: false,
//     SESSION_EXPIRED_MINUTES: 720, /* minutes */
//     API_URL: "http://10.0.0.159/SRM/",
//     DEVELOPMENT_DOCUMENTS_URL: 'http://10.0.0.202:8060/',
// };

let exportConfig = {};

if (env === "DEV") exportConfig = dev;
// if (env === "PRE") exportConfig = pre;
// if (env === "PRD") exportConfig = prd;

export default exportConfig;
