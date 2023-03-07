import { AuthContext } from "@/context/AuthContext";
import { validationUserPermitiions } from "@/utils/validationUserPermissions";
import { useContext } from "react";

interface useCanProps {
  permissions?: string[];
  roles?: string[];
}

export function useCan({ permissions, roles }: useCanProps) {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return false;
  }
  
  const userHasValidPermissions = validationUserPermitiions({
    user,
    permissions,
    roles
  })

  return userHasValidPermissions
}