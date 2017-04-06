import mongoose from 'mongoose';



//create Schema

const imageSchema = new Schema ({
    originalname: {
      type:String,
      required:true
    },
    encoding: {
      type:String,
      required:true
    },
    filename: {
      type:String,
      required:true
    },
    destination: {
      type:String,
      required:true
    },
    path: {
      type:String,
      required:true
    },
    size: {
      type:Number,
      required:true
    }
})



export default mongoose.model('image', imageSchema);