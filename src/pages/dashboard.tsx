import { Can } from "@/components/can";
import { AuthContext } from "@/context/AuthContext";
import { setupAPIClient } from "@/services/api";
import { api } from "@/services/apiClient";
import { witchSSRAuth } from "@/utils/witchSSRAuth";
import { useContext, useEffect } from "react";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get("/me")
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  });

  return (
   <>
     <h1>Dashboard: {user?.email}</h1>
     <Can permissions={['metrics.list']}>
       <div>Metrics</div> 
     </Can>
   </>
  )  
}

export const getServerSideProps = witchSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get("/me");

  return {
    props: {},
  };
});
