import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Warehouse = {
  _id: string;
  contactNumber: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  address: {
    formatted: string;
    city: string;
    state: string;
    country?: string;
    pincode: string;
    landmark?: string;
  };
  isActive: boolean;
};

type WarehouseState = {
  warehouses: Warehouse[];
};

const initialState: WarehouseState = {
  warehouses: [],
};

const warehouseSlice = createSlice({
  name: "warehouse",
  initialState,
  reducers: {
    setWarehouses(state, action: PayloadAction<Warehouse[]>) {
      state.warehouses = action.payload;
    },
    addWarehouse(state, action: PayloadAction<Warehouse>) {
      state.warehouses.unshift(action.payload);
    },
    clearWarehouses(state) {
      state.warehouses = [];
    },
  },
});

export const { setWarehouses, addWarehouse, clearWarehouses } =
  warehouseSlice.actions;

export default warehouseSlice.reducer;
