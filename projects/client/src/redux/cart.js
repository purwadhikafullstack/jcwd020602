import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { api } from "../api/api";

export const getCarts = createAsyncThunk("cart/getCarts", async () => {
  try {
    const token = JSON.parse(localStorage.getItem("user"));
    const response = await api().get("/carts/getCart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response?.data?.data;
  } catch (err) {
    console.log(err.response?.data);
  }
});

export const addProduct = createAsyncThunk(
  "cart/addProduct",
  async ({ name, size }) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"));
      const response = await api().post(
        "/carts",
        { name, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Successfully add shoe to cart");
      return response?.data?.data;
    } catch (err) {
      alert(err.response.data.message);
    }
  }
);

export const updateCarts = createAsyncThunk(
  "cart/updateCarts",
  async ({ id, qty }) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"));
      const response = await api().patch(
        `/carts`,
        { id, qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response?.data?.data;
    } catch (err) {
      console.log(err.response?.data);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "carts/deleteProduct",
  async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"));

      await api().delete(`/carts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      console.log(err.response?.data);
    }
  }
);

export const getTotalProductsInCart = (state) => {
  const cartItems = cartSelector.selectAll(state);
  return cartItems.reduce((total, cartItem) => total + cartItem.qty, 0);
};

export const getTotalPriceInCart = (state) => {
  const cartItems = cartSelector.selectAll(state);
  return cartItems.reduce((total, cartItem) => {
    total = total + cartItem.qty * cartItem.Shoes?.price;
    return total;
  }, 0);
};

export const getTotalWeightInCart = (state) => {
  const cartItems = cartSelector.selectAll(state);
  return cartItems.reduce(
    (total, cartItem) => total + cartItem.qty * cartItem.Shoes?.weight,
    0
  );
};

// export const getNameSizeInCart = (state) => {
//   const cartItems = cartSelector.selectAll(state);
//   const checkName = cartItems?.Shoes?.name;
//   const checkSize = cartItems?.ShoeSize?.size;
//   return { checkName, checkSize };
// };

const cartEntity = createEntityAdapter({ selectId: (cart) => cart.id });

const cartSlice = createSlice({
  name: "cart",
  initialState: cartEntity.getInitialState(),
  extraReducers: {
    [getCarts.fulfilled]: (state, action) => {
      cartEntity.setAll(state, action.payload);
    },
    [addProduct.fulfilled]: (state, action) => {
      cartEntity.setAll(state, action.payload);
      // action.payload.forEach((cartItem) => {
      //   cartEntity.updateOne(state, {
      //     id: cartItem.id,
      //     changes: cartItem,
      //   });
      // });
    },
    [updateCarts.fulfilled]: (state, action) => {
      cartEntity.setAll(state, action.payload);
      // action.payload.forEach((cartItem) => {
      //   cartEntity.updateOne(state, {
      //     id: cartItem.id,
      //     changes: cartItem,
      //   });
      // });
    },
    [deleteProduct.fulfilled]: (state, action) => {
      cartEntity.removeOne(state, action.payload);
    },
  },
});

export const cartSelector = cartEntity.getSelectors((state) => state.cart);
export default cartSlice.reducer;
