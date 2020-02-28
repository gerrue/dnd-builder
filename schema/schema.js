const graphql = require('graphql');
const Book = require('../models/book');
const Author = require('../models/Author');
const Spell = require('../models/spell');

const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt,GraphQLSchema, 
    GraphQLList,GraphQLNonNull 
} = graphql;

//Schema defines data on the Graph like object types(book type), relation between 
//these object types and describes how it can reach into the graph to interact with 
//the data to retrieve or mutate the data   

const SpellType = new GraphQLObjectType({
    name: 'Spell',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        higherLevel: { type: GraphQLString },
        components: { type: GraphQLString },
        description: { type: GraphQLString },
        duration: { type: GraphQLString },
        level: { type: GraphQLString },
        range: { type: GraphQLString },
        page: { type: GraphQLString },
        material: { type: GraphQLString },
        ritual: { type: GraphQLString },
        concentration: { type: GraphQLString },
        castingTime: { type: GraphQLString },
        school: { type: GraphQLString },
        class: { type: GraphQLString },
        archetype: { type: GraphQLString },
        domains: { type: GraphQLString },
        patrons: { type: GraphQLString },
        oaths: { type: GraphQLString }
    })
})

const BookType = new GraphQLObjectType({
    name: 'Book',
    //We are wrapping fields in the function as we dont want to execute this ultil 
    //everything is inilized. For example below code will throw error AuthorType not 
    //found if not wrapped in a function
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString }, 
        pages: { type: GraphQLInt },
        author: {
        type: AuthorType,
        resolve(parent, args) {
            return Author.findById(parent.authorID);
        }
    }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        book:{
            type: new GraphQLList(BookType),
            resolve(parent,args){
                return Book.find({ authorID: parent.id });
            }
        }
    })
})

//RootQuery describe how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular 
//book or get a particular author.
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        spell: {
            type: SpellType,
            args: {
                id: { type: GraphQLID },
            },
            resolve(parent, args) {
                if (args.id) {
                    return Spell.findById(args.id);
                }
            }
        },
        spells:{
            type: new GraphQLList(SpellType),
            args: {
                name: { type: GraphQLString }
            },
            resolve(parent, args) {
                if (args.name) {
                    console.log(args.name);
                    return Spell.find({name:{'$regex': `${args.name}`}});
                }
                return Spell.find({});
            }
        },
        book: {
            type: BookType,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //Here we define how to get data from database source

                //this will return the book with id passed in argument 
                //by the user
                return Book.findById(args.id);
            }
        },
        books:{
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({});
            }
        },
        author:{
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Author.findById(args.id);
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find({});
            }
        }
    }
});

//Very similar to RootQuery helps user to add/update to the database.
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addSpell: {
            type: SpellType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                higherLevel: { type: new GraphQLNonNull(GraphQLString) },
                page: { type: new GraphQLNonNull(GraphQLString) },
                range: { type: new GraphQLNonNull(GraphQLString) },
                components: { type: new GraphQLNonNull(GraphQLString) },
                material: { type: new GraphQLNonNull(GraphQLString) },
                ritual: { type: new GraphQLNonNull(GraphQLString) },
                duration: { type: new GraphQLNonNull(GraphQLString) },
                concentration: { type: new GraphQLNonNull(GraphQLString) },
                castingTime: { type: new GraphQLNonNull(GraphQLString) },
                level: { type: new GraphQLNonNull(GraphQLString) },
                school: { type: new GraphQLNonNull(GraphQLString) },
                class: { type: new GraphQLNonNull(GraphQLString) },
                archetype: { type: new GraphQLNonNull(GraphQLString) },
                domains: { type: new GraphQLNonNull(GraphQLString) },
                patrons: { type: new GraphQLNonNull(GraphQLString) },
                oaths: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                let spell = new Spell({
                    name: args.name,
                    description: args.description,
                    higherLevel: args.higherLevel,
                    page: args.page,
                    range: args.range,
                    components: args.components,
                    material: args.material,
                    ritual: args.ritual,
                    duration: args.duration,
                    concentration: args.concentration,
                    castingTime: args.castingTime,
                    level: args.level,
                    school: args.school,
                    class: args.class,
                    archetype: args.archetype,
                    domains: args.domains,
                    patrons: args.patrons,
                    oaths: args.oaths
                });
                return spell.save();
            }
        },
        addAuthor: {
            type: AuthorType,
            args: {
                //GraphQLNonNull make these field required
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook:{
            type:BookType,
            args:{
                name: { type: new GraphQLNonNull(GraphQLString)},
                pages: { type: new GraphQLNonNull(GraphQLInt)},
                authorID: { type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                let book = new Book({
                    name:args.name,
                    pages:args.pages,
                    authorID:args.authorID
                })
                return book.save()
            }
        }
    }
});

//Creating a new GraphQL Schema, with options query which defines query 
//we will allow users to use when they are making request.
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});