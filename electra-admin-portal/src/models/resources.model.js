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

    // 🔐 NEW FIELDS (OPTIONAL → backward compatible)
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public", // old admin resources stay public
    },

    ownerUid: {
      type: String,
      default: null, // null = admin / legacy resource
      index: true,
    },

    createdBy: {
      type: String,
      enum: ["admin", "user"],
      default: "admin", // old resources treated as admin
    },
  },
  { timestamps: true }
);

export const Resource =
  models.Resource || model("Resource", resourceSchema);
