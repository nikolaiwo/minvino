<template>
  <div>
    <b-form-select
      v-model="selectedCategory"
      :options="Array.from(wineTableCategories)"
    >
      <template #first>
        <b-form-select-option :value="null" disabled
          >Filter by category</b-form-select-option
        >
      </template>
    </b-form-select>
    <b-table
      ref="wineTable"
      responsive="sm"
      selectable
      :items="filteredWineTableData"
      :fields="fields"
      @row-clicked="viewSingleComponent" 
    />
    <b-spinner v-if="fetchingData" label="Loading..."></b-spinner>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      modes: ["multi", "single", "range"],
      fields: [
        {
          key: "name",
          sortable: true,
        },
        {
          key: "dnPoints",
          sortable: true,
        },
        {
          key: "apertifPoints",
          sortable: true,
        },
        {
          key: "price",
          sortable: true,
        },
        {
          key: "category",
          sortable: true,
        },
        {
            key: "volume"
        },
        {
          key: "score",
          sortable: true,
        },
      ],
      selectMode: "multi",
      selected: [],
      app: null,
      collection: null,
      selectedCategory: null,
      items: [],
    };
  },
  computed: {
    ...mapState({
      wineTableData: (state) => state.db.wineTableData,
      wineTableCategories: (state) => state.db.wineTableCategories,
      fetchingData: (state) => state.db.fetchingWineTableData
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
  methods:{
      viewSingleComponent(row) {
          console.log(row);
        this.$router
        .push({
            path: `/wine/${row.productId}`
        });
      }
  },
  async created() {
    this.$store.dispatch("db/fetchBaseWineData")
  },
};
</script>
