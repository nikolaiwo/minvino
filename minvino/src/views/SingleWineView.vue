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
          <b-carousel
            id="carousel-1"
            v-model="slide"
            :interval="0"
            controls
            indicators
            img-height="480"
            img-width="1024"
            background="#ababab"
            style="text-shadow: 1px 1px 2px #333;"
            @sliding-start="onSlideStart"
            @sliding-end="onSlideEnd"
          >
            <template v-for="img in wineData.vinmonopoletData.images" >
                <b-carousel-slide :img-src="img.url" :key="img.url"/>
            </template>
            <!-- Text slides with image -->
          </b-carousel>
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

<style>
    .carousel-item img {
          display: block;
        max-height:500px;
        width: auto;
        height: auto;
    }
</style>