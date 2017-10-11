var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var UserSchema = new mongoose.Schema({
  username: {
      type: String,
      required: true
  },
  fullName: {
      type: String,
      required: true
  },
  addresses: [{
    street: String,
    city: String,
    likes: {type: Number, default: 0},
    state: {
      type: String,
      enum: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT']
    },
    zip: Number
  }]
});
 
var User = mongoose.model('User', UserSchema);

mongoose.connect(
    process.env.DATABASE_URL, 
    {useMongoClient: true}
  ).then(() => {
    mongoose.connection.db.dropDatabase()
  })
  
  
  // ***************************** 
  // Create a new User
  // *****************************   
  .then(() => {

    return User.create({ 
      _id: 'aaaaaaaaaaaaaaaaaaaaaaaa', 
      username: 'aalabaster', fullName : 'Alice Alabaster',
      addresses: [
        {street: '123 Main St.',city: 'Springfield',state: 'CO',zip: 12345}
      ]}
    );  
  
  }).then(results => {
    console.log('create new item: \n', results);
  })


  // ***************************** 
  // $push a new item onto an array
  // using .findByIdAndUpdate()
  // ***************************** 
  .then(() => {
      return User
      .findByIdAndUpdate(
        'aaaaaaaaaaaaaaaaaaaaaaaa',
        { "$push": {
            "addresses":  {street: '789 Cactus St.', city: 'Scottsdale', state: 'AZ', zip: 56789} 
          } 
        }, 
        {new: true} 
      );
        
  }).then(results => {
    console.log('$push results: \n', results); 
  })



  // ***************************** 
  // Update a single item in the array using the $ placeholder
  // using findOneAndUpdate()
  // ***************************** 
  .then(() => {
    return User
      .findOneAndUpdate(
        { username: 'aalabaster', 'addresses.state': 'AZ' }, 
        { 'addresses.$.city': "Phoenix" },
        {new: true}
      );
  }).then(results => {
    console.log('update', results); 
  })
  


  // ***************************** 
  // $inc a property in an array
  // findOneAndUpdate()
  // *****************************   
  .then(() => {
    return User
      .findOneAndUpdate(
        { username: 'aalabaster', 'addresses.state': 'AZ' }, 
        { $inc: { 'addresses.$.likes': 1 } },
        {new: true}
      );
  }).then(results => {
    console.log('update', results); 
  })


  // ***************************** 
  // $pull (remove) an item from an Array
  // findOneAndUpdate()
  // *****************************   
  .then(() => {
    return User
      .findByIdAndUpdate(
        'aaaaaaaaaaaaaaaaaaaaaaaa',
        { "$pull": { "addresses": { "city": 'Springfield'} } },
        {new: true}
      );
  }).then(results => {
    console.log('remove', results); 
  });
  