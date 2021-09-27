import mongoose from 'mongoose';

export async function connect() {
  mongoose.set('useFindAndModify', false);
  await mongoose
    .connect(process.env.MONGODB_URI, {
      authSource: 'admin',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((response) => {
      console.log('>>> DB is connect');
    })
    .catch((error) => {
      console.log('Something goes wrong');
      console.log(error);
    });
}
