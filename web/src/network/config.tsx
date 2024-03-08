const config = {
    production: {
        apiUrl: `http://dytx2tyxt.com.cn/v1/`,
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
