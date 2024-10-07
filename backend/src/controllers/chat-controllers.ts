import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { configureGeminiAI } from "../config/gemini-config.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { message } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });

    // Grab chats of user
    const chats = user.chats;
    chats.push({ content: message, role: "user" });

    // Configure and use Gemini AI
    const genAI = configureGeminiAI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Start a chat session
    const chat = model.startChat({
      history: chats.map(({ role, content }) => ({
        role: role === "user" ? "user" : "model",
        parts: [{ text: content }],
      })),
    });

    // Get the latest response
    const result = await chat.sendMessage(message);
    const response = result.response;

    // Save the response
    const aiResponse = response.text();
    chats.push({ content: aiResponse, role: "model" });
    user.chats = chats;
    await user.save();

    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    console.log(user._id.toString(), res.locals.jwtData.id);
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }

    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    console.log(user._id.toString(), res.locals.jwtData.id);
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    //@ts-ignore
    user.chats = [];
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};
