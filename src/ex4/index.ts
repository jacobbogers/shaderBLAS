
// copy one buffer to another
//gl.bindFramebuffer ( gl.DRAW_FRAMEBUFFER, copieFB );
//gl.bindFramebuffer ( gl.READ_FRAMEBUFFER, FBorig );
//gl.readBuffer ( gl.COLOR_ATTACHMENT0 );
//gl.blitFramebuffer(srcX0=, srcY0=0, srcX1=PVS; srcY1=PVS, dstX0=0, dstY0=0, dstX1=PVS, dstY1=PVS, gl.COLOR_BUFFER_BIT, gl.NEAREST);
//looks good

//old webgl1 solution
//gl.bindFramebuffer( gl.FRAMEBUFFER , copieFB);
//gl.viewport(0, 0, PVS, PVS);
//gl.useProgram(copieShader);
//gl.uniform1i(copieShader.FBorig,TEXTURE1);
//gl.drawArrays(gl.POINTS , 0 , NBRE);
//sgemm
//sgemm (transA, transB, m,n,k, alpha, A, lda, b, ldb, beta, C, ldc)
/*  
|  transA  |  A        |
|----------|-----------|  
|    N     |  m x k  |    
|    x     |  k x m  |    

|  transB  |  B        |
|----------|-----------|  
|    N     |  k x n  |    
|    x     |  n x k  |    

|   C       |
|----------|
|  ldc x n |
*/
// err1: (transA=x) and (trans
// webgl "discard" will not write a pixel
/*
transA=N, transB=N,
(m x n) = alpha * (m x k) x (k x n) + beta * (m x n)  --> checked, ok,  these are nessasary diff shaders

transA=x, transB=N,
(m x n) = alpha * (k x m) x (k x n) + beta * (m x n)  --> checked, ok

transA=N, transB=x, 
(m x n) = alpha * (m x k) x (n x k) + beta * (m x n)  --> checked, ok

transA=x  transB=x,
(m x n) = alpha * (k x m) x (n x k) + beta * (m x n)  --> checked, ok
*/

// matrix A  is (LDA,ka matrix)
// matrix B  is (LDB,kb = 'n' matrix)
// checks are done in javascript

// m < 0, n < 0, k < 0
// lda < max

// shortcut to select what (prcompiled shader you need)
//

//profile1: trA === 'n', trB ==='n' //Form  C := alpha*A*B + beta*C
//profile2: trA === 'n', trB !== 'n' //Form C := alpha*A**T*B + beta*C
//profile3: trB !== 'n', trB ===  'n' //Form  C := alpha*A*B**T + beta*C
//profile4: trB !== 'n', trB !== 'n' //Form  C := alpha*A**T*B**T + beta*
//profile1: trA === 'n' trB !== 'n' //From C := alpha

import * as debug from "debug";
import {
  createProgramContext,
  createGLContext,
  loadImage
} from "../tools/tools";

import { kernels } from "./kernels";

const fs: string = require("./fs.glsl");
const vs: string = require("./vs.glsl");

const log = debug("example4");

async function start() {
  const width = 3;
  const height = 3;

  let pgCtx, ctx, err;
  [ctx, err] = createGLContext(['EXT_color_buffer_float'], true);
  if (err) {
    log(`%c ${err}`, "color:red");
    return;
  }
  const { gl } = ctx;

  console.log(`suppored:${ctx.supported}`);

  [pgCtx, err] = createProgramContext(ctx, vs, fs);
  if (err) {
    console.log(err)
    return;
  }

  const nrUnis = gl.getProgramParameter(pgCtx.program, gl.ACTIVE_UNIFORMS)
  
  console.log(`number of unis:${nrUnis}`)
  for (let i =0; i< nrUnis; i++) {
    const type = gl.getActiveUniform(pgCtx.program, i);
    console.log(`uniform type of ${i} is:${type.name} ${type.size} ${type.type}`)
  }


  pgCtx.registerUniforms(["u_image", "u_kernel[0]", "u_kernelWeight", "u_somedumbshit"]);
  
 
  const buffers = new Map<string, WebGLBuffer>();
  console.log('pointsize=',gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE))

  function createAndSetupTexture(gl: WebGL2RenderingContext) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    return texture;
  }

  // original texture from image
  // Create a texture and put the image in it.
  const jpegTexture = createAndSetupTexture(gl);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0 /* mipLevel*/,
    gl.RGBA /*internalFormat*/,
    gl.RGBA /*srcFormat*/,
    gl.UNSIGNED_BYTE /* srcType */,
    jpeg
  );

  const outputText = createAndSetupTexture(gl);
  // make the texture the same size as the image
  const mipLevel = 0; // the largest mip
  const internalFormat = gl.R32F; // format we want in the texture
  const border = 0; // must be 0
  const srcFormat = gl.RED; // dont really care data is zero, format of data we are supplying
  const srcType = gl.FLOAT; // type of data we are supplying
  const data: ArrayBufferView = null; // no data = create a blank texture
  gl.texImage2D(
    gl.TEXTURE_2D,
    mipLevel,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    data
  );

  // Create a framebuffer
  const outputFbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, outputFbo);

  // Attach a texture to it.
  const attachmentPoint = gl.COLOR_ATTACHMENT0; // Attaches the texture to the framebuffer's color buffer.
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    attachmentPoint,
    gl.TEXTURE_2D,
    outputText,
    mipLevel
  );
  gl.canvas.width = width;
  gl.canvas.height = height;
  gl.viewport(0, 0, width, height);
  gl.clearColor(1, 1, 1, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(pgCtx.program);

  gl.activeTexture(gl.TEXTURE0 + 0);
  gl.bindTexture(gl.TEXTURE_2D, jpegTexture);
  gl.uniform1i(pgCtx.getUniform("u_image"), 0);
  gl.viewport(0, 0, width, height);
  
  {
    // draw with kernel
    // set the kernel and it's weight
    gl.uniform1fv(pgCtx.getUniform("u_kernel[0]"), kernels.edgeDetect2.slice(1));
    const kernelWeight = kernels.edgeDetect2[0];
    gl.uniform1f(pgCtx.getUniform("u_kernelWeight"), kernelWeight);

    // Draw the rectangle.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    
    gl.drawArrays(primitiveType, offset, count);
    
    const pixels = new Float32Array(width * height);

    console.log(width, height);
    gl.readPixels(0, 0, width, height, gl.RED, gl.FLOAT, pixels, 0);
    
    //const imageData = new ImageData(pixels, 240);
    /*const canvas2 = document.createElement('canvas');
    const ctx = canvas2.getContext('2d');
    canvas2.width=240;
    canvas2.height=180;
    const imgData = ctx.getImageData(0,0,240,180);
    for (let y=0; y< 180;y++){
      for (let x=0; x < 240; x++){
         const coord = (y*240+x)*4;
         imgData.data[coord] = pixels[coord];
         imgData.data[coord+1] = pixels[coord+1];
         imgData.data[coord+2] = pixels[coord+2];     
         imgData.data[coord+3] = pixels[coord+3];
      }
    }
    ctx.putImageData(imgData, 0, 0);
    document.body.appendChild(canvas2);*/
    console.log(pixels);
    //150,195,202
  }
}

window.addEventListener("load", start);
