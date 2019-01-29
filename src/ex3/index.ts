import * as debug from "debug";
import {
  createProgramContext,
  createGLContext,
  loadImage
} from "../tools/tools";

const fs: string = require("./fs.glsl");
const vs: string = require("./vs.glsl");
const pic: string = require("../assets/leaves.jpg");

const log = debug("example3");

async function start() {
  const jpeg = await loadImage(pic);
  let pgCtx, ctx, err;
  [ctx, err] = createGLContext();
  if (err) {
    log(`%c ${err}`, "color:red");
    return;
  }

  [pgCtx, err] = createProgramContext(ctx, vs, fs);
  pgCtx.registerUniforms([
    "u_resolution",
    "u_image",
    "u_kernel[0]",
    "u_kernelWeight",
    "u_flipY"
  ]);
  pgCtx.registerAttributes(["a_position", "a_texCoord"]);

  const { gl } = ctx;

  // Create a vertex array object (attribute state)
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // buffer for the a_position attribute
  {
    const buffer = gl.createBuffer();
    gl.enableVertexAttribArray(pgCtx.getAttribute("a_position"));
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(
      pgCtx.getAttribute("a_position"),
      2, //size: components per iteration,
      gl.FLOAT, //type  the data is 32bit floats
      false, // dont normalize the data
      0, //stride 0 = move forward size * sizeof(type) each iteration to get the next position
      0 //offset // start at the beginning of the buffer
    );
  }

  //buffer for attribute "a_texCoord"
  {
    const buffer = gl.createBuffer();
    gl.enableVertexAttribArray(pgCtx.getAttribute("a_texCoord"));
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        0.0,
        0.0,
        1.0,
        0.0,
        0.0,
        1.0,
        0.0,
        1.0,
        1.0,
        0.0,
        1.0,
        1.0
      ]),
      gl.STATIC_DRAW
    );

    gl.vertexAttribPointer(
      pgCtx.getAttribute("a_texCoord"),
      2 /*size components per iteration*/,
      gl.FLOAT /*type the data is 32bit floats*/,
      false /*normalize don't normalize the data*/,
      0 /*stride 0 = move forward size * sizeof(type) each iteration to get the next position */,
      0 /*offset start at the beginning of the buffer*/
    );
  }

  function createAndSetupTexture(gl: WebGL2RenderingContext) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set up texture so we can render any size image and so we are
    // working with pixels.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return texture;
  }

  // original texture from image
  {
    // Create a texture and put the image in it.
    const texture = createAndSetupTexture(gl);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0 /* mipLevel*/,
      gl.RGBA /*internalFormat*/,
      gl.RGBA /*srcFormat*/,
      gl.UNSIGNED_BYTE /* srcType */,
      jpeg
    );
  }

  // create 2 textures and attach them to framebuffers.
  var textures = [];
  var framebuffers = [];
  // fill texture and framebuffer array
  {
    for (let i = 0; i < 2; i++) {
      var texture = createAndSetupTexture(gl);
      textures.push(texture);

      // make the texture the same size as the image
      const mipLevel = 0; // the largest mip
      const internalFormat = gl.RGBA; // format we want in the texture
      const border = 0; // must be 0
      const srcFormat = gl.RGBA; // format of data we are supplying
      const srcType = gl.UNSIGNED_BYTE; // type of data we are supplying
      const data: ArrayBufferView = null; // no data = create a blank texture
      gl.texImage2D(
        gl.TEXTURE_2D,
        mipLevel,
        internalFormat,
        jpeg.width,
        jpeg.height,
        border,
        srcFormat,
        srcType,
        data
      );

      // Create a framebuffer
      const fbo = gl.createFramebuffer();
      framebuffers.push(fbo);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

      // Attach a texture to it.
      const attachmentPoint = gl.COLOR_ATTACHMENT0; // Attaches the texture to the framebuffer's color buffer.
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        attachmentPoint,
        gl.TEXTURE_2D,
        texture,
        mipLevel
      );
    }
  }
  // textures are now created
}

window.addEventListener("load", start);
