import express from "express";
import mongoose from "mongoose";
import BodyParser from "body-parser";
import cors from "cors";

//import router from the employee
import employee from "./routes/employee";

const app = express();
const port = 5000;

//setup mongoose connnection
let mongoDB =
  "mongodb://daniel:su15859711084@ds139243.mlab.com:39243/employee-management-system";
mongoose.connect(
  mongoDB,
  { useNewUrlParser: true }
);

//app.use() 都是middleware， 前端发过来的所以请求都先发到这个middleware，如果没有就直接先发到controller里的“/_id:"
//cors 用来解决跨域问题，前后端接口不一样，用了cors，才能把前后端接口连接
app.use(cors());
////bodyParser is middlleware, 前端发过来的东西，不是json形式，但后端只能处理json，所以用着可以可以把前端发来的请求转出json
app.use(BodyParser.json());
//urlencoded
app.use(BodyParser.urlencoded({ extended: true }));
//设置express的静态文件在public文件夹下
app.use(express.static("public"));
//必须添加api来连接 employee router
app.use("/api", employee);

app.listen(port, () => {
  console.log("Port start on 5000!");
});
