import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"


const router = Router()

router.route("/register").post(
  // upload.fields is a middleware which runs just before registerUser controller(function)
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    },
    {
      name: "coverImage",
      maxCount: 1
    }
  ]),
  registerUser
)


export default router