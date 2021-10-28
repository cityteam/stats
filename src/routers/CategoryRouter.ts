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

// GET /:facilityId/exact/:name - Find Category by exact ordinal
CategoryRouter.get("/:facilityId/exact/:ordinal",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await CategoryServices.exact(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.ordinal, 10),
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET /:facilityId - Find all Categories
CategoryRouter.get("/:facilityId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await CategoryServices.all(
            parseInt(req.params.facilityId, 10),
            req.query
        ));
    });

// POST /:facilityId/ - Insert a new Category
CategoryRouter.post("/:facilityId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.status(CREATED).send(await CategoryServices.insert(
            parseInt(req.params.facilityId, 10),
            req.body
        ));
    });

// DELETE /:facilityId/:categoryId - Remove Category by ID
CategoryRouter.delete("/:facilityId/:categoryId",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await CategoryServices.remove(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.categoryId, 10),
        ));
    });

// GET /:facilityId/:categoryId - Find Category by ID
CategoryRouter.get("/:facilityId/:categoryId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await CategoryServices.find(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.categoryId, 10),
            req.query
        ));
    });

// PUT /:facilityId/:categoryId - Update Category by ID
CategoryRouter.put("/:facilityId/:categoryId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await CategoryServices.update(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.categoryId, 10),
            req.body
        ));
    });

// Category-Author Relationships -----------------------------------------------

// GET /:facilityId/:categoryId/Details - Find Details for this Category
CategoryRouter.get("/:facilityId/:categoryId/details",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await CategoryServices.details(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.categoryId, 10),
            req.query
        ));
    });

