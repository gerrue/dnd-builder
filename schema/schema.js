const SpellType = require('../types/spellType');
// const ClassType = require('./types/classType');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
} = require('graphql');

const BASE_URL = 'http://dnd5eapi.co/api'

const axiosDefaultConfig = {
    baseURL: BASE_URL,
    proxy: 'http://pitc-zscaler-americas-cincinnati3pr.proxy.corporate.ge.com:80/',
}

const axios = require('axios').create(axiosDefaultConfig);


async function getSpellByIndex(index) {
  const response = await axios.get(`${BASE_URL}/spells/${index}`);
  return response.data;
}

// async function getClassByIndex(index) {
//   const response = await axios.get(`${BASE_URL}/classes/${index}`);
//   return response.data;
// }

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',

  fields: () => ({
    spell: {
      type: SpellType,
      args: {
        index: {
          type: GraphQLInt
        }
      },
      resolve: (root, args) => {
        return getSpellByIndex(args.index);
      }
    },
    spells: {
      type: new GraphQLList(SpellType),
      resolve: async () => {
        const { data: { results } } = await axios.get(`${BASE_URL}/spells`);
        const dataToSend = results.map(async (spell) => {
          const { data } = await axios.get(spell.url);
          return data;
        })
        return dataToSend;
      }
    },
    // class: {
    //   type: ClassType,
    //   args: {
    //     index: {
    //       type: GraphQLInt
    //     }
    //   },
    //   resolve: (root, args) => {
    //     return getClassByIndex(args.index);
    //   }
    // },
    // classes: {
    //   type: new GraphQLList(ClassType),
    //   resolve: async () => {
    //     const { data: { results } } = await axios.get(`${BASE_URL}/classes`)
    //     const dataToSend = results.map(async (item) => {
    //       const { data } = await axios.get(item.url);
    //       return data;
    //     })
    //     return dataToSend;
    //   }
    // }
  })
})

module.exports = new GraphQLSchema({
  query: QueryType,
})