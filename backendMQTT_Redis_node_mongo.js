const mqtt = require('mqtt');
const express = require('express');
const redis = require('redis');
const mongoose = require('mongoose');

// Initialize MQTT client
const mqttClient = mqtt.connect('mqtt://localhost');
mqttClient.on('connect', () => {
  console.log('MQTT client connected');
  mqttClient.subscribe('/add', (err) => {
    if (!err) {
      console.log('Subscribed to /add topic');
    }
  });
});

// Initialize Redis client
const redisClient = redis.createClient();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todoList', { useNewUrlParser: true, useUnifiedTopology: true });
const TodoItem = mongoose.model('TodoItem', { content: String });

// MQTT message handler
mqttClient.on('message', (topic, message) => {
  if (topic === '/add') {
    const newItem = message.toString(); // Assuming message is a string
    redisClient.rpush('FULLSTACK_TASK', newItem, (err, reply) => {
      if (err) {
        console.error('Error adding item to Redis:', err);
      } else {
        console.log('New item added to Redis:', newItem);
        checkRedisCountAndMoveToMongo();
      }
    });
  }
});

// Function to check Redis count and move items to MongoDB if count exceeds 50
function checkRedisCountAndMoveToMongo() {
  redisClient.llen('FULLSTACK_TASK', (err, count) => {
    if (err) {
      console.error('Error checking Redis count:', err);
    } else {
      if (count > 50) {
        redisClient.lrange('FULLSTACK_TASK', 0, -1, (err, items) => {
          if (err) {
            console.error('Error retrieving items from Redis:', err);
          } else {
            items.forEach(item => {
              const todoItem = new TodoItem({ content: item });
              todoItem.save((err) => {
                if (err) {
                  console.error('Error saving item to MongoDB:', err);
                } else {
                  console.log('Item moved to MongoDB:', item);
                }
              });
            });
            redisClient.del('FULLSTACK_TASK'); // Clear Redis after moving items
          }
        });
      }
    }
  });
}

// Initialize Express server
const app = express();
const PORT = 3000;

app.use(express.json());

// Route to add new todo item via HTTP
app.post('/add', (req, res) => {
  const newItem = req.body.content;
  redisClient.rpush('FULLSTACK_TASK', newItem, (err, reply) => {
    if (err) {
      console.error('Error adding item to Redis:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('New item added to Redis:', newItem);
      checkRedisCountAndMoveToMongo();
      res.status(200).send('Item added successfully');
    }
  });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
