<template>
  <b-container>
    <div v-if="!fetchingWineData">
      <h1>{{ wineData.vinmonopoletData.name }}</h1>
      <b-row>
        <b-col sm="10">
          <dl class="row">
            <dt class="col-sm-3">DN</dt>
            <dd class="col-sm-9">
              <div v-if="wineData.dnPoints != ''">
                <b>{{ wineData.dnPoints }} Poeng</b> <br />
                {{ wineData.dnTasteNote }}
              </div>
              <div v-else>Ingen rating funnet</div>
            </dd>

            <dt class="col-sm-3">Apertif</dt>
            <dd class="col-sm-9">
              <div v-if="wineData.apertifPoints != ''">
                <b>{{ wineData.apertifPoints }} Poeng</b> <br />
                {{ wineData.apertifTasteNote }}
              </div>
              <div v-else>Ingen rating funnet</div>
            </dd>
            <dt class="col-sm-3">Link til Vinmonopolet</dt>
            <dd class="col-sm-9">
              <a
                :href="
                  'https://www.vinmonopolet.no/' + wineData.vinmonopoletData.url
                "
              >
                {{ wineData.vinmonopoletData.name }}
              </a>
            </dd>
            <dt class="col-sm-3">Pris</dt>
            <dd class="col-sm-9">{{ wineData.vinmonopoletData.price.value.toFixed(2) }} kr</dd>
            <dt class="col-sm-3">Kategori</dt>
            <dd class="col-sm-9">{{ wineData.vinmonopoletData.main_category.name }}</dd>
            <dt class="col-sm-3">Volum</dt>
            <dd class="col-sm-9">{{ wineData.vinmonopoletData.volume.value*100 }} cl</dd>
            <dt class="col-sm-3">Land, område</dt>
            <dd class="col-sm-9">
              {{ wineData.vinmonopoletData.main_country.name }}
              <span v-if="wineData.vinmonopoletData.district != null && wineData.vinmonopoletData.district.name != 'Øvrige' && wineData.vinmonopoletData.district.name != '-'">, {{ wineData.vinmonopoletData.district.name }}</span>
              <span v-if="wineData.vinmonopoletData.sub_District != null && wineData.vinmonopoletData.sub_District.name != 'Øvrige' && wineData.vinmonopoletData.sub_District.name != '-'">, {{ wineData.vinmonopoletData.sub_District.name }}</span>
            </dd>
            <dt class="col-sm-3">Kan leveres</dt>
            <dd class="col-sm-9">
              <div v-if="wineData.vinmonopoletData.availability.deliveryAvailability.available">&#9989;</div>
              <div v-else>&#x274c;</div>
            </dd>
            <dt class="col-sm-3">I butikk</dt>
            <dd class="col-sm-9">
              <div v-if="wineData.vinmonopoletData.availability.storeAvailability.available">&#9989;</div>
              <div v-else>&#x274c;</div>
            </dd>
          </dl>
        </b-col>
        <b-col sm="2">
          <b-img
            thumbnail
            fluid
            :src="wineData.vinmonopoletData.images[0].url"
            alt="Image 1"
          ></b-img>
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
    articleNumber: String
  },
  computed: {
    ...mapState({
      wineData: state => state.db.wineData,
      fetchingWineData: state => state.db.fetchingWineData
    })
  },
  created() {
    this.$store.dispatch("db/fetchWineData", this.articleNumber);
  }
};
</script>

<style scoped>
    dt {
        text-align: right;
    }
    dd {
        text-align: left;
    }
</style>