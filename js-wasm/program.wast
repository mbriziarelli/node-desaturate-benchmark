(module
  (table 0 anyfunc)
  (memory $0 1)
  (data (i32.const 12) "\18\00\00\00")
  (data (i32.const 16) "\10\00\00\00")
  (data (i32.const 20) "\08\00\00\00")
  (export "memory" (memory $0))
  (export "desaturateBT601" (func $desaturateBT601))
  (export "desaturateLuma" (func $desaturateLuma))
  (export "desaturateAverage" (func $desaturateAverage))
  (export "desaturateRGBA" (func $desaturateRGBA))
  (func $desaturateBT601 (param $0 f64) (param $1 f64) (param $2 f64) (result i32)
    (i32.trunc_u/f64
      (f64.add
        (f64.add
          (f64.mul
            (get_local $0)
            (f64.const 0.299)
          )
          (f64.mul
            (get_local $1)
            (f64.const 0.587)
          )
        )
        (f64.mul
          (get_local $2)
          (f64.const 0.114)
        )
      )
    )
  )
  (func $desaturateLuma (param $0 f64) (param $1 f64) (param $2 f64) (result i32)
    (i32.trunc_u/f64
      (f64.add
        (f64.add
          (f64.mul
            (get_local $0)
            (f64.const 0.2126)
          )
          (f64.mul
            (get_local $1)
            (f64.const 0.7152)
          )
        )
        (f64.mul
          (get_local $2)
          (f64.const 0.0722)
        )
      )
    )
  )
  (func $desaturateAverage (param $0 f64) (param $1 f64) (param $2 f64) (result i32)
    (i32.trunc_u/f64
      (f64.div
        (f64.add
          (f64.add
            (get_local $0)
            (get_local $1)
          )
          (get_local $2)
        )
        (f64.const 3)
      )
    )
  )
  (func $desaturateRGBA (param $0 i32) (result i32)
    (i32.or
      (i32.mul
        (i32.trunc_u/f64
          (f64.add
            (f64.mul
              (f64.convert_u/i32
                (i32.and
                  (i32.shr_u
                    (get_local $0)
                    (i32.const 8)
                  )
                  (i32.const 255)
                )
              )
              (f64.const 0.114)
            )
            (f64.add
              (f64.mul
                (f64.convert_u/i32
                  (i32.shr_u
                    (get_local $0)
                    (i32.const 24)
                  )
                )
                (f64.const 0.299)
              )
              (f64.mul
                (f64.convert_u/i32
                  (i32.and
                    (i32.shr_u
                      (get_local $0)
                      (i32.const 16)
                    )
                    (i32.const 255)
                  )
                )
                (f64.const 0.587)
              )
            )
          )
        )
        (i32.const 16843008)
      )
      (i32.and
        (get_local $0)
        (i32.const 255)
      )
    )
  )
)
