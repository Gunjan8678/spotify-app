import { useState, useEffect } from "react";
import axios from "axios";
const useAuth = (code) => {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();
  async function FetchData() {
    try {
      const res = await axios({
        method: "post",
        url: `${process.env.REACT_APP_BASE_URL}/login`,
        data: code,
      });
      if (res.status === 200) {
        setAccessToken(res.data.access_token);
        setRefreshToken(res.data.refresh_token);
        setExpiresIn(res.data.expires_in);
        window.history.pushState({}, null, "/");
      }
      //   console.log(“31”, accessToken);
    } catch {
      console.log("code", code);
      // window.location = “/”;
    }
  }
  useEffect(() => {
    FetchData();
  }, [code]);
  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios({
        method: "post",
        url: `${process.env.REACT_APP_BASE_URL}/refresh`,
        data: refreshToken,
      })
        .then((res) => {
          setAccessToken(res.access_token);
          setExpiresIn(res.expires_in);
        })
        .catch((err) => {
          console.log("error", err);
          // window.location = “/”;
        });
    }, (expiresIn - 60) * 1000);
    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);
  return accessToken;
};
export default useAuth;
