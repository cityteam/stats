// CategoryRouter --------------------------------------------------------------

// Express endpoints for Category models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {
    requireAdmin,
    requireRegular,
    requireSuperuser,
} from "../oauth/OAuthMiddleware";
import CategoryServices from "../services/CategoryServices";
import {CREATED} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

export const CategoryRouter = Router({
    strict: true,
});

export default CategoryRouter;

// Model-Specific Routes (no categoryId) -------------------------------------

// GET /:facilityId/:sectionId/exact/:ordinal - Find Category by exact ordinal
CategoryRouter.get("/:facilityId/:sectionId/exact/:ordinal",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await CategoryServices.exact(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.sectionId, 10),
            parseInt(req.params.ordinal, 10),
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET /:facilityId/:sectionId - Find all Categories
CategoryRouter.get("/:facilityId/:sectionId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await CategoryServices.all(
            parseInt(req.params.sectionId, 10),
            req.query
        ));
    });

// POST /:facilityId/:sectionId - Insert a new Category
CategoryRouter.post("/:facilityId/:sectionId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.status(CREATED).send(await CategoryServices.insert(
            parseInt(req.params.sectionId, 10),
            req.body
        ));
    });

// DELETE /:facilityId/:sectionId/:categoryId - Remove Category by ID
CategoryRouter.delete("/:facilityId/:sectionId/:categoryId",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await CategoryServices.remove(
            parseInt(req.params.sectionId, 10),
            parseInt(req.params.categoryId, 10),
        ));
    });

// GET /:facilityId/:sectionId/:categoryId - Find Category by ID
CategoryRouter.get("/:facilityId/:sectionId/:categoryId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await CategoryServices.find(
            parseInt(req.params.sectionId, 10),
            parseInt(req.params.categoryId, 10),
            req.query
        ));
    });

// PUT /:facilityId/:sectionId/:categoryId - Update Category by ID
CategoryRouter.put("/:facilityId/:sectionId/:categoryId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await CategoryServices.update(
            parseInt(req.params.sectionId, 10),
            parseInt(req.params.categoryId, 10),
            req.body
        ));
    });

