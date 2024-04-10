import axios from "axios";

export const PostAuthRequest = (url, body, successFunction, enqueueSnackbar, navigate, setLoading) => {
  setLoading(true);
  try {
    const getdata = (requestCount) => {
      const atoken = window.localStorage.getItem("access_token");
      const rtoken = window.localStorage.getItem("refresh_token");

      // Handling case whether access token is present or not
      if (atoken) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${atoken}`,
          },
        };

        axios
          .post(process.env.REACT_APP_BACKEND_URL + url, body, config)
          .then((res) => {
            setLoading(false);
            successFunction(res);
            return;
          })
          .catch((error) => {
            // Handling case when access token is expired
            if (error.response && error.response.status === 401 && requestCount === 0) {
              axios
                .post(process.env.REACT_APP_BACKEND_URL + "api/user/refresh", {
                  refresh_token: rtoken,
                })
                .then((res) => {
                  // Updating access and refresh token
                  // console.log(res);
                  localStorage.setItem("access_token", res.data.access_token);
                  localStorage.setItem("refresh_token", res.data.refresh_token);
                  getdata(1);
                  return;
                })
                .catch((error) => {
                  setLoading(false);
                  if (error.response && error.response.status == 401) {
                    window.localStorage.clear();
                    navigate("/login");
                  } else if (error.code === "ERR_NETWORK") {
                    enqueueSnackbar("Please check your connection and try again", {
                      variant: "error",
                    });
                  } else {
                    enqueueSnackbar("Some error occurred while submitting. Please try again", {
                      variant: "error",
                    });
                  }
                  return;
                });
            } else {
              setLoading(false);
              console.log(error);
              if (error.code === "ERR_NETWORK") {
                enqueueSnackbar("Please check your connection and try again", {
                  variant: "error",
                });
              } else {
                enqueueSnackbar("Some error occurred while submitting. Please try again", {
                  variant: "error",
                });
              }
              return;
            }
          });
      } else {
        window.localStorage.clear();
        const config = {
          headers: {
            "Content-Type": "application/json",
            withCredentials: true,
          },
        };
        Promise.resolve(axios.post(process.env.REACT_APP_BACKEND_URL + url, body, config))
          .then((res) => {
            successFunction(res);
            setLoading(false);
            return;
          })
          .catch((error) => {
            setLoading(false);
            if (error.response && error.response.status == 401) {
              window.localStorage.clear();
              navigate("/login");
            } else if (error.code === "ERR_NETWORK") {
              enqueueSnackbar("Please check your connection and try again", {
                variant: "error",
              });
            } else {
              enqueueSnackbar("Some error occurred while submitting. Please try again", {
                variant: "error",
              });
            }
          });

        return;
      }
    };

    getdata(0);
    return;
  } catch (error) {
    setLoading(false);
    if (error.code === "ERR_NETWORK") {
      enqueueSnackbar("Please check your connection and try again", {
        variant: "error",
      });
    } else {
      enqueueSnackbar("Some error occurred while submitting. Please try again", {
        variant: "error",
      });
    }
    return;
  }
};

export const GetAuthRequest = (url, successFunction, enqueueSnackbar, navigate, setLoading) => {
  setLoading(true);
  try {
    const getdata = (requestCount) => {
      const atoken = window.localStorage.getItem("access_token");
      const rtoken = window.localStorage.getItem("refresh_token");

      // Handling case whether access token is present or not
      if (atoken) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${atoken}`,
          },
        };

        axios
          .get(process.env.REACT_APP_BACKEND_URL + url, config)
          .then((res) => {
            successFunction(res);
            setLoading(false);
            return;
          })
          .catch((error) => {
            // Handling case when access token is expired
            if (error.response && error.response.status === 401 && requestCount === 0) {
              axios
                .post(process.env.REACT_APP_BACKEND_URL + "api/user/refresh", {
                  refresh_token: rtoken,
                })
                .then((res) => {
                  // Updating access and refresh token
                  // console.log(res);
                  localStorage.setItem("access_token", res.data.access_token);
                  localStorage.setItem("refresh_token", res.data.refresh_token);
                  getdata(1);
                  return;
                })
                .catch((error) => {
                  setLoading(false);
                  if (error.response && error.response.status == 401) {
                    window.localStorage.clear();
                    navigate("/login");
                  } else if (error.code === "ERR_NETWORK") {
                    enqueueSnackbar("Please check your connection and try again", {
                      variant: "error",
                    });
                  } else {
                    // enqueueSnackbar("Some error occurred while submitting. Please try again", {
                    //   variant: "error",
                    // });
                  }
                  return;
                });
            } else {
              setLoading(false);
              console.log(error);
              if (error.code === "ERR_NETWORK") {
                enqueueSnackbar("Please check your connection and try again", {
                  variant: "error",
                });
              } else {
                // enqueueSnackbar("Some error occurred !!!", {
                //   variant: "error",
                // });
              }
              return;
            }
          });
      } else {
        window.localStorage.clear();
        const config = {
          headers: {
            "Content-Type": "application/json",
            withCredentials: true,
          },
        };
        Promise.resolve(axios.get(process.env.REACT_APP_BACKEND_URL + url, config))
          .then((res) => {
            successFunction(res);
            setLoading(false);
            return;
          })
          .catch((error) => {
            console.log(error.message);
            setLoading(false);
            if (error.response && error.response.status == 401) {
              window.localStorage.clear();
              navigate("/login");
            } else if (error.code === "ERR_NETWORK") {
              enqueueSnackbar("Please check your connection and try again", {
                variant: "error",
              });
            } else {
              // enqueueSnackbar("Some error occurred while submitting. Please try again", {
              //   variant: "error",
              // });
            }
            return;
          });
      }
    };

    getdata(0);
    return;
  } catch (error) {
    setLoading(false);
    if (error.code === "ERR_NETWORK") {
      enqueueSnackbar("Please check your connection and try again", {
        variant: "error",
      });
    } else {
      // enqueueSnackbar("Some error occurred while submitting. Please try again", {
      //   variant: "error",
      // });
      // navigate("/login");
    }
    return;
  }
};
