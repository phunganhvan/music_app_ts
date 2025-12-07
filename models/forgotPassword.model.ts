import mongoose, { Document, Schema } from "mongoose";

const forgotPasswordSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expiresAfter: {
            type: Date,
            // TTL index: xóa khi thời điểm này đã qua
            expires: 0
        }
    },
    {
        timestamps: true,
    }
);

// Tạo Model
export const ForgotPassword = mongoose.model(
    "ForgotPassword",
    forgotPasswordSchema,
    "forgotPassword"
);
