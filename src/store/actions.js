import * as Types from './mutationTypes';

//保存窗口高度
export const windowInnerHeight = ({ commit }, windowHeight) => {
    commit(Types.BASE_WINDOW_INNER_HEIGHT, windowHeight);
};

//loading
export const loading = ({ commit }, data) => {
    commit(Types.BASE_LOADING, data);
};

//message
export const message = ({ commit }, data) => {
    commit(Types.BASE_MESSAGE, data);
};

//保存登录信息
export const saveLoginInfo = ({ commit }, data) => {
    commit(Types.LOGIN_SAVE_LOGIN_INFO, data);
};

//设置全局权限
export const setGlobalAuth = ({ commit }, data) => {
    commit(Types.BASE_GLOBAL_AUTH, data);
};