import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";

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
  // or use this some() method
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
  console.log("The already existed user  is : ", existedUser)

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
// not needed asyncHandler in this because it is not handling web api's it's just an internal method
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token")
  }
}

const loginUser = asyncHandler(async (req, res) => {
  // 1. Sabsa pahila req body sa data 
  const { fullName, username, password, email } = req.body;
  // 2. Username or email
  // Either use ! and && Or use !(username  || email )
  if (!username && !email) {
    throw new ApiError(400, "Username or Email is required")
  }

  // 3. Find the user
  const user = await User.findOne({
    $or: [{ username }, { email }]
  })
  if (!user) {
    throw new ApiError(404, "User doesn't Exist")
  }
  // 4. Password Check
  const isPasswordvalid = await user.isPasswordCorrect(password)

  if (!isPasswordvalid) {
    throw new ApiError(401, "Incorrect Password")
  }
  // 5. Access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  // 6.  Send cookie
  const options = {
    httpOnly: true,
    secure: true
  }

  // 7. Finally send the response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser, accessToken, refreshToken
        },
        "User logged in SUccessfully !!"
      )
    )

})


const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true // this will make sure the response we get in return is new value not old value
    }
  )
  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out Successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used !");
    }

    const options = {
      httpOnly: true,
      secure: true
    }

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access Token Refreshed Successfully !"
        )
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token")
  }
})

// some basic but required controllers for user.
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  // agr old and new passwords match kara k xai tab....
  // const { oldPassword, newPassword, confirmPassword } = req.body

  // if (!(newPassword === confirmPassword)) {
  //   throw new ApiError(400, "Passwords Don't Match")
  // }
  // since user is trying to change password then it means already logged in xai user
  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect Old Password")
  }

  user.password = newPassword
  // set vagelai but save v ta kara prtai So we save
  await user.save({ validateBeforeSave: false })

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.user, "Current user fetched Successfully")
    )
})

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body
  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required")
  }

  const user = User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email
      }
    },
    { new: true }
  ).select("-password")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account Details Updated Successfully"))
})


const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing ! ")
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar WHILE UPDATING USER AVATAR")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    { new: true }
  ).select("-password")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar Image updated Successfully"))
})


const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover Image file is missing ! ")
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading on coverImage WHILE UPDATING USER CoverImage")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url
      }
    },
    { new: true }
  ).select("-password")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover Image updated Successfully"))
})



export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage
}