import { useState } from "react";

const useApi = (apiFunc) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const request = async (...arg) => {
    setLoading(true);
    setMessage(null);
    setSuccess(false);
    const response = await apiFunc(...arg);

    setStatus(response.status);
    if (response.data.message) setMessage(response.data.message);
    setLoading(false);

    if (!response.ok) {
      return setError(true);
    }

    setError(false);
    setSuccess(response.data.success);
    setData(response.data.data);
  };

  return { error, loading, data, request, message, status, success };
};

export default useApi;
