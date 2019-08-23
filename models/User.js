const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;
const userSchema = new Schema({
    email: String,
    password: String
})
userSchema.pre('save', async function (next) {
    try {
        // const hashedPassword = 
            this.password = await bcrypt.hash(this.password, 10);
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = mongoose.model('users', userSchema);