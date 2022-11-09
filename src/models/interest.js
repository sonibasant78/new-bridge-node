const mongoose = require('mongoose');

var interestSchema = new mongoose.Schema({
    interest: {
        type: String,
        required: 'Full name can\'t be empty',
        unique:true
    }
});

mongoose.model('Interest', interestSchema);