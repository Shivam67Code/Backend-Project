import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { validateLocaleAndSetLanguage } from "typescript";

const registerUser = asyncHandler(async (req, res) => {
  // debug kara lagi consoles
  console.log("req.body is  : ", req.body);
  // console.log("req.files are : ", req.files);
  // console.log("Content-type : ", req.headers['content-type']);
  // 1.Sabsa pahila ta get USER DETAIL from frontend(postman)
  const { fullName, email, password, username } = req.body
  console.log("email", email);
  // 2.Okr baad check VALIDATION that if email is correct and none field is empty
  // either check all one by one
  // if (fullName === "") {
  //   throw new ApiError(400, "FullName is required")
  // }
  // or use this some() thing
  if ([fullName, email, username, password].some((field) =>
    field?.trim() === "")) {
    throw new ApiError(400, "All fields are required")
  }
  //3.validate email format
  if (!email.includes("@") || !email.includes(".com")) {
    throw new ApiError(400, "Please provide a valid email address !! ")
  }
  // 4.CHECK if user ALREADY EXISTS : username,email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })
  console.log(existedUser)

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists")
  }
  console.log(req.files);
  // 5.CHECK for IMAGES , check for avatar
  // const avatarLocalPath = req.files?.avatar[0]?.path;
  // console.log(req.files)
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let avatarLocalPath;
  if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
    avatarLocalPath = req.files.avatar[0].path
  }



  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  // 6. if there is avatar then UPLOAD them to cloudinary 
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  if (!avatar) {
    throw new ApiError(400, "Avatar File is required")
  }
  // 7. create user object - create ENTERY IN DB
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  // 8.  remove password and refresh token field from response
  const checkCreatedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  // check for user creation
  if (!checkCreatedUser) {
    throw new ApiError(500, "Something went wrong while registring User.")
  }
  //9.  return response
  return res.status(201).json(
    new ApiResponse(200, checkCreatedUser, "User registred Successfully")
  )



})

export { registerUser }