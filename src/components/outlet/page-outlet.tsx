import { Outlet, useOutletContext } from "react-router-dom";
import type { OutletContextProps } from "./onboarded-routes-outlet";

const PageOutlet = () => {
  const outletContext = useOutletContext<OutletContextProps>();
  return <Outlet context={outletContext} />;
};

export default PageOutlet;
