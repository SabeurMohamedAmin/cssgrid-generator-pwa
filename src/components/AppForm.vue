<script>
import { mapState } from 'vuex';
import AppExplain from './AppExplain.vue';
import AppModal from './AppModal.vue';
import AppCode from './AppCode.vue';

export default {
  components: {
    AppExplain,
    AppModal,
    AppCode,
  },
  emits: ['close'],
  data() {
    return {
      showCodeModal: false,
      showExplainModal: false,
    };
  },
  computed: {
    ...mapState(['columngap', 'rowgap', 'columns', 'rows']),
  },
  watch: {
    columns(newVal, oldVal) {
      const payload = {
        newVal,
        oldVal,
        direction: 'colArr',
      };
      this.$store.commit('adjustArr', payload);
    },
    rows(newVal, oldVal) {
      const payload = {
        newVal,
        oldVal,
        direction: 'rowArr',
      };
      this.$store.commit('adjustArr', payload);
    },
  },
};
</script>

<template>
  <aside>
    <fieldset>
      <label for="columns">{{ $t("form.columns") }}</label>
      <input
        id="columns"
        type="number"
        min="0"
        max="12"
        @input="$store.commit(`updateColumns`, $event.target.value)"
        :value="columns"
      >
    </fieldset>

    <fieldset>
      <label for="rows">{{ $t("form.rows") }}</label>
      <input
        id="rows"
        type="number"
        min="0"
        max="12"
        @input="$store.commit(`updateRows`, $event.target.value)"
        :value="rows"
      >
    </fieldset>

    <fieldset>
      <label for="columngap">
        {{ $t("form.columngap") }}
        <span class="label-extra-info">
          {{ $t("form.units") }}
        </span>
      </label>
      <input
        id="columngap"
        type="number"
        min="0"
        max="50"
        @input="$store.commit(`updateColumnGap`, $event.target.value)"
        :value="columngap"
      >
    </fieldset>

    <fieldset>
      <label for="rowgap">
        {{ $t("form.rowgap") }}
        <span class="label-extra-info">
          {{ $t("form.units") }}
        </span>
      </label>
      <input
        id="rowgap"
        type="number"
        min="0"
        max="50"
        @input="$store.commit(`updateRowGap`, $event.target.value)"
        :value="rowgap"
      >
    </fieldset>

    <button @click="showCodeModal = true">{{ $t("form.codebutton") }}</button>
    <button type="reset" @click="$store.commit(`resetGrid`)">{{ $t("form.reset") }}</button>
    <app-modal v-if="showCodeModal" @close="showCodeModal = false">
      <template v-slot:header >
        <h3 >{{ $t("modal.header.yourcode") }}</h3>
      </template>

      <template v-slot:body >
        <div>
          <app-code/>
        </div>
    </template>
    </app-modal>

    <p class="wat" @click="showExplainModal = true">{{ $t("form.project") }}</p>
    <app-modal v-if="showExplainModal" @close="showExplainModal = false">
      <template v-slot:header>
        <h3 >{{ $t("modal.header.what") }}</h3>
      </template>
      <template v-slot:body>
        <div>
          <app-explain/>
        </div>
      </template>
    </app-modal>
  </aside>
</template>

<style lang="css" scoped>
aside {
   margin: 60px;
   font-size: 17px;
   width: 550px;
}
 .wat {
   font-family: "Caveat", cursive;
   font-size: 22px;
   margin-top: 18px;
   color: #a8c9cc;
   opacity: 0.9;
   font-weight: normal;
   cursor: pointer;
}
 @media screen and (max-width: 700px) {
   aside {
     width: 80vw;
     margin: 100px 50px;
  }
   button[type=reset] {
     margin-left: 20px;
  }
}

/* FROM GLOBAL */

  body {
   width: 100%;
   height: 90vh;
   padding: 0;
   margin: 0;
   background: #192d38;
  /* Old browsers */
   background: -moz-radial-gradient(center, ellipse cover, #192d38 0%, #211f2f 100%);
  /* FF3.6-15 */
   background: -webkit-radial-gradient(center, ellipse cover, #192d38 0%, #211f2f 100%);
  /* Chrome10-25,Safari5.1-6 */
   background: radial-gradient(ellipse at center, #192d38 0%, #211f2f 100%);
  /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
   filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#192d38',
                                                      endColorstr='#211f2f',GradientType=1);
  /* IE6-9 fallback on horizontal gradient */
   font-family: "Mukta Mahee", Helvetica, Arial, sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   color: white;
   font-weight: 300;
}
 input, label, button {
   font-family: "Mukta Mahee", Helvetica, Arial, sans-serif;
}
 label {
   padding-right: 18px;
   display: inline-block;
   min-width: 220px;
   width: 72%;
}
 label .label-extra-info {
   opacity: 0.7;
}
 input {
   font-size: 17px;
   background: #211f2f;
   color: white;
   width: 50px;
   padding: 0.3ch 5px;
   max-height: 40px;
   border: 1px solid #666;
}
 fieldset {
   margin-bottom: 20px;
   border: none;
   margin: 0;
   padding: 5px 0;
}
 button {
   background: transparent;
   color: #08ffbd;
   padding: 4px 30px 5px;
   border-radius: 1000px;
   border: 1px solid #08ffbd;
   font-size: 16px;
   margin: 20px 0 0;
   cursor: pointer;
   transition: 0.35s all;
}
 button:hover {
   background: #08ffbd;
   color: black;
}
 [type="reset"] {
   color: #aaa;
   border: 1px solid #aaa;
}
 [type="reset"]:hover {
   background: #aaa;
   color: black;
}

</style>
