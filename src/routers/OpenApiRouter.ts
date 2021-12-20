// OpenApiRouter -------------------------------------------------------------

// Express endpoint to generate an Open API Specification (in JSON format)
// for this application.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";
import Generator from "../openapi/Generator";

// Internal Modules ----------------------------------------------------------

import application from "../openapi/Application";

// Public Objects ------------------------------------------------------------

export const OpenApiRouter = Router({
    strict: true,
});

export default OpenApiRouter;

// OpenApiRouter Routes ------------------------------------------------------

OpenApiRouter.get("/", (req: Request, res: Response) => {
    res.header("Content-Type", "application/json")
        .send(Generator(application));
});
