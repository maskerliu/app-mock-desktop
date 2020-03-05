<template>
  <div class="stat-snap-item">
     <span class="item-selected" v-if="isSelected"></span>
     打点</div>
</template>

<script lang="ts" src="./ProxyStatSnap.vue.ts"></script>

<style>
.stat-snap-item {
  position: relative;
  height: 50px;
  border-style: none none solid none;
  border-bottom: 1px solid #e1e1e1;
  border-bottom-width: 1px;
  padding: 10px 15px;
}

.stat-snap-item:hover {
  background: #ececec;
  cursor: pointer;
}

.stat-snap-method {
  font-size: 0.8rem;
  color: #2980b9;
}

.stat-snap-url {
  font-size: 0.8rem;
  color: #34495e;
  font-style: italic;
  border-bottom: 1px dotted #34495e;
}

.stat-snap-status {
  font-size: 0.6rem;
  font-weight: bold;
  color: #34495e;
  font-style: italic;
}

.item-selected {
  position: absolute;
  width: 6px;
  height: 100%;
  background: #16a085;
  left: 0;
  top: 0;
}
</style>
