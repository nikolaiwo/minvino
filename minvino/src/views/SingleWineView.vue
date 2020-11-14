<template>
  <b-container>
    <div v-if="!fetchingWineData">
      <h1>{{ wineData.vinmonopoletData.name }}</h1>
      <b-row>
        <b-col>
          <dl class="row">
            <dt class="col-sm-3">DN</dt>
            <dd class="col-sm-9">
              <b>{{ wineData.dnPoints }} Poeng </b><br />
              {{ wineData.dnTasteNote }}
            </dd>

            <dt class="col-sm-3">Apertif</dt>
            <dd class="col-sm-9">
              <div v-if="wineData.apertifPoints != ''">
                <b>{{ wineData.apertifPoints }} Poeng</b> <br />
                {{ wineData.apertifTasteNote }}
              </div>
              <div v-else>Ingen rating funnet</div>
            </dd>
          </dl>
        </b-col>
        <b-col>
            <b-img thumbnail fluid :src=" wineData.vinmonopoletData.images[0].url" alt="Image 1" :height="400"></b-img>
        </b-col>
      </b-row>
    </div>

    <b-spinner v-else />
  </b-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SingleWineView",
  props: {
    articleNumber: String,
  },
  computed: {
    ...mapState({
      wineData: (state) => state.db.wineData,
      fetchingWineData: (state) => state.db.fetchingWineData,
    }),
  },
  created() {
    this.$store.dispatch("db/fetchWineData", this.articleNumber);
  },
};
</script>
