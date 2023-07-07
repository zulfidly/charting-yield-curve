# [Demo at Netlify](https://ust-yield-chart-fidly.netlify.app/)

## Learning Objective
- web scraping by fetch and regex method
- accuracy on large data presentation (minimising DOM attempts)
- charting through Google Chart
- use of ```defineProps({})``` & ```defineEmits([])```
- use of app level provide i.e. ```create(App).provide('key', value)```
- realisation that: ```if(Array1 == Array2)``` is always false

## install Vue 3
```npm init vue@latest```

## install VueUse library
- ```npm i @vueuse/core```
- ```import { useVirtualList } from '@vueuse/core';```, to minimise number of list rendered in DOM to fit within viewport only

## install Tailwind CSS
- ```npm install -D tailwindcss postcss autoprefixer```
- ```npx tailwindcss init -p```
- see edits in tailwind.config.js
- see Tailwind top-level codes in css file

### Compile and Hot-Reload for Development
- ```npm run dev```

