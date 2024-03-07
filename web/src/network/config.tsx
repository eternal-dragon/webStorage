const serverName = "test"

const config = {
    production: {
        apiUrl: `http://${ serverName }.shian-shadowearth.cn/v1/`,
        debugMode: false,
    },
    development: {
        apiUrl: 'http://localhost:8081/v1/',
        debugMode: true,
    },
    test: {
        apiUrl: 'http://localhost:8081/v1/',
        debugMode: true,
    },
}

export default config
