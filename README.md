# [view at Netlify](https://ust-yield-chart-fidly.netlify.app/)

## install Vue
```npm init vue@latest```

## install VueUse library
- ```npm i @vueuse/core```
- ```import { useVirtualList } from '@vueuse/core';```, to minimise number of list rendered in DOM to fit within viewport only

## install Tailwind CSS
```npm install -D tailwindcss postcss autoprefixer```
```npx tailwindcss init -p```
- see edits in tailwind.config.js
- see Tailwind top-level codes in css file

### Compile and Hot-Reload for Development
```npm run dev```

### Compile and Minify for Production
```npm run build```
