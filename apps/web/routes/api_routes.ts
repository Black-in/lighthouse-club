/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const API_URL = BACKEND_URL + '/api/v1';
export const SIGNIN_URL = API_URL + '/sign-in';

export const GENERATE_CONTRACT = API_URL + '/generate';
export const PLAN_CONTEXT_URL = API_URL + '/plan';
export const GET_CHAT_URL = API_URL + '/contract/get-chat';

// subscription
export const SUBSCRIPTION_URL = API_URL + '/subscription';
export const CREATE_ORDER_URL = SUBSCRIPTION_URL + '/create-order';
export const UPDATE_URL = SUBSCRIPTION_URL + '/update';
export const GET_PLAN_URL = SUBSCRIPTION_URL + '/get-plan';

export const FILES_URL = API_URL + '/files';
export const SYNC_FILES_URL = FILES_URL + '/sync';
export const RUN_COMMAND_URL = API_URL + '/contract/run-command';

export const EXPORT_CONTRACT_URL = API_URL + '/github/export-code';
export const CHECK_REPO_NAME = API_URL + '/github/validate-repo-name';
export const DOWNLOAD_ZIP_FILE = API_URL + '/github/get-zip-file';

export const LINK_ACCOUNT = API_URL + '/link-account';

// reviews
export const CONTRACT_REVIEW_URL = API_URL + '/contract-review';
export const PUBLIC_REVIEW_URL = API_URL + '/public-review';
export const GET_REVIEWS = API_URL + '/get-reviews';

// contracts
export const GET_USER_CONTRACTS = API_URL + '/contracts/get-user-contracts';
export const GET_ALL_CONTRACTS = API_URL + '/contracts/get-all-contracts';
export const DELETE_CONTRACT = API_URL + '/contracts';
export const GET_CURRENT_CONTRACT_DATA_URL = API_URL + '/get-contract-messages';

// templates
export const GET_ALL_TEMPLATES = API_URL + '/template/get-templates';
export const GENERATE_TEMPLATE = API_URL + '/template/generate-template';
