import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  // console.log("Register route hit!"); // Debug log
  // console.log("Request body:", req.body); // Debug log

  res.status(200).json({
    success: true,
    message: "User registration endpoint working!",
    data: {
      endpoint: "/api/v1/users/register",
      method: "POST",
      body: req.body,
      timestamp: new Date().toISOString()
    }
  })
})

export { registerUser }