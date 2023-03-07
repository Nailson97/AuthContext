interface User {
  permissions: string[];
  roles: string[];
}

interface ValidationUserPermitionsParams {
  user: User;
  permissions?: string[];
  roles?: string[];
}

export function validationUserPermitiions({user, permissions, roles}: ValidationUserPermitionsParams) {

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
