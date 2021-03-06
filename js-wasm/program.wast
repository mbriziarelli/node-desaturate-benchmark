(module
  (type $FUNCSIG$ii (func (param i32) (result i32)))
  (type $FUNCSIG$vii (func (param i32 i32)))
  (import "env" "readUInt32" (func $readUInt32 (param i32) (result i32)))
  (import "env" "writeUInt32" (func $writeUInt32 (param i32 i32)))
  (table 0 anyfunc)
  (memory $0 1)
  (export "memory" (memory $0))
  (export "desaturate" (func $desaturate))
  (export "desaturateVoid" (func $desaturateVoid))
  (func $desaturate (param $0 i32) (param $1 i32)
    (local $2 i32)
    (local $3 i32)
    (local $4 i32)
    (block $label$0
      (br_if $label$0
        (i32.lt_s
          (get_local $0)
          (i32.const 1)
        )
      )
      (set_local $4
        (i32.const 0)
      )
      (loop $label$1
        (call $writeUInt32
          (i32.or
            (i32.or
              (i32.or
                (i32.shl
                  (tee_local $3
                    (i32.div_u
                      (i32.add
                        (i32.add
                          (i32.mul
                            (i32.and
                              (i32.shr_u
                                (tee_local $2
                                  (call $readUInt32
                                    (get_local $4)
                                  )
                                )
                                (i32.const 16)
                              )
                              (i32.const 255)
                            )
                            (i32.const 587)
                          )
                          (i32.mul
                            (i32.shr_u
                              (get_local $2)
                              (i32.const 24)
                            )
                            (i32.const 299)
                          )
                        )
                        (i32.mul
                          (i32.and
                            (i32.shr_u
                              (get_local $2)
                              (i32.const 8)
                            )
                            (i32.const 255)
                          )
                          (i32.const 114)
                        )
                      )
                      (i32.const 1000)
                    )
                  )
                  (i32.const 24)
                )
                (i32.and
                  (get_local $2)
                  (i32.const 255)
                )
              )
              (i32.shl
                (tee_local $2
                  (i32.and
                    (get_local $3)
                    (i32.const 255)
                  )
                )
                (i32.const 16)
              )
            )
            (i32.shl
              (get_local $2)
              (i32.const 8)
            )
          )
          (get_local $4)
        )
        (br_if $label$1
          (i32.lt_s
            (tee_local $4
              (i32.add
                (get_local $4)
                (get_local $1)
              )
            )
            (get_local $0)
          )
        )
      )
    )
  )
  (func $desaturateVoid (param $0 i32) (param $1 i32)
  )
)
