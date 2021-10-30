// ApiRouter -----------------------------------------------------------------

// Consolidation of Routers for REST APIs for application Models.

// External Modules ----------------------------------------------------------

import {Router} from "express";

// Internal Modules ----------------------------------------------------------

import CategoryRouter from "./CategoryRouter";
import ClientRouter from "./ClientRouter";
import DetailRouter from "./DetailRouter";
import FacilityRouter from "./FacilityRouter";
import SectionRouter from "./SectionRouter";
import UserRouter from "./UserRouter";

// Public Objects ------------------------------------------------------------

export const ApiRouter = Router({
    strict: true,
});

export default ApiRouter;

// Model Specific Routers ----------------------------------------------------

ApiRouter.use("/categories", CategoryRouter);
ApiRouter.use("/client", ClientRouter);
ApiRouter.use("/details", DetailRouter);
ApiRouter.use("/facilities", FacilityRouter);
ApiRouter.use("/sections", SectionRouter);
ApiRouter.use("/users", UserRouter);
