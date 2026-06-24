import UserModel from "../models/user";

export const removePushToken = async (token, userId) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: { pushNotificationTokens: { token: token } },
      },
      { new: true },
    );

    if (!updatedUser) return { message: "User not found" };

    return {
      message: "Push token removed successfully",
      tokens: updatedUser.pushNotificationTokens,
    };
  } catch (error) {
    return { error: "error removing token" };
  }
};
