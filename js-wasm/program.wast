(module
  (table 0 anyfunc)
  (memory $0 1)
  (data (i32.const 12) "\18\00\00\00")
  (data (i32.const 16) "\10\00\00\00")
  (data (i32.const 20) "\08\00\00\00")
  (export "memory" (memory $0))
  (export "desaturateBT601" (func $desaturateBT601))
  (export "desaturateBT601Byte" (func $desaturateBT601Byte))
  (export "desaturateLuma" (func $desaturateLuma))
  (export "desaturateAverage" (func $desaturateAverage))
  (export "desaturateRGBA" (func $desaturateRGBA))
  (export "desaturateBuffer" (func $desaturateBuffer))
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
  (func $desaturateBT601Byte (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
    (i32.trunc_u/f64
      (f64.add
        (f64.add
          (f64.mul
            (f64.promote/f32
              (f32.convert_u/i32
                (get_local $0)
              )
            )
            (f64.const 0.299)
          )
          (f64.mul
            (f64.promote/f32
              (f32.convert_u/i32
                (get_local $1)
              )
            )
            (f64.const 0.587)
          )
        )
        (f64.mul
          (f64.promote/f32
            (f32.convert_u/i32
              (get_local $2)
            )
          )
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
  (func $desaturateBuffer (param $0 i32) (param $1 i32) (param $2 i32)
    (local $3 i32)
    (local $4 i32)
    (local $5 i32)
    (local $6 i32)
    (block $label$0
      (br_if $label$0
        (i32.lt_s
          (get_local $2)
          (i32.const 1)
        )
      )
      (set_local $6
        (i32.const 0)
      )
      (loop $label$1
        (i32.store8
          (i32.add
            (tee_local $5
              (i32.add
                (get_local $1)
                (get_local $6)
              )
            )
            (i32.const 1)
          )
          (tee_local $4
            (i32.trunc_u/f64
              (f64.add
                (f64.add
                  (f64.mul
                    (f64.promote/f32
                      (f32.convert_u/i32
                        (i32.load8_u
                          (tee_local $3
                            (i32.add
                              (get_local $0)
                              (get_local $6)
                            )
                          )
                        )
                      )
                    )
                    (f64.const 0.299)
                  )
                  (f64.mul
                    (f64.promote/f32
                      (f32.convert_u/i32
                        (i32.load8_u
                          (i32.add
                            (get_local $3)
                            (i32.const 1)
                          )
                        )
                      )
                    )
                    (f64.const 0.587)
                  )
                )
                (f64.mul
                  (f64.promote/f32
                    (f32.convert_u/i32
                      (i32.load8_u
                        (i32.add
                          (get_local $3)
                          (i32.const 2)
                        )
                      )
                    )
                  )
                  (f64.const 0.114)
                )
              )
            )
          )
        )
        (i32.store8
          (i32.add
            (get_local $5)
            (i32.const 2)
          )
          (get_local $4)
        )
        (i32.store8
          (get_local $5)
          (get_local $4)
        )
        (i32.store8
          (i32.add
            (get_local $5)
            (i32.const 3)
          )
          (i32.load8_u
            (i32.add
              (get_local $3)
              (i32.const 3)
            )
          )
        )
        (br_if $label$1
          (i32.lt_s
            (tee_local $6
              (i32.add
                (get_local $6)
                (i32.const 4)
              )
            )
            (get_local $2)
          )
        )
      )
    )
  )
)
