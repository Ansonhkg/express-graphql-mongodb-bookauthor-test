const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express();
app.use(cors())

// Connect to mongodb
// make sure to replace my db string & credential with your own
mongoose.connect('mongodb://admin:admin@localhost:27017/graphql', {useNewUrlParser: true});
mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB.")
})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

const PORT = process.env.port || 4000

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});