const httpGet = async function (url) {
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

const httpUpdate = async function (url, data) {
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

const httpPost = async function (url, data) {
  try {
    const response = await fetch(url, {
      method: "POST", // POST
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

const httpDelete = async function (url, data) {
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

exports.httpPost = httpPost;
exports.httpGet = httpGet;
exports.httpUpdate = httpUpdate;
exports.httpDelete = httpDelete;