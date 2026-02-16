import express from "express";
import { register, login , logout, createOpsUser, getOpsUsers, updateOpsUser, deleteOpsUser} from "../controllers/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/create-ops-user", createOpsUser);
authRouter.get("/get-ops-users", getOpsUsers);
authRouter.put("/update-ops-user/:id", updateOpsUser);
authRouter.delete("/delete-ops-user/:id", deleteOpsUser);


export default authRouter;