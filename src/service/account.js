import { Config, Http } from '@/util';

export default {
    getBrand(data) {
        return Http.get(Config.api.getBrand, data);
    }
}