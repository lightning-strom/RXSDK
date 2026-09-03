// 创建 WebGL 上屏画布
const webglCanvas = my.createCanvas();
const gl = webglCanvas.getContext('webgl');

// 创建 2D 离屏画布
const offscreenCanvas = my.createCanvas();
const ctx = offscreenCanvas.getContext('2d');

const { screenWidth, screenHeight, pixelRatio: dpr } = my.getSystemInfoSync();
offscreenCanvas.width = screenWidth;
offscreenCanvas.height = screenHeight;

// 顶点着色器
const vertexShaderSource = `
attribute vec2 a_position;
attribute vec2 a_texCoord;

varying vec2 v_texCoord;

void main() {
    gl_Position = vec4(a_position, 0, 1);
    v_texCoord = a_texCoord;
}
`;

// 片元着色器
const fragmentShaderSource = `
precision mediump float;

varying vec2 v_texCoord;
uniform sampler2D u_texture;

void main() {
    gl_FragColor = texture2D(u_texture, v_texCoord);
}
`;

// 创建着色器程序
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);

// 获取属性和 uniform 变量的位置
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
const texCoordAttributeLocation = gl.getAttribLocation(program, 'a_texCoord');
const textureUniformLocation = gl.getUniformLocation(program, 'u_texture');

// 创建顶点缓冲区
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [
  -1, -1,
  1, -1,
  -1, 1,
  -1, 1,
  1, -1,
  1, 1
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// 创建纹理坐标缓冲区，翻转 Y 轴
const texCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
const texCoords = [
  0, 1,
  1, 1,
  0, 0,
  0, 0,
  1, 1,
  1, 0
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

// 创建纹理
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

// 渲染循环
function render() {
// 在 2D 离屏画布上绘制
  requestAnimationFrame(drawButtons);


// 更新纹理
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, offscreenCanvas);

// 清除颜色缓冲区
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

// 使用着色器程序
  gl.useProgram(program);

// 启用属性
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(texCoordAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

// 设置纹理 uniform
  gl.uniform1i(textureUniformLocation, 0);

// 绘制三角形
  gl.drawArrays(gl.TRIANGLES, 0, 6);

// 循环渲染
  requestAnimationFrame(render);
}

render();


const buttonWidth = 135;
const buttonHeight = 40;
const buttonMargin = 20;

const buttonConfigs = [
  {
    label: '初始化', func: () => {
      console.log(123)
    }
  },
]

function drawButtons() {
  const columns = 2;
  for (let i = 0; i < buttonConfigs.length / columns; i++) {
    for (let j = 0; j < columns; j++) {
      const index = i * columns + j;
      const buttonConfig = buttonConfigs[index];
      if (buttonConfig) {
        const x = buttonMargin + j * (buttonWidth + buttonMargin);
        const y = 100 + buttonMargin + i * (buttonHeight + buttonMargin);
        // 绘制按钮背景
        ctx.fillStyle = 'gray';
        ctx.fillRect(x, y, buttonWidth, buttonHeight);
        // 绘制文字
        ctx.font = '12px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(buttonConfig.label, x + buttonWidth / 2 - ctx.measureText(buttonConfig.label).width / 2, y + buttonHeight / 2 + 6);
      }
    }
  }
}

function isButtonClicked(x, y) {
  const columns = 2;
  for (let i = 0; i < buttonConfigs.length / columns; i++) {
    for (let j = 0; j < columns; j++) {
      const index = i * columns + j;
      const buttonConfig = buttonConfigs[index];
      if (buttonConfig) {
        const left = buttonMargin + j * (buttonWidth + buttonMargin);
        const top = 100 + buttonMargin + i * (buttonHeight + buttonMargin);
        const right = left + buttonWidth;
        const bottom = top + buttonHeight;
        if (x >= left && x <= right && y >= top && y <= bottom) {
          buttonConfig.func();
          return true;
        }
      }
    }
  }
  return false;
}

my.onTouchEnd((evt) => {
  const { clientX: x, clientY: y } = evt.touches[0]
  isButtonClicked(x, y)
})
