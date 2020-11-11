<template>
  <div>

    <b-form-select v-model="selectedCategory" :options="Array.from(categories)">
      <template #first>
        <b-form-select-option :value="null" disabled>Filter by category</b-form-select-option>
      </template>
    </b-form-select>
    

    <b-table
      ref="selectableTable"
      selectable
      :items="filteredItems"
      :fields="fields"
      responsive="sm"
    />
  </div>
</template>

<script>
import axios from "axios";
import * as Realm from "realm-web";

export default {
  data() {
    return {
      modes: ["multi", "single", "range"],
      fields: [
        {
          key: "name",
          sortable: true
        },
        {
          key: "dnPoints",
          sortable: true
        },
        {
          key: "apertifPoints",
          sortable: true
        },
        {
          key: "price",
          sortable: true
        },
        {
          key: "category",
          sortable: true
        },
        

      ],
      selectMode: "multi",
      selected: [],
      app: null,
      collection: null,
      categories: new Set(),
      selectedCategory: null,
      subCategories: new Set(),
      items: [],
    };
  },
  computed: {
    filteredItems() {
      let filteredArray = [];
      if(!this.selectedCategory){
        return this.items;
      }

      this.items.forEach(element => {
        if(element.category == this.selectedCategory){
          filteredArray.push(element);
        }
      });
      return filteredArray;
    }
  },
  async created() {
    const id = "minvino-aiide";
    const config = {
      id,
    };
    const app = new Realm.App(config);
    const credentials = Realm.Credentials.anonymous();
     await app.logIn(credentials);

    await app.currentUser.refreshCustomData();
    let conf = {
      headers: {
        'Authorization': `Bearer ${app.currentUser.accessToken}`
      }
    }

    let data = {
      query: `
        {
          wineData(query: {
            dnPoints_gt: "90",
            vinmonopoletData: {
              buyable: true,
              price: {
                value_lt: 1000
              }
            }}
            limit:10000
            ) {
            vinmonopoletData {
              name,
              price {
                value
              },
              main_category {
                name
              },
              main_sub_category {
                name
              }
            }
            dnPoints
            apertifPoints
            dnTasteNote
            apertifTasteNote
          }
        }`,
    };

    axios
      .post(
        "https://realm.mongodb.com/api/client/v2.0/app/minvino-aiide/graphql",
        data, conf
      )
      .then( (response) => {
        let tmp = response.data.data.wineData;
        tmp.forEach((element) => {
          this.categories.add(element.vinmonopoletData.main_category.name);
          element.category = element.vinmonopoletData.main_category.name;
          element.price = element.vinmonopoletData.price.value;
          element.name = element.vinmonopoletData.name;
          delete element.vinmonopoletData;
        });
        console.log(response.data.data.wineData.length);
        this.items = response.data.data.wineData;
      })
      .catch(function(error) {
        console.log(error);
      });
  },
};
</script>
