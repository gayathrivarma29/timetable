import mongoose from 'mongoose';

const roomSchema=new mongoose.Schema({
    name:String
});

const Room=mongoose.model('Room',roomSchema);

export default Room;


// import mongoose from 'mongoose';

// const roomSchema = new mongoose.Schema({
//   name: { type: String, required: true }
// });

// export default mongoose.model('Room', roomSchema);
