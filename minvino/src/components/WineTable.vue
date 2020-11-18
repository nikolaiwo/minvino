<template>
  <div>
    <b-row>
      <b-col>
        <b-form-select
          :value="selectedCategory"
          :options="wineTableCategories"
          @change="setSelectedCategory"
        >
          <template #first>
            <b-form-select-option :value="null" disabled
              >Filtrer på kategori</b-form-select-option
            >
          </template>
        </b-form-select>
      </b-col>
      <b-col>
        <b-row class="my-1">
          <b-col sm="5">
            <label for="input-minimumPoints">Minimum poeng:</label>
          </b-col>
          <b-col sm="7">
            <b-form-input
              id="input-minimumPoints"
              v-model="minimumPoints"
              :state="Number.isInteger(parseInt(minimumPoints))"
              @change="fetchFilteredData"
            ></b-form-input>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-table
      ref="wineTable"
      responsive="sm"
      hover
      selectable
      select-mode="single"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :items="filteredWineTableData"
      :fields="fields"
      @row-clicked="rowClicked"
    >
      <template #cell(score)="row">
        {{ (row.value * 100).toFixed(1) }}
      </template>
      <template #cell(availableOnline)="row">
        <span v-if="row.value">&#9989;</span><span v-else>&#x274c;</span>
      </template>
      <template #cell(price)="row"> {{ row.value.toFixed(0) }},- </template>
      <template #cell(volume)="row"> {{ row.value * 100 }} cl </template>
      <template #row-details="row">
        <b-card>
          <SingleWineView :articleNumber="row.item.productId" />
        </b-card>
      </template>
    </b-table>
    <b-spinner v-if="fetchingData" label="Loading..."></b-spinner>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SingleWineView from "@/views/SingleWineView.vue";
export default {
  data() {
    return {
      fields: [
        {
          key: "name",
          sortable: true,
          label: "Navn",
        },
        {
          key: "dnPoints",
          sortable: true,
          label: "DN",
        },
        {
          key: "apertifPoints",
          sortable: true,
          label: "Aperitif",
        },
        {
          key: "price",
          sortable: true,
          label: "Pris",
        },
        {
          key: "category",
          sortable: true,
          label: "Kategori",
        },
        {
          key: "volume",
          label: "Volum",
        },
        {
          key: "score",
          sortable: true,
          label: "Score",
        },
        {
          key: "availableOnline",
          sortable: false,
          label: "Kan leveres",
        },
      ],
      selectMode: "multi",
      selected: [],
      app: null,
      collection: null,
      minimumPoints: 90,
      sortBy: "score",
      sortDesc: true,
      items: [],
      lastSelected: null,
      wineTableCategories: [
        "Sterkvin",
        "Rødvin",
        "Musserende vin",
        "Hvitvin",
        "Brennevin",
        "Øl",
        "Rosévin",
        "Sake",
        "Sider",
        "Perlende vin",
        "Fruktvin",
        "Mjød",
        "Alkoholfritt",
        "Aromatisert vin",
      ],
    };
  },
  components: {
    SingleWineView,
  },
  computed: {
    ...mapState({
      wineTableData: (state) => state.db.wineTableData,
      //   wineTableCategories: (state) => state.db.wineTableCategories,
      fetchingData: (state) => state.db.fetchingWineTableData,
      selectedCategory: (state) => state.db.selectedCategory,
    }),
    filteredWineTableData() {
      let filteredArray = [];
      if (!this.selectedCategory) {
        return this.wineTableData;
      }

      this.wineTableData.forEach((element) => {
        if (element.category == this.selectedCategory) {
          filteredArray.push(element);
        }
      });
      return filteredArray;
    },
  },
  methods: {
    viewSingleComponent(row) {
      console.log(row);
      this.$router.push({
        path: `/wine/${row.productId}`,
      });
    },
    fetchFilteredData() {
      let data = {
        minimumPoints: this.minimumPoints,
      };
      this.$store.dispatch("db/fetchBaseWineData", data);
    },
    setSelectedCategory(change) {
      this.$store.commit("db/setSelectedCategory", change);
      this.$store.dispatch("db/fetchBaseWineData", {
        minimumPoints: this.minimumPoints,
      });
    },
    rowClicked(item) {
      item._showDetails = true;
      console.log(item);
      console.log(this.lastSelected);
      if (this.item !== this.lastSelected) {
        item._showDetails = true;
      }
      if (this.lastSelected) {
        this.lastSelected._showDetails = false;
      }
      this.lastSelected = item;
    },
  },
  async mounted() {
    // this.$store.dispatch("db/fetchWineTableCategories");
    console.log(this.wineTableData);
    if (this.wineTableData.length == 0) {
      this.$store.dispatch("db/fetchBaseWineData", {
        minimumPoints: this.minimumPoints,
      });
    }
  },
};
</script>
