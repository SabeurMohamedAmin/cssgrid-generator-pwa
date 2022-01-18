<script>
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
      child: {},
      widthfull: 'widthfull',
      errors: {
        col: [],
        row: [],
      },
    };
  },
  computed: {
    ...mapState([
      'columngap',
      'rowgap',
      'colArr',
      'rowArr',
      'columns',
      'rows',
      'childarea',
    ]),
    ...mapGetters(['rowTemplate', 'colTemplate', 'divNum']),
  },
  methods: {
    validateunit(e, i, direction) {
      const unit = e.target.value;
      const check = /fr$/.test(unit)
        || /px$/.test(unit)
        || /%$/.test(unit)
        || /em$/.test(unit)
        || /rem$/.test(unit)
        || /vw$/.test(unit)
        || /vh$/.test(unit)
        || /vmin$/.test(unit)
        || /q$/.test(unit)
        || /mm$/.test(unit)
        || /cm$/.test(unit)
        || /in$/.test(unit)
        || /pt$/.test(unit)
        || /pc$/.test(unit)
        || /ex$/.test(unit)
        || /ch$/.test(unit)
        || /minmax/.test(unit)
        || ['auto', 'min-content', 'max-content'].includes(unit)
        || parseInt(unit, 10) === 0; // allow 0 as a valid value without a unit

      if (!check) {
        this.errors[direction].push(i);
      } else {
        this.errors[direction].splice(this.errors[direction].indexOf(i), 1);
      }
    },
    delegatedTouchPlaceChild(ev) {
      const target = document.elementFromPoint(
        ev.changedTouches[0].clientX,
        ev.changedTouches[0].clientY,
      );
      const startend = ev.type === 'touchstart' ? 's' : 'e';
      this.placeChild(target.dataset.id, startend);
    },
    placeChild(item, startend) {
      // built an object first because I might use this for something else
      this.child[`${startend}row`] = Math.ceil(item / this.columns);
      this.child[`${startend}col`] = item - (this.child[`${startend}row`] - 1) * this.columns;

      // create the children css units as a string
      if (startend === 'e') {
        // flip starts and ends if dragged in the opposite direction
        const [startRow, endRow] = this.child.srow <= this.child.erow
          ? [this.child.srow, this.child.erow]
          : [this.child.erow, this.child.srow];
        const [startCol, endCol] = this.child.scol <= this.child.ecol
          ? [this.child.scol, this.child.ecol]
          : [this.child.ecol, this.child.scol];

        const childstring = `${startRow} / ${startCol} / ${endRow
          + 1} / ${endCol + 1}`;

        this.$store.commit('addChildren', childstring);
      }
    },
    removeChild(index) {
      this.$store.commit('removeChildren', index);
    },
  },
};
</script>

<template>
  <main>
    <section
        :style="{ gridTemplateColumns: colTemplate, gridTemplateRows: '50px', gridColumnGap: columngap + 'px', gridRowGap: rowgap + 'px' }"
        class="colunits"
    >
      <div v-for="(col, i) in colArr" :key="i">
        <input
            v-model.lazy="col.unit"
            @change="validateunit($event, i, 'col')"
            :class="[columns > 8 ? widthfull : '']"
            aria-label="Grid Template Column Measurements"
        >
        <div class="errors" v-if="errors.col.indexOf(i) !== -1">{{ $t("grid.realcssunit") }}</div>
      </div>
    </section>

    <section
        :style="{ gridTemplateColumns: '50px', gridTemplateRows: rowTemplate, gridColumnGap: columngap + 'px', gridRowGap: rowgap + 'px' }"
        class="rowunits"
    >
      <div v-for="(row, i) in rowArr" :key="i">
        <input
            v-model.lazy="row.unit"
            @change="validateunit($event, i, 'row')"
            aria-label="Grid Template Row Measurements"
        >
        <div class="errors" v-if="errors.row.indexOf(i) !== -1">{{ $t("grid.realcssunit") }}</div>
      </div>
    </section>

    <div id="gridcontainer">
      <section
          class="grid"
          :style="{ gridTemplateColumns: colTemplate, gridTemplateRows: rowTemplate , gridColumnGap: columngap + 'px', gridRowGap: rowgap + 'px' }"
          @touchstart.prevent="delegatedTouchPlaceChild"
          @touchend.prevent="delegatedTouchPlaceChild"
      >
        <div
            v-for="(item, i) in divNum"
            :key="i"
            :class="'box' + i"
            :data-id="item"
            @mousedown="placeChild(item, 's')"
            @mouseup="placeChild(item, 'e')"
        ></div>
      </section>

      <section
          class="grid gridchild"
          :style="{ gridTemplateColumns: colTemplate, gridTemplateRows: rowTemplate , gridColumnGap: columngap + 'px', gridRowGap: rowgap + 'px' }"
      >
        <div
            v-for="(child, i) in childarea"
            :key="child"
            :class="'child' + i"
            :style="{ gridArea: child }"
        >
          <button @click="removeChild(i)">&times;</button>
        </div>
      </section>
    </div>
    <!--gridcontainer-->
  </main>
</template>

