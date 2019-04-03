## ctrm/ztrm: x ⟵ A·x

#### operations

x ⟵ A·x, or x ⟵ Aᵀ·x, or x ⟵ Aᴴ·x

Where `x` is an n element vector and  `A` is an `n` by `n` unit, or non-unit, upper or lower triangular matrix.

The vector and matrix arguments are not referenced when N = 0, or M = 0

#### precision

Historicly the `ctrm` subroutine uses 32 bit floating point precision and the `ztrm` subroutine uses 64 bit floating point precision.

The JS implementation the `ctrm` and `ztrm` are each others alias, precision is determined by [argument construction]().

The webgl2 implementation supports only 32 bit floats arguments.

#### gpu enhancer

For general info on the `gpu` subroutine enhancer read [here]()

#### Syntax

```javascript
const { ctrm } = require('blasjs').level2 // javascript version
const { GPU, prodGPUOptions } = require('blasjs') // gpu enhancer
const gpu = GPU( prodGPUOptions ) // throws if webgl2 is not supported
.
.
.
ctrm( uplo, trans, diag, n, A, lda, x ,incx ) // use the javascript version
.
// or
gpu( ctrm )( uplo, trans, diag, n, A, lda, x incx ) // use the gpu version
.
```

#### Parameters

**uplo**: On entry, `uplo` specifies whether the matrix is an upper or lower triangular matrix as follows:
- If **uplo** = `U` or `u` then **A** is an upper triangular matrix.
- If **uplo** = `L` or `l` then **A** is a lower triangular matrix.

**trans**: On entry, `trans` specifies the operation to be performed as follows:
- If **trans** = `N` or `n`  then x ⟵ A·x
- If **trans** = `T` or `t`  then  x ⟵ Aᵀ·x
- If **trans** = `C` or `c` then  x ⟵ Aᴴ·x

**diag**: On entry, `diag` specifies whether or not **A** is unit
- If **diag** = `U` or `u` then *A* is assumed to be unit triangular.
- If **diag** = `N` or `n` then *A* is not assumed to be unit triangular.

**n**: On entry, `n` specifies the order of the matrix **A**. `n` must be at least zero.

**A** is a complex array of dimension `(lda,n)`.
- Before entry with  `uplo= "u" (or "U")`, the leading n by n upper triangular part of the array **A** must contain the upper triangular matrix and the strictly lower triangular part of A is not referenced.
- Before entry with `uplo = "l" (or "L")`, the leading n by n lower triangular part of the array **A** must contain the lower triangular matrix and the strictly upper triangular part of **A** is not referenced. Note that when  DIAG = 'U' or 'u', the diagonal elements of A are not referenced either, but are assumed to be unity.

_Note: that when **diag** = "U" (or "u"), the diagonal elements of *A* are not referenced either, but are assumed to be unity._

**lda**: On entry, `lda` specifies the first dimension of **A**, **lda** must be at leas  `max( 1, n )`.

**x**: `x` is _complex_ array, having at least the size `( 1 + ( n - 1 )*abs( incx ) )`. Before entry, the incremented array X must contain the n element vector x. On exit, X is overwritten with the transformed vector 
`x`.

*incx*: On entry, `ìncx` specifies the increment for the elements of `x`.  `incx` must not be zero.

#### Return value

None

#### history

Original **Fortran** version, written on 22-October-1986.
- Jack Dongarra, Argonne National Lab.
- Jeremy Du Croz, Nag Central Office.
- Sven Hammarling, Nag Central Office.
- Richard Hanson, Sandia National Labs.

[back to main page](../README.md)
