import { Schema, model } from "mongoose";

import { Appointment } from "../interfaces/appointment";
import AppError from "../utils/appError";

const appointmentSchema = new Schema<Appointment>(
  {
    user: {
      type: "objectId",
      ref: "user",
      required: true,
    },
    salon: {
      type: "objectId",
      ref: "salon",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      validate(date: string) {
        if (new Date(date) < new Date()) {
          throw new AppError("Date isnt valid", 400);
        }
      },
    },
    completed: {
      type: Boolean,
      default: false,
    },
    services: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

appointmentSchema.methods.toJSON = function (): Appointment {
  const appointment = this;
  const appointmentObject = appointment.toObject() as any;

  delete appointmentObject.createdAt;
  delete appointmentObject.updatedAt;
  delete appointmentObject.__v;

  return appointmentObject as Appointment;
};

const Appointment = model<Appointment>("appointment", appointmentSchema);

export default Appointment;
