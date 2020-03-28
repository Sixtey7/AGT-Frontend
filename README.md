# AGT-Frontend

## About
Front end for an Annual Goal Tracking App I'm working on

### Related Projects
The backend is written in Python and hosted in the repo: https://github.com/Sixtey7/AGT-Backend

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

## Docker
# Building
* docker build -t agt-frontend:latest .

# Running
* docker run --name agt-frontend -it -p 8080:8080 --rm agt-frontend:latest

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
