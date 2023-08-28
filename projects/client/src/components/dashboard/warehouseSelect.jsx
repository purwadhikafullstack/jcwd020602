import { useSelector } from "react-redux";
import {
  useFetchWareProv,
  useFetchWareCity,
} from "../../hooks/useFetchWarehouse";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { Select } from "@chakra-ui/react";

export default function WarehouseSelect(props) {
  const userSelector = useSelector((state) => state.auth);
  const { provinces } = useFetchWareProv();
  const [province, setprovince] = useState(0);
  const { cities } = useFetchWareCity(province);
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user"));
    if (token) {
      warehouseAdmin(token);
    }
  }, []);
  async function warehouseAdmin(token) {
    const warehouse = await api().get("/warehouses/fetchDefault");
    props.setWareAdmin && props.setWareAdmin(warehouse?.data?.warehouse);
    props.setFilter({
      ...props.filter,
      warehouse_id: warehouse?.data[0]?.id,
    });
  }
  return (
    <>
      {userSelector.role != "SUPERADMIN" ? null : (
        <>
          <Select
            id="province"
            onChange={(e) => {
              setprovince(e.target.value);
            }}
            size={"sm"}
          >
            <option key={""} value={""}>
              choose province..
            </option>
            {provinces &&
              provinces.map((val, idx) => (
                <option value={val?.city?.province}>
                  {val?.city?.province}
                </option>
              ))}
          </Select>
          <Select
            onChange={(e) => {
              props.setShown({ page: 1 });
              props.setFilter({
                ...props.filter,
                warehouse_id: e.target.value,
              });
            }}
            id="warehouse_id"
            size={"sm"}
            value={props.filter.warehouse_id}
          >
            <option key={""} value={""}>
              choose city..
            </option>
            {cities &&
              cities.map((val, idx) => (
                <option key={val.id} value={val.id}>
                  {`Warehouse ${val.name} (${val.city.type} ${val.city.city_name})`}
                </option>
              ))}
          </Select>
        </>
      )}
    </>
  );
}
