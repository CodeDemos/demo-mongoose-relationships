var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var BookSchema = new mongoose.Schema({
  title: String,
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: String
  }]
});

var Book = mongoose.model('Book', BookSchema);

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
    state: {
      type: String,
      enum: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT']
    },
    zip: Number
  }]
});

var User = mongoose.model('User', UserSchema);

mongoose.connect('mongodb://localhost:27017/demo-books', { useMongoClient: true }
).then(() => {
  return mongoose.connection.db.dropDatabase();
}).then(() => {

  var bookPromise = Book.create({
    title: 'Hitch Hikers Guide to the Galaxy',
    reviews: [
      { user: 'aaaaaaaaaaaaaaaaaaaaaaaa', comments: 'And... Lorem ipsum dolor sit amet, consectetur adipiscing.' },
      { user: 'bbbbbbbbbbbbbbbbbbbbbbbb', comments: 'But... Sed ut perspiciatis unde omnis iste natus error.' },
      { user: 'cccccccccccccccccccccccc', comments: 'Can... At vero eos et accusamus et iusto odio dignissimos' }
    ]
  });

  var userPromise = User.create([
    { _id: 'aaaaaaaaaaaaaaaaaaaaaaaa', username: 'aalabaster', fullName: 'Alice Alabaster', 
      addresses: [
        { street: '123 Main St.', city: 'Springfield', state: 'CO', zip: 12345 }, 
        { street: '789 Cactus St.', city: 'Scottsdale', state: 'AZ', zip: 56789 }
      ] },
    { _id: 'bbbbbbbbbbbbbbbbbbbbbbbb', username: 'bbaker', fullName: 'Bob Baker', addresses: [{ street: '123 Front St.', city: 'Downtown', state: 'CA', zip: 12345 }] },
    { _id: 'cccccccccccccccccccccccc', username: 'cconway', fullName: 'Chuck Conway' }
  ]);


  return Promise.all([userPromise, bookPromise]);


}).then(results => {

  console.log('new', results);

})
  .then(() => {
    return Book.find()
      // .populate('reviews.user', '-addresses -__v');
      .populate({ path: 'reviews.user', select: 'fullName username' });

  })
  .then(results => {
    console.log('======', JSON.stringify(results, null, 4));

    return mongoose.disconnect();
  })
  .catch((err) => {
    console.error(err);
    return mongoose.disconnect();
  });



