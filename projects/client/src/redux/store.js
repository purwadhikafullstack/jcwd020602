import { combineReducers } from "redux";
import userReducer from "./auth";
import cartReducer from "./cart";

const rootReducer = combineReducers({
  auth: userReducer,
  cart: cartReducer,
});

export default rootReducer;
