// SectionRouter -------------------------------------------------------------

// Express endpoints for Section models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {
    requireAdmin,
    requireRegular,
    requireSuperuser,
} from "../oauth/OAuthMiddleware";
import SectionServices from "../services/SectionServices";
import {CREATED} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

export const SectionRouter = Router({
    strict: true,
});

export default SectionRouter;

// Model-Specific Routes (no sectionId) -------------------------------------

// GET /:facilityId/exact/:ordinal - Find Section by exact ordinal
SectionRouter.get("/:facilityId/exact/:ordinal",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SectionServices.exact(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.ordinal, 10),
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET /:facilityId/ - Find all Sections
SectionRouter.get("/:facilityId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SectionServices.all(
            parseInt(req.params.facilityId, 10),
            req.query
        ));
    });

// POST /:facilityId- Insert a new Section
SectionRouter.post("/:facilityId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.status(CREATED).send(await SectionServices.insert(
            parseInt(req.params.facilityId, 10),
            req.body
        ));
    });

// DELETE /:facilityId/:sectionId - Remove Section by ID
SectionRouter.delete("/:facilityId/:sectionId",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await SectionServices.remove(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.sectionId, 10),
        ));
    });

// GET /:facilityId/:sectionId/ - Find Section by ID
SectionRouter.get("/:facilityId/:sectionId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SectionServices.find(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.sectionId, 10),
            req.query
        ));
    });

// PUT /:facilityId/:sectionId- Update Section by ID
SectionRouter.put("/:facilityId/:sectionId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await SectionServices.update(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.sectionId, 10),
            req.body
        ));
    });

// Section-Category Relationships --------------------------------------------

// GET /:facilityId/:sectionId/categories - Find Categories for this Section
SectionRouter.get("/:facilityId/:sectionId/categories",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SectionServices.categories(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.sectionId, 10),
            req.query
        ));
    })
