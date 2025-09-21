import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"



const registerUser = asyncHandler(async (req, res) => {
  // Sabsa pahila ta get USER DETAIL from frontend(postman)
  const { fullName, email, password, username } = req.body
  console.log("email", email);
  // VALIDATION that if email is correct and none field is empty
  // either check all one by one
  // if (fullName === "") {
  //   throw new ApiError(400, "FullName is required")
  // }
  // or use this some() thing
  if ([fullName, email, username, password].some((field) =>
    field?.trim() === "")) {
    throw new ApiError(400, "All fields are required")
  }
  //validate email format
  if (!email.includes("@") || !email.includes(".com")) {
    throw new ApiError(400, "Please provide a valid email address !! ")
  }
  // CHECK if user ALREADY EXISTS : username,email
  const existedUser = User.findOne({
    $or: [{ username }, { email }]
  })
  console.log(existedUser)

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists")
  }
  // CHECK for IMAGES , check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log(req.files)
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  // if there is avatar then UPLOAD them to cloudinary 

  // create user object - create ENTERY IN DB
  // remove password and refresh token field from response
  // check for user creation
  // return response


})

export { registerUser }