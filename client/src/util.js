import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtKey = "admin-secret";

export const baseURL = "http://localhost:4000/";

/* The user is still logged in if there's a token and the token is still valid */
export function isLoggedIn() {
    return getToken() !== null && jwt.decode(getToken()).exp > Number.parseInt(Date.now() / 1000);
}

export function saveToken(token) {
    localStorage.setItem(jwtKey, token);
}

export function getToken() {
    return localStorage.getItem(jwtKey);
}

export function invalidateToken() {
    localStorage.removeItem(jwtKey);
}

export function getUserData() {
    if (!getToken()) throw new Error("No token found!");
    return jwt.decode(getToken());
}

export function isSuperAdmin() {
    if (getUserData().role === "super-admin")
        return true;
    return false;
}

export function createAxiosInstance() {
    return axios.create({
        baseURL: `/api`,
        headers: { Authorization: `Bearer ${getToken()}` }
    });
}
