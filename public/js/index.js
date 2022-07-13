const httpGet = async function (url) {
  console.log("index.js,httpGet");
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

const httpUpdate = async function (url, data, art_id) {
  console.log("index.js,httpUpdate");
  try {
    const response = await fetch(url + "/" + art_id, {
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
  console.log(url);
  console.log(data);
  console.log("index.js httpPost 1");
  try {
    const response = await fetch(url, {
      method: "POST", // POST
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("index.js httpPost 2");
    return response.json(); // JSON のレスポンスを JavaScript のオブジェクトに変換
  } catch (err) {
    console.log(err);
  }
};

const httpPost2 = async function (url) {
  console.log("index.js httpPost2 1");
  try {
    const response = await fetch(url, {
      method: "POST",
    });
    console.log("index.js httpPost2 2");
    console.log(response);
    return response; // JSON のレスポンスを JavaScript のオブジェクトに変換
  } catch (err) {
    console.log(err);
  }
};

/*
// 更新用API実行メソッド
const httpUpdate = async function (url,data,user_id,task_id) {
  try {
    console.log("index.js");
    const response = await fetch(url+"/"+user_id+"/"+task_id, {
      method: "PATCH", // PATCH
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json(); // JSON のレスポンスを JavaScript のオブジェクトに変換
  } catch (err) {
    console.log(err);
  }
};

// 削除用API実行メソッド
const httpDelete = async function (url,user_id,task_id) {
  try {
    const response = await fetch(url+"/"+user_id+"/"+task_id, {
      method: "DELETE", // DELETE
    });
    return response.json(); // JSON のレスポンスを JavaScript のオブジェクトに変換
  } catch (err) {
    console.log(err);
  }
};
*/
