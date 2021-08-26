import mongoose from 'mongoose';

export async function connect() {
  mongoose.set('useFindAndModify', false);
  await mongoose
    .connect('mongodb://IGSVentaDigital:Poma8277@192.168.23.11:27017/IGS', {
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
