//loading
export const loading = state => {
    return state.Base.loading;
};

//message
export const message = state => {
    return state.Base.message;
};

//loginInfo
export const loginInfo = state => {
    return state.Login.loginInfo;
};

//windowHeight
export const windowHeight = state => {
    return state.Base.windowHeight;
};

//全局权限
export const globalAuth = state => {
    return state.Base.globalAuth;
};
//全局省份
export const globalProvince = state => {
    return state.Base.globalProvince;
};