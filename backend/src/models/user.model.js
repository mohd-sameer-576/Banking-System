const mongoos = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoos.Schema({
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:[true,'Email must be unique'],
        trim:true,
        lowercase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Please fill a valid email address']
    },
    name:{
        type:String,
        required:[true,'Name is required'],
        trim:true,
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minlength:[6,'Password must be at least 6 characters long'],
        select:false
    },
    
},{timestamps:true})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    const hash = await bcryot.hash(this.password,10);
    this.password = hash;
    next();
})
userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
}

const User = mongoos.model('User', userSchema);

module.exports = User;