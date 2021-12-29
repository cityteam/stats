// ApiRouter -----------------------------------------------------------------

// Consolidation of Routers for REST APIs for application Models.

// External Modules ----------------------------------------------------------

import {Router} from "express";

// Internal Modules ----------------------------------------------------------

import CategoryRouter from "./CategoryRouter";
import ClientRouter from "./ClientRouter";
import DatabaseRouter from "./DatabaseRouter";
import DetailRouter from "./DetailRouter";
import FacilityRouter from "./FacilityRouter";
import SectionRouter from "./SectionRouter";
import SummaryRouter from "./SummaryRouter";
import UserRouter from "./UserRouter";

// Public Objects ------------------------------------------------------------

export const ApiRouter = Router({
    strict: true,
});

export default ApiRouter;

// Model Specific Routers ----------------------------------------------------

ApiRouter.use("/categories", CategoryRouter);
ApiRouter.use("/client", ClientRouter);
ApiRouter.use("/database", DatabaseRouter);
ApiRouter.use("/details", DetailRouter);
ApiRouter.use("/facilities", FacilityRouter);
ApiRouter.use("/sections", SectionRouter);
ApiRouter.use("/summaries", SummaryRouter);
ApiRouter.use("/users", UserRouter);