<style lang="css" scoped>
main {
   width: calc(70vw - 50px);
   height: calc(70vh - 50px);
   margin: 15px 0 0 75px;
}
 .gridchild {
   counter-reset: step;
}
 .gridchild div {
   counter-increment: step;
   position: relative;
}
 .gridchild div:before {
   position: absolute;
   content: ".div" counter(step);
   display: block;
   padding: 0 5px;
   text-align: center;
   color: white;
}
 .gridchild div button {
   position: absolute;
   right: 0;
   padding: 0 5px;
   margin: 0;
   color: white;
   background-color: transparent;
   border: none;
   z-index: 99999;
}
 #gridcontainer {
   border: 1px solid #08ffbd;
   width: 100%;
   height: 100%;
   z-index: 0;
   position: relative;
   background: #131321;
  /* Old browsers */
   background: -moz-linear-gradient(top, #131321 0%, #1f1c2c 100%);
  /* FF3.6-15 */
   background: -webkit-linear-gradient(top, #131321 0%, #1f1c2c 100%);
  /* Chrome10-25,Safari5.1-6 */
   background: linear-gradient(to bottom, #131321 0%, #1f1c2c 100%);
  /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
   filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#131321', endColorstr='#1f1c2c',GradientType=0);
  /* IE6-9 */
   box-shadow: 0 2px 20px 0 #000;
}
 .grid {
   width: 100%;
   height: 100%;
   position: absolute;
   display: grid;
   grid-auto-flow: row dense;
}
 .grid div[class*="child"]:nth-child(1) {
   background: rgba(138, 107, 15, 0.7);
   border: 1px solid #ddd;
}
 .grid div[class*="child"]:nth-child(2) {
   background: rgba(122, 138, 15, 0.7);
   border: 1px solid #ddd;
}
 .grid div[class*="child"]:nth-child(3) {
   background: rgba(77, 138, 15, 0.7);
   border: 1px solid #ddd;
}
 .grid div[class*="child"]:nth-child(4) {
   background: rgba(31, 138, 15, 0.7);
   border: 1px solid #ddd;
}
 .grid div[class*="child"]:nth-child(5) {
   background: rgba(15, 138, 46, 0.7);
   border: 1px solid #ddd;
}
 .grid div[class*="child"]:nth-child(6) {
   background: rgba(15, 138, 92, 0.7);
   border: 1px solid #ddd;
}
 .grid div[class*="child"]:nth-child(7) {
   background: rgba(15, 138, 138, 0.7);
   border: 1px solid #ddd;
}
 .grid div[class*="child"]:nth-child(8) {
   background: rgba(15, 92, 138, 0.7);
   border: 1px solid #ddd;
}
 .grid div[class*="child"]:nth-child(9) {
   background: rgba(15, 46, 138, 0.7);
   border: 1px solid #ddd;
}
 .grid div[class*="child"]:nth-child(10) {
   background: rgba(31, 15, 138, 0.7);
   border: 1px solid #ddd;
}
 .grid div[class*="child"]:nth-child(11) {
   background: rgba(76, 15, 138, 0.7);
   border: 1px solid #ddd;
}
 .grid div[class*="child"]:nth-child(12) {
   background: rgba(122, 15, 138, 0.7);
   border: 1px solid #ddd;
}
 .grid div[class*="child"]:nth-child(13) {
   background: rgba(138, 15, 107, 0.7);
   border: 1px solid #ddd;
}
 .grid div[class*="child"]:nth-child(14) {
   background: rgba(138, 15, 61, 0.7);
   border: 1px solid #ddd;
}
 .grid div[class*="child"]:nth-child(15) {
   background: rgba(138, 15, 15, 0.7);
   border: 1px solid #ddd;
}
 .grid div[class*="child"]:nth-child(16) {
   background: rgba(138, 61, 15, 0.7);
   border: 1px solid #ddd;
}
 .grid div[class*="child"]:nth-child(17) {
   background: rgba(138, 107, 15, 0.7);
   border: 1px solid #ddd;
}
 .grid div[class*="child"]:nth-child(18) {
   background: rgba(122, 138, 15, 0.7);
   border: 1px solid #ddd;
}
 .grid div[class*="child"]:nth-child(19) {
   background: rgba(77, 138, 15, 0.7);
   border: 1px solid #ddd;
}
 .grid div[class*="child"]:nth-child(20) {
   background: rgba(31, 138, 15, 0.7);
   border: 1px solid #ddd;
}
 .grid p {
   padding: 0 10px;
}
 .grid div[class*="box"] {
   background-image: url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
   border: 1px dotted white;
   transition: 0.2s all ease;
   cursor: move;
   position: relative;
   z-index: 1000;
   opacity: 0.5;
}
 .rowunits, .colunits {
   display: grid;
}
 .rowunits div, .colunits div {
   text-align: center;
   position: relative;
}
 .rowunits {
   margin-left: -70px;
   float: left;
   height: 100%;
}
 .rowunits div {
   align-self: center;
}
 .widthfull {
   width: 100%;
}
 @media screen and (max-width: 700px) {
   main {
     width: calc(80vw - 50px);
     height: calc(40vh - 50px);
  }
}
 .errors {
   position: absolute;
   bottom: -5px;
   border-radius: 4px;
   padding: 8px 12px;
   z-index: 1;
   font-weight: bold;
   width: 150px;
   min-height: 50px;
   background: #6d1a39;
}
</style>
