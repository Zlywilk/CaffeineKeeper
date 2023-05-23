const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const qr = require('qrcode');
const path = require('path');
const { createCanvas} = require('canvas');
const multer = require('multer');
const forms = multer();
require('dotenv').config()
// Połączenie z bazą danych
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });

// Definicja modelu Tag
const tagSchema = new mongoose.Schema({
  name: String
});

const Tag = mongoose.model('Tag', tagSchema);

// Definicja modelu porcji
const portionSchema = new mongoose.Schema({
  weight: Number,
  packets: Number
});

const Portion = mongoose.model('Portion', portionSchema);

// Definicja modelu kawy
const coffeeSchema = new mongoose.Schema({
  name: String,
  roastDate: Date,
  storageDate: Date,
  roasteryLink: String,
  roastLevel: String,
  roastType: String,
  tastingNotes: [tagSchema],
  portions: [portionSchema]
});

const Coffee = mongoose.model('Coffee', coffeeSchema);

// Inicjalizacja serwera express
const app = express();
app.use(bodyParser.json());
app.use(forms.array()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Endpointy API
app.post('/coffee', async (req, res) => {
  const { name, roastDate, storageDate, roasteryLink, roastType, tastingNotes, roastLevel, portions } = req.body;
  const selectedRoasteryLink = roasteryLink || '';
  // Sprawdź, które pola są nieprawidłowe
  const missingFields = [];
  if (!name) {
    missingFields.push('name');
  }
  if (!roastDate) {
    missingFields.push('roastDate');
  }
  if (!storageDate) {
    missingFields.push('storageDate');
  }
  if (!tastingNotes) {
    missingFields.push('tastingNotes');
  }
  if (!roastLevel) {
    missingFields.push('roastLevel');
  }
  if (!roastType) {
    missingFields.push('roastType');
  }
  if (!portions) {
    missingFields.push('portions');
  }

  // Jeśli istnieją brakujące pola, zwróć odpowiedź z kodem błędu 400 i informacją o brakujących polach
  if (missingFields.length > 0) {
    return res.status(400).json({ error: 'Missing required fields', missingFields });
  }

  // Pozostała część kodu bez zmian

  const tags = [];
  for (const tagName of tastingNotes.split(',')) {
    let tag = await Tag.findOne({ name: tagName.trim() });
    if (!tag) {
      tag = new Tag({ name: tagName.trim() });
      await tag.save();
    }
    tags.push(tag);
  }

  // Convert portions from object to array
  const portionsArray = portions.map((portion) => {
    return {
      weight: portion.weight,
      packets: portion.packets,
    };
  });

  const newCoffee = new Coffee({
    name,
    roastDate,
    storageDate,
    roasteryLink:selectedRoasteryLink,
    tastingNotes: tags,
    roastLevel,
    roastType, 
    portions: portionsArray,
  });

  try {
    await newCoffee.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});



app.get('/', async (req, res) => {
    try {
      const coffees = await Coffee.find({});
      res.render('index', { coffees: coffees });
    } catch (err) {
      res.status(500).send(err);
    }
  });
  app.get('/coffee', async (req, res) => {
    try {
      const coffees = await Coffee.find({});
      res.json(coffees);
    } catch (err) {
      res.status(500).send(err);
    }
  });
  
  
  app.get('/coffee/:id', async (req, res) => {
    try {
      const coffee = await Coffee.findById(req.params.id);
      res.render('coffee', { coffee: coffee });
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.post('/coffee/update/:id', async (req, res) => {
    try {
      const { name, roastDate, storageDate, roasteryLink, roastType, tastingNotes, roastLevel, portions } = req.body;
      const coffee = await Coffee.findById(req.params.id);
  
      // Update fields. If the field is not in the request body, keep the existing value.
      coffee.name = name || coffee.name;
      coffee.roastDate = roastDate || coffee.roastDate;
      coffee.storageDate = storageDate || coffee.storageDate;
      coffee.roasteryLink = roasteryLink || coffee.roasteryLink;
      coffee.roastType = roastType || coffee.roastType;
      coffee.roastLevel = roastLevel || coffee.roastLevel;
  
      // Update tastingNotes if it exists in the request body, otherwise keep the existing value.
      if (tastingNotes) {
        const tags = [];
        for (const tagName of tastingNotes.split(',')) {
          let tag = await Tag.findOne({ name: tagName.trim() });
          if (!tag) {
            tag = new Tag({ name: tagName.trim() });
            await tag.save();
          }
          tags.push(tag);
        }
        coffee.tastingNotes = tags;
      }
  
      // Update portions if it exists in the request body, otherwise keep the existing value.
      if (portions) {
        coffee.portions = portions.map((portion) => {
          return {
            weight: portion.weight,
            packets: portion.packets,
          };
        });
        coffee.portions = coffee.portions.filter(portion => portion.weight && portion.packets);
      }
  
      // Save the updated coffee
      await coffee.save();
      res.redirect(`/coffee/${coffee._id}`);
    } catch (err) {
      console.log(err);
      res.status(500).send('An error occurred');
    }
  });
  app.get('/coffee/update/:id', async (req, res) => {
    try {
      const coffee = await Coffee.findById(req.params.id);
      res.render('update', { coffee: coffee });
    } catch (err) {
      res.status(500).send(err);
    }
  });
  
app.get('/add', (req, res) => {
  res.render('add');
});


async function createQrWithText(text, qrData) {
  const canvas = createCanvas(100, 100);
  const ctx = canvas.getContext('2d');

  // Generate QR code
  const qrSize = 200;
  const qrImage = await qr.toCanvas(canvas, qrData, { width: qrSize, margin: 4 });
  ctx.drawImage(qrImage, (canvas.width - qrSize) / 2, 5, qrSize, qrSize);

  // Render text
  ctx.font = '18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, canvas.width / 2, canvas.height - 180);

  return canvas;
}

app.get('/qr/:id', async (req, res) => {
  try {
    const coffee = await Coffee.findById(req.params.id);
    const url = '/coffee/' + req.params.id;

    const image = await createQrWithText(coffee.name, url);

    res.setHeader('Content-Type', 'image/png');
    res.send(image.toBuffer('image/png'));
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

app.get('/tastingNotes', async (req, res) => {
  try {
    const tastingNotes = await Tag.find({});
    res.json(tastingNotes);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});



app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

