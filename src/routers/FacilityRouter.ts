// FacilityRouter ------------------------------------------------------------

// Express endpoints for Facility models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {
//    dumpRequestDetails,
    requireAdmin,
    requireAny,
    requireRegular,
    requireSuperuser
} from "../oauth/OAuthMiddleware";
import FacilityServices from "../services/FacilityServices";
import {CREATED} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

const FacilityRouter = Router({
    strict: true,
});

export default FacilityRouter;

// Model-Specific Routes (no facilityId) -------------------------------------

FacilityRouter.get("/exact/:name",
    requireAny, // No facilityId is present
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.exact(
            req.params.name,
            req.query,
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

FacilityRouter.get("/",
    // requireAny, // This is used before login
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.all(
            req.query
        ));
    });

FacilityRouter.post("/",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.status(CREATED).send(await FacilityServices.insert(
            req.body
        ));
    });

FacilityRouter.delete("/:facilityId",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.remove(
            parseInt(req.params.facilityId, 10)
        ));
    });

FacilityRouter.get("/:facilityId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.find(
            parseInt(req.params.facilityId, 10),
            req.query
        ));
    });

FacilityRouter.put("/:facilityId",
//    dumpRequestDetails,
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.update(
            parseInt(req.params.facilityId, 10),
            req.body
        ));
    });

// Model-Specific Routes (with facilityId) -----------------------------------

FacilityRouter.get("/:facilityId/sections",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.sections(
            parseInt(req.params.facilityId, 10),
            req.query
        ));
    });

FacilityRouter.post("/:facilityId/categories",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.populate(
            parseInt(req.params.facilityId, 10)
        ));
    });

// GET /:facilityId/users - Find matching Users for this Facility
FacilityRouter.get("/:facilityId/users",
    requireAdmin,
    async (req, res) => {
        res.send(await FacilityServices.users(
            parseInt(req.params.facilityId, 10),
            req.query
        ));
    });

// POST /:facilityId/users - Insert new User for this Facility
FacilityRouter.post("/:facilityId/users",
    requireAdmin,
    async (req, res) => {
        res.send(await FacilityServices.usersInsert(
            parseInt(req.params.facilityId, 10),
            req.body
        ));
    });

// DELETE /:facilityId/users/:userId - Remove existing User for this Facility
FacilityRouter.delete("/:facilityId/users/:userId",
    requireAdmin,
    async (req, res) => {
        res.send(await FacilityServices.usersRemove(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.userId, 10),
        ));
    });

// PUT /:facilityId/users - Update existing User for this Facility
FacilityRouter.put("/:facilityId/users/:userId",
    requireAdmin,
    async (req, res) => {
        res.send(await FacilityServices.usersUpdate(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.userId, 10),
            req.body
        ));
    });

// GET /:facilityId/users/exact/:username - Find exactly matching User by username
FacilityRouter.get("/:facilityId/users/exact/:username",
    requireAdmin,
    async (req, res) => {
        res.send(await FacilityServices.usersExact(
            parseInt(req.params.facilityId, 10),
            req.params.username,
            req.query
        ));
    });

