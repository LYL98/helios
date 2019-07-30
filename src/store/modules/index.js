import Order from './order';
import Base from './base';
import Merchant from './merchant';
import Purchase from './purchase';
import Item from './item';
import Login from './login';
import System from './system';
import BasicData from './basicData';
import Operate from './operate';

export default { Order, Base, Login, ...Merchant, ...Purchase, ...Item, ...System, ...BasicData, ...Operate }
