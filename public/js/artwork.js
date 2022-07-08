main();

function main() {
	const width = 450;
 	var canvas = document.createElement("canvas");
 	canvas.style = "margin:10px;";
	canvas.width = width;
	canvas.height = width - 120;
  canvas.className = "mx-auto d-flex lign-items-center";
  var artwork = document.getElementById("art");
  artwork.appendChild(canvas);
  var inputs_val = [5, "#ffffff", "#000000", 0, 0];
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    draw(ctx, width, inputs_val);
  }
  inputs_val = inputs(artwork);
  inputs_val = input_update(ctx, width, inputs_val);
}

function background(ctx, width, inputs_val) {
  ctx.fillStyle = inputs_val[1];
  ctx.fillRect(0, 0, width, width);
}

function draw(ctx, width, inputs_val) {
  const height = (3 * width) / 10;
  const length = (2 * height) / Math.sqrt(3);
  const center = [width / 2, width / 2];
  const red = parseInt(inputs_val[2].substring(1, 3), 16);
  const green = parseInt(inputs_val[2].substring(3, 5), 16);
  const blue = parseInt(inputs_val[2].substring(5, 7), 16);
  const center_color = { r: red, g: green, b: blue };
  const settings = [inputs_val[3], inputs_val[4]];
  background(ctx, width, inputs_val);
  sierpinski(ctx, center, length, center_color, 0, inputs_val[0], settings);
}

function inputs(artwork) {
  var inputs = document.createElement("div");
  inputs.style = "width:450px;height:50px;margin:20px;";
  var input1 = document.createElement("div");
  input1.style = "width:450px;height:30px;display:flex;";
  var input1_name = document.createElement("p");
  input1_name.textContent = "フラクタル次元";
  input1_name.style = "width:120px;";
  var input1_input = document.createElement("input");
  input1_input.style = "width:300px;padding:10px;";
  input1_input.type = "range";
  input1_input.className = "form-range";
  input1_input.id = "input1";
  input1_input.min = 1;
  input1_input.max = 8;
  input1_input.step = 1;
  input1_input.value = 5;
  var input1_value = document.createElement("p");
  input1_value.textContent = input1_input.value;
  input1_value.id = "input1_value";
  var inputs_col3 = document.createElement("div");
  inputs_col3.style = "width:450px;height:40px;display:flex;";
  var input2 = document.createElement("div");
  input2.style = "width:200px;height:40px;display:flex;";
  var input2_name = document.createElement("p");
  input2_name.style = "padding:5px;";
  input2_name.textContent = "背景色";
  var input2_input = document.createElement("input");
  input2_input.type = "color";
  input2_input.className = "form-control form-control-color";
  input2_input.id = "input2";
  input2_input.value = "#ffffff";
  var input3 = document.createElement("div");
  input3.style = "width:200px;height:40px;display:flex;";
  var input3_name = document.createElement("p");
  input3_name.style = "padding:5px;";
  input3_name.textContent = "中央色";
  var input3_input = document.createElement("input");
  input3_input.type = "color";
  input3_input.className = "form-control form-control-color";
  input3_input.id = "input3";
  input3_input.value = "#000000";
  var input4 = document.createElement("div");
  input4.style = "width:450px;height:30px;display:flex;";
  var input4_name = document.createElement("p");
  input4_name.textContent = "欠損率";
  input4_name.style = "width:120px;";
  var input4_input = document.createElement("input");
  input4_input.style = "width:300px;padding:10px;";
  input4_input.type = "range";
  input4_input.className = "form-range";
  input4_input.id = "input4";
  input4_input.min = 0;
  input4_input.max = 1;
  input4_input.step = 0.01;
  input4_input.value = 0;
  var input4_value = document.createElement("p");
  input4_value.textContent = input4_input.value;
  input4_value.id = "input4_value";
  var input5 = document.createElement("div");
  input5.style = "width:450px;height:30px;display:flex;";
  var input5_name = document.createElement("p");
  input5_name.textContent = "ノイズ率";
  input5_name.style = "width:120px;";
  var input5_input = document.createElement("input");
  input5_input.style = "width:300px;padding:10px;";
  input5_input.type = "range";
  input5_input.className = "form-range";
  input5_input.id = "input5";
  input5_input.min = 0;
  input5_input.max = 1;
  input5_input.step = 0.01;
  input5_input.value = 0;
  var input5_value = document.createElement("p");
  input5_value.textContent = input5_input.value;
  input5_value.id = "input5_value";
  var input6 = document.createElement("div");
  input6.style = "width:200px;height:40px;text-align:right;";
  var input6_input = document.createElement("button");
  input6_input.textContent = "生成";
  input6_input.type = "button";
  input6_input.className = "btn";
  input6_input.style = "border-color: #6610f2;color:#6610f2;";
  input6_input.id = "input6";
  input6_input.addEventListener("mouseover", function () {
    input6_input.style = "background-color: #6610f2;color:white;";
  });
  input6_input.addEventListener("mouseleave", function () {
    input6_input.style =
      "background-color: white;border-color: #6610f2;color:#6610f2;";
  });
  var input7 = document.createElement("div");
  input7.style = "width:200px;height:40px;text-align:right;";
  var input7_input = document.createElement("button");
  input7_input.textContent = "初期化";
  input7_input.type = "button";
  input7_input.className = "btn btn-secondary";
  input7_input.id = "input7";
  artwork.appendChild(inputs);
  inputs.appendChild(input1);
  input1.appendChild(input1_name);
  input1.appendChild(input1_input);
  input1.appendChild(input1_value);
  inputs.appendChild(input4);
  input4.appendChild(input4_name);
  input4.appendChild(input4_input);
  input4.appendChild(input4_value);
  inputs.appendChild(input5);
  input5.appendChild(input5_name);
  input5.appendChild(input5_input);
  input5.appendChild(input5_value);
  inputs.appendChild(inputs_col3);
  inputs_col3.appendChild(input2);
  input2.appendChild(input2_name);
  input2.appendChild(input2_input);
  inputs_col3.appendChild(input3);
  input3.appendChild(input3_name);
  input3.appendChild(input3_input);
  inputs_col3.appendChild(input7);
  input7.appendChild(input7_input);
  inputs_col3.appendChild(input6);
  input6.appendChild(input6_input);
  return [
    input1_input.value,
    input2_input.value,
    input3_input.value,
    input4_input.value,
    input5_input.value,
  ];
}

