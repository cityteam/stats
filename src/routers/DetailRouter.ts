// DetailRouter --------------------------------------------------------------

// Express endpoints for Detail models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {
    requireAdmin,
    requireRegular,
} from "../oauth/OAuthMiddleware";
import DetailServices from "../services/DetailServices";
import {CREATED} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

export const DetailRouter = Router({
    strict: true,
});

export default DetailRouter;

// Model-Specific Routes (no detailId) ---------------------------------------

// Standard CRUD Routes ------------------------------------------------------

// GET /:categoryId - Find all Details
DetailRouter.get("/:categoryId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await DetailServices.all(
            parseInt(req.params.categoryId, 10),
            req.query
        ));
    });

// POST /:categoryId/ - Insert a new Detail
DetailRouter.post("/:categoryId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.status(CREATED).send(await DetailServices.insert(
            parseInt(req.params.categoryId, 10),
            req.body
        ));
    });

// DELETE /:categoryId/:detailId - Remove Detail by ID
DetailRouter.delete("/:categoryId/:detailId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await DetailServices.remove(
            parseInt(req.params.categoryId, 10),
            parseInt(req.params.detailId, 10),
        ));
    });

// GET /:categoryId/:detailId - Find Detail by ID
DetailRouter.get("/:categoryId/:detailId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await DetailServices.find(
            parseInt(req.params.categoryId, 10),
            parseInt(req.params.detailId, 10),
            req.query
        ));
    });

// PUT /:categoryId/:detailId - Update Detail by ID
DetailRouter.put("/:categoryId/:detailId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await DetailServices.update(
            parseInt(req.params.categoryId, 10),
            parseInt(req.params.detailId, 10),
            req.body
        ));
    });

