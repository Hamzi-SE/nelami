import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import customFetch from "../../utils/api";


const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const callLogout = async () => {
    dispatch({ type: "LOGOUT_USER_REQUEST" });
    const res = await customFetch("/api/v1/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.status === 200) {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      dispatch({ type: "LOGOUT_USER_SUCCESS" })
      dispatch({ type: "RESET_ACTIVE_COMPONENT" })
      toast.success(data.message);
      navigate("/Products");
    } else {
      dispatch({ type: "LOGOUT_USER_FAIL", payload: data.message })
      toast.error(data.message);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    callLogout();

    // eslint-disable-next-line
  }, []);

  return <h1 className="d-flex justify-content-center align-items-center">Logging out...</h1>;
};

export default Logout;
