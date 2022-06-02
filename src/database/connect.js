import mongoose from "mongoose";

const connectToDatabase = async () => {
  await mongoose.connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@tasklistdatabase.3godd.mongodb.net/TaskListDatabase?retryWrites=true&w=majority`,
    (error) => {
      if (error) {
        return console.log(`Erro: ${error}`);
      }

      return console.log("Conexão ao banco de dados realizada com sucesso!");
    }
  );
};

export default connectToDatabase;
