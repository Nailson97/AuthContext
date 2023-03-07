import { AuthContext } from "@/context/AuthContext";
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

  if (permissions?.length > 0) {
    const allPermissions = permissions.every((permission) => {
      return user.permissions.includes(permission);
    });

    if (!allPermissions) {
      return false;
    }
  }

  if (roles?.length > 0) {
    const allRoles = roles.some((roles) => {
      return user.roles.includes(roles);
    });

    if (!allRoles) {
      return false;
    }
  }

  return true
}
