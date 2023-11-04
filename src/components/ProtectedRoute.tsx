import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoaded } = useUser()!;

  if (!isLoaded) {
    return <></>;
  }

  if (user === null) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
