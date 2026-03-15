import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import charactersRouter from "./characters.js";
import questsRouter from "./quests.js";
import battlesRouter from "./battles.js";
import inventoryRouter from "./inventory.js";
import shopRouter from "./shop.js";
import seedRouter from "./seed.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/characters", charactersRouter);
router.use("/quests", questsRouter);
router.use("/battles", battlesRouter);
router.use("/inventory", inventoryRouter);
router.use("/shop", shopRouter);
router.use(seedRouter);

export default router;
