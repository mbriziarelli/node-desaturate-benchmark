// The entry file of your WebAssembly module.

const RED_SHIFT: i32 = 24
const GREEN_SHIFT: i32 = 16
const BLUE_SHIFT: i32 = 8

const BYTE_MASK: i32 = 0xFF
const RED_MASK: i32 = BYTE_MASK << RED_SHIFT
const GREEN_MASK: i32 = BYTE_MASK << GREEN_SHIFT
const BLUE_MASK: i32 = BYTE_MASK << BLUE_SHIFT
const ALPHA_MASK: i32 = BYTE_MASK

function desaturateBT601(r: u32, g: u32, b: u32): u32 {
  return ((r * 299 + g * 587 + b * 114) / 1000) & BYTE_MASK
}
