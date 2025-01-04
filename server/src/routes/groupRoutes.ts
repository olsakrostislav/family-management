import { Router } from "express";

import { getGroup } from "../controllers/groupController";

const router = Router();

router.get("/", getGroup);

export default router;
