const mongoose = require('mongoose');


var schoolSchema = new mongoose.Schema({
    schoolname: {
        type: String,
        required: 'Full name can\'t be empty',
        unique:true
    }
});

mongoose.model('School', schoolSchema);