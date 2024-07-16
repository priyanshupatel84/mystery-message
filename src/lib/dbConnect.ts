import mongoose from "mongoose"

type ConnectionObject = {
  isConnected?: Number
}

const connection: ConnectionObject = {}

async function dbConnect() : Promise <void> {
  if(connection.isConnected){
    console.log("db already connectd");
    return;
  }
  const dbName = "mysteryMessage"
  
  try {
    const db = await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}` || "", {})

    connection.isConnected = db.connections[0].readyState
    console.log("db connected successfully");

  } catch (error) {
    console.log("database connection failed " , error);
    process.exit(1) // since connection nahi hua toh exit app will not work
  }
}

export default dbConnect