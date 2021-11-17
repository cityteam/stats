// SummaryRouter -------------------------------------------------------------

// Express endpoint for Summary data transfer objects.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {requireRegular} from "../oauth/OAuthMiddleware";
import SummaryServices from "../services/SummaryServices";

// Public Objects ------------------------------------------------------------

export const SummaryRouter = Router({
    strict: true,
});

export default SummaryRouter;

// Summary Routes -----------------------------------------------------------

// GET /:facilityId/:sectionId/:date - Retrieve Summary for Section and date
SummaryRouter.get("/:facilityId/:sectionId/:date",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SummaryServices.read(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.sectionId, 10),
            req.params.date
        ));
    });

// POST /:facilityId/:sectionId/:date - Persist Summary for Section and date
SummaryRouter.post("/:facilityId/:sectionId/:date",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SummaryServices.write(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.sectionId, 10),
            req.params.date,
            req.body
        ));
    });

