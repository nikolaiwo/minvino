//store/modules/auth.js
import * as Realm from "realm-web";
import axios from "axios";

const state = {
  user: null,
  app: null,
  wineTableData: [],
  wineTableCategories: [],
  fetchingWineTableData: false,
  wineData: {},
  fetchingWineData: false,
  selectedCategory: null,   
};

const getters = {
  isAuthenticated: (state) => !!state.user,
  appCreated: (state) => !!state.app,
};

const actions = {
  async logIn({ commit, getters }) {
    console.log("Logging in");
    if (!getters.appCreated) {
      const id = "minvino-aiide";
      const config = {
        id,
      };
      const app = new Realm.App(config);
      await commit("setApp", app);
    }
    if (!getters.isAuthenticated) {
      const credentials = Realm.Credentials.anonymous();
      let user = await state.app.logIn(credentials);
      console.log(user);
      await commit("setUser", user);
    }
  },
  async fetchBaseWineData({ dispatch, state }, {minimumPoints }) {
    if (!state.selectedCategory) {
      let data = {
        query: `
              {
                wineData(
                    sortBy: SCORE_DESC
                    query: {
                      AND: [
                          {vinmonopoletData: {
                              buyable: true,
                          }}
                          {
                              OR: [
                                  {dnPoints_gt: "${minimumPoints}"},
                                  {apertifPoints_gt: "${minimumPoints}"}
                              ]
                          }
                      ]
                  }
                    limit:100
                  ){
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
                    },
                    volume {
                        value
                    },
                    availability {
                      deliveryAvailability {
                        available
                      }
                    }
                  }
                  dnPoints
                  apertifPoints
                  dnTasteNote
                  apertifTasteNote
                  score
                  productId
                }
              }`,
      };
      dispatch("fetchWineTableData", data);
    } else {
      console.log("Fetching data for category " + state.selectedCategory);
      let data = {
        query: `
              {
                wineData(
                    sortBy: SCORE_DESC
                    query: {
                      AND: [
                          {
                              vinmonopoletData: {
                                buyable: true,
                                main_category: {
                                    name: "${state.selectedCategory}"
                                }
                          }}
                          {
                            OR: [
                                {dnPoints_gt: "${minimumPoints}"},
                                {apertifPoints_gt: "${minimumPoints}"}
                            ]
                            }
                      ]
                  }
                    limit:100
                  ){
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
                    },
                    volume {
                        value
                    },
                    availability {
                      deliveryAvailability {
                        available
                      }
                    }
                  }
                  dnPoints
                  apertifPoints
                  dnTasteNote
                  apertifTasteNote
                  score
                  productId
                }
              }`,
      };
      dispatch("fetchWineTableData", data);
    }
  },
  async fetchWineTableData({ commit, getters, dispatch }, data) {
    commit("setWineTableData", []);
    commit("setFetchingWineTableData", true);
    // Refresh the token before fetching
    if (!getters.isAuthenticated) {
      await dispatch("logIn");
    }
    console.log(getters.isAuthenticated);
    await state.app.currentUser.refreshCustomData();
    let conf = {
      headers: {
        Authorization: `Bearer ${state.app.currentUser.accessToken}`,
      },
    };

    axios
      .post(
        "https://realm.mongodb.com/api/client/v2.0/app/minvino-aiide/graphql",
        data,
        conf,
      )
      .then((response) => {
        let items = response.data.data.wineData;
        let categories = new Set();
        items.forEach((element) => {
          categories.add(element.vinmonopoletData.main_category.name);
          element.category = element.vinmonopoletData.main_category.name;
          element.price = element.vinmonopoletData.price.value;
          element.name = element.vinmonopoletData.name;
          element.volume = element.vinmonopoletData.volume.value;
          element.availableOnline = element.vinmonopoletData.availability.deliveryAvailability.available;
          delete element.vinmonopoletData;
        });
        console.log(response);
        commit("setFetchingWineTableData", false);
        commit("setWineTableData", items);
      })
      .catch(function(error) {
        commit("setFetchingWineTableData", false);
        console.log(error);
      });
  },
  async fetchWineTableCategories({ commit, getters, dispatch }) {
    console.log("fetching wine categories");
    commit("setWineTableCategories", []);
    // Refresh the token before fetching
    if (!getters.isAuthenticated) {
      await dispatch("logIn");
    }
    await state.app.currentUser.refreshCustomData();
    // unuqieCategories is added as a server-side
    // custom resolver, thad does a distinc lookup in
    // wineData.vinmonopoletData.main_category.name
    let data = {
      query: `
          {
            wineDatum{
                uniqueCategories
            }
          }`,
    };

    let conf = {
      headers: {
        Authorization: `Bearer ${state.app.currentUser.accessToken}`,
      },
    };

    axios
      .post(
        "https://realm.mongodb.com/api/client/v2.0/app/minvino-aiide/graphql",
        data,
        conf,
      )
      .then((response) => {
        let categories = response.data.data.wineDatum.uniqueCategories;
        console.log(response.data);
        commit("setWineTableCategories", categories);
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  async fetchWineData({ commit, getters, dispatch }, articleNumber) {
    commit("setWineData", {});
    commit("setFetchingWineData", true);
    let data = {
      query: `
          {
            wineData(
                query: {
                    productId: "${articleNumber}"
              }){
                vinmonopoletData {
                    name,
                    distributor,
                    images {
                        url
                    },
                    alcohol {
                      value
                    },
                    price {
                      value
                    },
                    main_category {
                      name
                    },
                    main_sub_category {
                      name
                    },
                    main_country {
                      name
                    },
                    district {
                      name
                    },
                    sub_District {
                      name
                    },
                    volume {
                        value
                    }
                    availability {
                      storeAvailability {
                        available
                      },
                      deliveryAvailability {
                        available
                      }
                    },
                    url
                  }
              dnPoints
              apertifPoints
              dnTasteNote
              apertifTasteNote
              score
              productId
              dnLink
              apertifLink
            }
          }`,
    };

    // Refresh the token before fetching
    if (!getters.isAuthenticated) {
      await dispatch("logIn");
    }
    console.log(getters.isAuthenticated);
    await state.app.currentUser.refreshCustomData();
    let conf = {
      headers: {
        Authorization: `Bearer ${state.app.currentUser.accessToken}`,
      },
    };

    axios
      .post(
        "https://realm.mongodb.com/api/client/v2.0/app/minvino-aiide/graphql",
        data,
        conf,
      )
      .then((response) => {
        commit("setWineData", response.data.data.wineData[0]);
        commit("setFetchingWineData", false);
        console.log(response);
      })
      .catch((error) => {
        commit("setFetchingWineData", false);
        console.log(error);
      });
  },
};

const mutations = {
  setApp(state, app) {
    state.app = app;
  },
  setFetchingWineTableData(state, value) {
    state.fetchingWineTableData = value;
  },
  setWineTableCategories(state, wineTableCategories) {
    state.wineTableCategories = wineTableCategories;
  },
  setWineTableData(state, wineTableData) {
    state.wineTableData = wineTableData;
  },
  setWineData(state, wineData) {
    state.wineData = wineData;
  },
  setFetchingWineData(state, value) {
    state.fetchingWineData = value;
  },
  setUser(state, username) {
    state.user = username;
  },
  setSelectedCategory(state, category) {
    state.selectedCategory = category;
  },
  logOut(state) {
    state.user = null;
    state.posts = null;
  },
};
export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true,
};
