import controller from "../controllers/index.controller"
import express from 'express';
const router = express.Router();

router.get("/", controller.main);
router.get("/db/:db", controller.tables);
router.get("/desc/:db/:table", controller.desc);
router.post("/query/:db", controller.query);
router.post("/insert/:db/:table", controller.insert);


export default router;