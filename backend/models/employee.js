//第一步，在models里写schema

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  name: { type: String, required: true },
  title: { type: String, default: null },
  avatar_url: { type: String, default: null },
  sex: { type: String, default: null },
  startDate: { type: Date, default: Date.now },
  email: { type: String, default: null },
  officePhone: { type: String, default: null },
  cellPhone: { type: String, default: null },
  SMS: { type: String, default: null },
  manager: { type: String, default: null },
  directReporters: { type: [String], default: [] }
});

export default mongoose.model("Employee", EmployeeSchema);
