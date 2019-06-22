// choose to use dummy data or other source
var USE_DUMMY_DATA = false

const graphql = require('graphql')
const _ = require('lodash')
const Book = require('../models/Book')
const Author = require('../models/Author')
const { books, authors } = require('./dummydata')

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema, 
    GraphQLID, 
    GraphQLInt, 
    GraphQLList,
    GraphQLNonNull,
 } = graphql

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () =>({
        id: { type: GraphQLID},
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author:{
            type: AuthorType,
            resolve(parent, args){

                // Code to get data from db / other source
                return USE_DUMMY_DATA 
                        ? _.find(authors, {id : parent.authorId}) 
                        : Author.findById(parent.authorId)

            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID},
        name: { type: GraphQLString },
        age: { type: GraphQLInt  },
        books:{
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // Code to get data from db / other source
                return USE_DUMMY_DATA 
                ? _.filter(books, {authorId: parent.id})
                : Book.find({authorId: parent.id})
            }
        }
    })
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args){
                // Code to get data from db / other source
                return USE_DUMMY_DATA 
                ? _.find(books, {id: args.id})
                : Book.findById(args.id)
            }
        },
        books:{
            type: new GraphQLList(BookType),
            resolve(){
                // return books
                return USE_DUMMY_DATA 
                ? books
                : Book.find({})

            }
        },
        author:{
            type: AuthorType,
            args:{id:{type: GraphQLID}},
            resolve(parent, args){
                //Code to get data from db / other source
                return USE_DUMMY_DATA 
                ? _.find(authors, {id: args.id})
                : Author.findById(args.id)
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(){
                // return authors
                return USE_DUMMY_DATA 
                ? authors
                : Author.find({})
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addAuthor:{
            type: AuthorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                })
                return author.save()
            }
        },
        addBook:{
            type: BookType,
            args:{
                name: { type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId,
                })
                return book.save()
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})