// OpenApiRouter -------------------------------------------------------------

// Express endpoint to generate an Open API Specification (in JSON format)
// for this application.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import generator from "../openapi/generator/Generator";
import Application from "../openapi/Application";

// Public Objects ------------------------------------------------------------

export const OpenApiRouter = Router({
    strict: true,
});

export default OpenApiRouter;

// OpenApiRouter Routes ------------------------------------------------------

let OPEN_API = "";

OpenApiRouter.get("/", (req: Request, res: Response) => {
    if (OPEN_API === "") {
        OPEN_API = generator(Application);
    }
    res.header("Content-Type", "application/json")
        .send(OPEN_API);
});
