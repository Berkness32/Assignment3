const fetchWithJWTHeader = async (url, props) => {
  let data = sessionStorage.getItem("jwt");
  const headers = { Authorization: data, "Content-Type": "application/json" };
  return await fetch(url, { ...props, headers });
};

export { fetchWithJWTHeader };
