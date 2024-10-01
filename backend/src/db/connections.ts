import { connect } from "mongoose";
import { disconnect } from "process";
export default async function connectToDatabase() {
  try {
    await connect(process.env.MONGODB_URL);
  } catch (error) {
    console.log(error);
    throw new Error("Cannot connect to MongoDB");
  }
}

async function disconnectFromDatabase() {
  try {
    disconnect();
  } catch (error) {
    console.log(error);
    throw new Error("Cannot connect to MongoDB");
  }
}

export { connectToDatabase, disconnectFromDatabase };