function input_update(ctx, width, inputs_val) {
  var input1 = document.getElementById("input1");
  var input1_value = document.getElementById("input1_value");
  var input2 = document.getElementById("input2");
  var input3 = document.getElementById("input3");
  var input4 = document.getElementById("input4");
  var input4_value = document.getElementById("input4_value");
  var input5 = document.getElementById("input5");
  var input5_value = document.getElementById("input5_value");
  var input6 = document.getElementById("input6");
  var input7 = document.getElementById("input7");
  input1.addEventListener("input", function () {
    input1_value.textContent = input1.value;
    inputs_val[0] = input1.value;
    draw(ctx, width, inputs_val);
  });
  input2.addEventListener("input", function () {
    inputs_val[1] = input2.value;
    draw(ctx, width, inputs_val);
  });
  input3.addEventListener("input", function () {
    inputs_val[2] = input3.value;
    draw(ctx, width, inputs_val);
  });
  input4.addEventListener("input", function () {
    input4_value.textContent = input4.value;
    inputs_val[3] = input4.value;
    draw(ctx, width, inputs_val);
  });
  input5.addEventListener("input", function () {
    input5_value.textContent = input5.value;
    inputs_val[4] = input5.value;
    draw(ctx, width, inputs_val);
  });
  input6.addEventListener("click", function () {
    draw(ctx, width, inputs_val);
  });
  input7.addEventListener("click", function () {
    input1.value = 5;
    input2.value = "#ffffff";
    input3.value = "#000000";
    input4.value = 0;
    input5.value = 0;
    inputs_val[0] = input1.value;
    inputs_val[1] = input2.value;
    inputs_val[2] = input3.value;
    inputs_val[3] = input4.value;
    inputs_val[4] = input5.value;
    input1_value.textContent = input1.value;
    input4_value.textContent = input4.value;
    input5_value.textContent = input5.value;
    draw(ctx, width, inputs_val);
  });
  return inputs_val;
}

function sierpinski(ctx, center, length, color, recur, limit, settings) {
  if (recur < limit) {
    center = center.concat();
    var height = (Math.sqrt(3) * length) / 2;
    const noise = settings[1] * 510;
    if (Math.random() < 1 - settings[0]) {
      triangle(ctx, center, length, height, color, noise);
    }
    length = length / 2;
    height = height / 2;
    const center1 = [center[0], center[1] - (4 * height) / 3];
    const center2 = [center[0] - length, center[1] + (2 * height) / 3];
    const center3 = [center[0] + length, center[1] + (2 * height) / 3];
    recur++;
    var color1 = Object.create(color);
    color1.g -=
      (255 - color1.r) / 2 + Math.floor((Math.random() - 0.5) * noise);
    color1.b -=
      (255 - color1.r) / 2 + Math.floor((Math.random() - 0.5) * noise);
    color1.r +=
      (255 - color1.r) / 2 + Math.floor((Math.random() - 0.5) * noise);
    var color2 = Object.create(color);
    color2.r -=
      (255 - color2.g) / 2 + Math.floor((Math.random() - 0.5) * noise);
    color2.b -=
      (255 - color2.g) / 2 + Math.floor((Math.random() - 0.5) * noise);
    color2.g +=
      (255 - color2.g) / 2 + Math.floor((Math.random() - 0.5) * noise);
    var color3 = Object.create(color);
    color3.r -=
      (255 - color3.b) / 2 + Math.floor((Math.random() - 0.5) * noise);
    color3.g -=
      (255 - color3.b) / 2 + Math.floor((Math.random() - 0.5) * noise);
    color3.b +=
      (255 - color3.b) / 2 + Math.floor((Math.random() - 0.5) * noise);
    sierpinski(ctx, center1, length, color1, recur, limit, settings);
    sierpinski(ctx, center2, length, color2, recur, limit, settings);
    sierpinski(ctx, center3, length, color3, recur, limit, settings);
  }
}

function triangle(ctx, center, length, height, color, noise) {
  ctx.beginPath();
  ctx.moveTo(center[0], center[1] + (2 * height) / 3);
  ctx.lineTo(center[0] - length / 2, center[1] - height / 3);
  ctx.lineTo(center[0] + length / 2, center[1] - height / 3);
  //ctx.fillStyle = randColor(color,noise*255);
  ctx.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
  ctx.fill();
}

function randColor(color, dif) {
  color = Object.create(color);
  for (var i in color) {
    color[i] += Math.floor((Math.random() - 0.5) * dif);
    if (color[i] < 0) {
      color[i] = 0;
    } else if (color[i] > 255) {
      color[i] = 255;
    }
  }
  return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
}