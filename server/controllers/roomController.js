import Hotel from "../models/Hotel.js";
import {v2 as cloudinary} from "cloudinary";
import Room from "../models/Room.js";
export const  createRoom = async(req,res)=>{
   try {
    const{roomType,pricePerNight,amenities} = req.body;
    const hotel = await Hotel.findOne({owner: req.auth().userId})
    if(!hotel) 
        return res.json({success: false , message : "No Hotel found"})

    const uploadImages = req.files.map(async(file)=>{
        const response = await cloudinary.uploader.upload(file.path)
        return response.secure_url;
    })
    const images = await Promise.all(uploadImages)

    await Room.create({
        hotel: hotel._id,
        roomType,
        pricePerNight: +pricePerNight,
        amenities: JSON.parse(amenities),
        images
    })
    res.json({success:true,message:"Room created successfully!"})
   } catch (error) {
    res.json({success:false , message: error.message})
   }
}

export const getRooms = async(req,res) =>{
  try {
    const rooms = await Room.find({isAvailable:true}).populate({
      path: "hotel",
      populate:{
        path: "owner",
        select: "image"
      }
    }).sort({createdAt: -1})
    res.json({success:true, rooms})
  } catch (error) {
        res.json({success:false, message: error.message })

  }
}

export const getOwnerRooms = async(req,res) =>{
    try {
      const hotelData = await Hotel.findOne({owner: req.auth().userId})
      const rooms = await Room.find({hotel: hotelData._id.toString()}).populate("hotel")
      res.json({success:true ,rooms})
    } catch (error) {
          res.json({success:false, message:error.message})

    }
}

export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    const roomData = await Room.findById(roomId);

    if (!roomData) {
      return res.json({ success: false, message: "Room not found" });
    }

    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save(); 

    res.json({ success: true, message: "Room Availability Updated!", room: roomData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};