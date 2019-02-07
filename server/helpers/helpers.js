const _ = require('lodash');

const bodyPick = (req, cols = ['email', 'password']) =>{
          const pickedBody = _.pick(req.body, cols);  
    return pickedBody;
}

module.exports = {
    bodyPick
}