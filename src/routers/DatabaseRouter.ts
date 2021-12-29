// DatabaseRouter ------------------------------------------------------------

// Router for database administrative services.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import DatabaseServices from "../services/DatabaseServices";
import {requireDatabase} from "../oauth/OAuthMiddleware";

// Public Objects ------------------------------------------------------------

const DatabaseRouter = Router({
    strict: true,
});

DatabaseRouter.delete("/tokens",
    requireDatabase,
    async (req: Request, res: Response) => {
        res.send(await DatabaseServices.purge());
    });

export default DatabaseRouter;
