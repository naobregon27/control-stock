export const roles = {
    ADMIN: 'admin',
    USER: 'user',
  };
  
  export const checkRole = (user, role) => {
    return user && user.role === role;
  };