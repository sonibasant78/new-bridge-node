const mongoose = require('mongoose');

var gradeSchema = new mongoose.Schema({
    grade: {
        type: String,
        required: 'grade can\'t be empty',
        unique:true
    }
});

mongoose.model('Grade', gradeSchema);