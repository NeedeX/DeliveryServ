import {combineReducers} from 'redux';

import CartReducer from './CartReduces';
import BannerReducer from './BannerReducer';
import CategoriesReducer from './CategoriesReducer';
import ProductsReducer from './ProductsReducer';
import OptionReducer from './OptionReducer';
import OrderReducer from './OrderReducer';
import CommercialOfferReducer from './CommercialOfferReducer';
import UserReducer from './UserReducer';
import AddressReducer from './AddressReducer';
import FavoriteReducer from './FavoriteReducer';
import TegsReducer from './TegsReducer';
import CustomersReducer from './CustomersReducer';
import HistoryReducer from './HistoryReducer';
import LocationReducer from './LocationReducer';

const allReducers = combineReducers ({
    
    CartReducer: CartReducer,
    BannerReducer: BannerReducer,
    CategoriesReducer: CategoriesReducer,
    ProductsReducer: ProductsReducer,
    OptionReducer: OptionReducer,
    OrderReducer: OrderReducer,
    CommercialOfferReducer: CommercialOfferReducer,
    UserReducer: UserReducer,
    AddressReducer: AddressReducer,
    FavoriteReducer: FavoriteReducer,
    TegsReducer: TegsReducer,
    CustomersReducer: CustomersReducer,
    HistoryReducer: HistoryReducer,
    LocationReducer: LocationReducer,
});

export default allReducers;