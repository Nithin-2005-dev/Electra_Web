import { model, models, Schema } from "mongoose";

const resourceSchema = new Schema(
  {
    driveUrl: {
      type: String,
      required: true,
    },

    semester: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    // 🔐 VISIBILITY
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    // 🔑 OWNER (USER UPLOADS)
    ownerUid: {
      type: String,
      default: null, // null = admin / legacy resource
      index: true,
    },

    ownerName: {
      type: String,
      default: null, // stored at upload time
    },

    createdBy: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
  },
  { timestamps: true }
);

export const Resource = models.Resource || model("Resource", resourceSchema);
