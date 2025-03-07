import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Username: {
        type:String,
        required:true
    },
    Password: {
        type:String,
        required:true
    },
    Phone: {
        type:String,
        required:true
    },
    Email: {
        type:String,
        required:true
    }
},
{
    collection: 'Accounts' // Explicitly specify the collection name
}
);

export const Accounts = mongoose.model('Accounts', AccountSchema);

