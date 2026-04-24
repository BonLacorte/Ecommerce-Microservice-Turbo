import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import { CustomJwtSessionClaims } from "@repo/types";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const shouldBeUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const auth = getAuth(req);
    const userId = auth.userId;

    if (!userId) {
        return res.status(401).json({ message: "You are not logged in!" });
    }

    req.userId = auth.userId;

    return next();
};

export const shouldBeAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const auth = getAuth(req);
    const userId = auth.userId;

    console.log("Auth Middleware - userId:", userId);
    console.log("Auth Middleware - sessionClaims:", auth.sessionClaims);

    if (!userId) {
        return res.status(401).json({ message: "You are not logged in!" });
    }

    const claims = auth.sessionClaims as CustomJwtSessionClaims;

    if (claims.metadata?.role !== "admin") {
        console.log("Auth Middleware - Access denied for role:", claims.metadata?.role);
        return res.status(403).send({ message: "Unauthorized!" });
    }

    req.userId = auth.userId;

    return next();
};
