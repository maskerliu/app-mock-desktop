<template>
    <div id="app">
        <mu-fade-transition>
            <keep-alive include="Mock">
                <router-view></router-view>
            </keep-alive>
        </mu-fade-transition>
    </div>
</template>

<script>
    export default {
        name: 'app-mock-desktop'
    }
</script>

<style>
    /* CSS */
</style>
