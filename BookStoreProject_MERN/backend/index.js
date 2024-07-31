import express from "express";
import {PORT,mongoDBURL} from './config.js';
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";
import booksRoute from "./routes/booksRoute.js";
import cors from "cors";

const app=express();
app.use(express.json());

app.use('/books',booksRoute);

app.use(cors());

mongoose
 .connect(mongoDBURL)
  .then(()=>{
        console.log('Mongodb baglantisi sağlandi')
        app.listen(PORT,()=>  {
            console.log(`sunucu portunda çalşıyor: ${PORT}`);
            });
  }) .catch((error)=>{
    console.log('error')
  }
)



app.post('/books', async (req, res) => {
    try {
      if (
        !req.body.title ||
        !req.body.author ||
        !req.body.publishYear
      ) {
        return res.status(400).send({
          message: 'Gerekli dosyalar gönderildi : title, author, publishYear',
        });
      }
  
      const newBook = {
        title: req.body.title,
        author: req.body.author,
        publishYear: req.body.publishYear,
      };
  
      const book = await Book.create(newBook);
      return res.status(201).send(book);
  
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ message: error.message });
    }
  });





  app.get('/books',async (req,res)=>{
  try{
    const books = await Book.find({});
    return res.status(200).json({
            count: books.length,
            data:books
    }
    );

  } catch(error){
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }

  }
)
  


app.get('/books/:id',async (req,res)=>{
    try{

        const{ id }=req.params;

      const book = await Book.findById(id);
      return res.status(200).json(book);
  
    } catch(error){
      console.log(error.message);
      res.status(500).send({ message: error.message });
    }
  
    }
  )
    


  app.put('/books/:id',async (req,res)=>{
    try{
        if (
            !req.body.title ||
            !req.body.author ||
            !req.body.publishYear
          ) {
            return res.status(400).send({
              message: 'Gerekli dosyalar gönderildi : title, author, publishYear',
            });
          }

          const{ id }=req.params;
          const result= await Book.findByIdAndUpdate(id,req.body);
          if(!result){
            return res.status(404).json({message : 'Book not found'});
          } else {
            return res.status(200).json({message : 'Book updated'});
          }

    }

    catch(error){
        console.log(error.message);
        res.status(500).send({ message: error.message });
      }
  });




  app.delete('/books/:id',async (req,res)=>{
try {
    const{ id }=req.params;
    const result= await Book.findByIdAndDelete(id);
    if(!result){
        return res.status(404).json({message : 'Book is not deleted'});
      } else {
        return res.status(200).json({message : 'Book is deleted'});
      }
}

    catch(error){
        console.log(error.message);
        res.status(500).send({ message: error.message });
      }
  });


