import jwt from "jsonwebtoken";
import { promisify } from "util";

import * as HttpStatus from "../utils/HttpStatus.js"
import AuthException from "./AuthException.js";
import * as secrets from "../utils/secrets.js"

const bearer = "bearer";

export default async (req, res, next) => {

    try {
        const {authorization } = req.headers;
        if(!authorization) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, "No access token informed");
        }
        let accessToken = authorization;
        if(accessToken.includes(" ")) {
            accessToken = accessToken.split(" ")[1];
        }

        const decoded = await promisify(jwt.verify)(
            accessToken,
            secrets.apiSecrect
        );
        req.authenticatedUser = decoded.authenticatedUser;
        return next();
    } catch (error) {
        const errorStatus = error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR;
        return res.status(errorStatus).json({
            errorStatus,
            message: error.message
        });
        
    }
    
}