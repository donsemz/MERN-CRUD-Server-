const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const FriendModel = require("./models/Friends");
app.use(express.json());
app.use(cors());

//deployment configs
require("dotenv").config();


const PORT = 3001;
const PASSWORD = "";

//database connection
const mongo_url = `mongodb+srv://donnie:${PASSWORD}@cluster0.kklrhxy.mongodb.net/crudStore?retryWrites=true&w=majority`;

mongoose
  .connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("mongoDb is connected");
  })
  .catch((error) => {
    console.log("mongoDb not connected");
    console.log(error);
  });

//api routes

//api post route
app.post("/addFriend", async (req, res) => {
  const name = req.body.name;
  const age = req.body.age;
  const description = req.body.description;
  const friend = new FriendModel({
    name: name,
    age: age,
    description: description,
  });
  await friend.save();
  res.send(friend);
});

app.get("/", async (req, res) => {
  res.send("<h2>Welcome to Express/ MongoDB Server</h2>");
});

//api get route
app.get("/getFriends", async (req, res) => {
  FriendModel.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  }).clone().catch(function(err){ console.log(err)})
});


//api put route
app.put("/updateFriend", async (req, res) => {
  const id = req.body.id;
  const newAge = req.body.newAge;
  try {
    await FriendModel.findById(id,(error,friendToUpdate)=>{
      friendToUpdate.age = Number(newAge);
      friendToUpdate.save();
    }
    
    )
  } catch (err) {
    console.log(err);
  }
  res.send("Friend Saved");
});

//api delete route
app.delete("/deleteFriend/:id",async (req, res) => {
  const id = req.params.id;
  await FriendModel.findByIdAndRemove(id).exec();
  res.send("Item Delete SuccessFul")
})

app.listen(process.env.PORT || PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
