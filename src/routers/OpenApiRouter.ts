// OpenApiRouter -------------------------------------------------------------

// Express endpoint to generate an Open API Specification (in JSON format)
// for this application.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders"
import {Request, Response, Router} from "express";
import Application from "../openapi/Application";

// Internal Modules ----------------------------------------------------------

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
        .header("Access-Control-Allow-Origin", "*")
        .send(OPEN_API);
});

// Private Objects -----------------------------------------------------------

export function generator(application: ob.AbstractApplication, asYaml: boolean = false): string {
    const builder = new ob.OpenApiObjectBuilder(application.info().build())
            .components(application.components().build())
            .paths(application.paths().build())
            .tags(application.tags())
            // NOTE - add anything else that is missing
    ;
    return asYaml ? builder.asYaml() : builder.asJson();
}
