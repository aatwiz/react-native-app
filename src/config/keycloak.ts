/**
 * Keycloak configuration.
 *
 * Update the values below with your Keycloak server details in .env:
 *  - KEYCLOAK_URL:      Base URL of the Keycloak server (no trailing slash).
 *  - KEYCLOAK_REALM:    The realm your client lives in.
 *  - KEYCLOAK_CLIENT_ID: The public OIDC client configured in Keycloak.
 */

export const KEYCLOAK_URL = "http://192.168.100.101:8080";
export const REALM = "my-app-realm";
export const CLIENT_ID = "aip-genius-app";

/** Derived OIDC endpoints */
export const DISCOVERY_URL = `${KEYCLOAK_URL}/realms/${REALM}/.well-known/openid-configuration`;
export const AUTH_ENDPOINT = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/auth`;
export const TOKEN_ENDPOINT = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;
export const LOGOUT_ENDPOINT = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`;
export const USERINFO_ENDPOINT = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/userinfo`;
