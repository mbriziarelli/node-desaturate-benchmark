/* https://wasdk.github.io/WasmFiddle/?k4qsn */

extern unsigned readUInt32(int index);
extern void writeUInt32(unsigned pixel, int index);

#define RED_SHIFT 24
#define GREEN_SHIFT 16
#define BLUE_SHIFT 8

#define BYTE_MASK 0xFF
#define RED_MASK (BYTE_MASK << RED_SHIFT)
#define GREEN_MASK (BYTE_MASK << GREEN_SHIFT)
#define BLUE_MASK (BYTE_MASK << BLUE_SHIFT)
#define ALPHA_MASK BYTE_MASK
#define GET_RED(pixel) (pixel & RED_MASK) >> RED_SHIFT
#define GET_GREEN(pixel) (pixel & GREEN_MASK) >> GREEN_SHIFT
#define GET_BLUE(pixel) (pixel & BLUE_MASK) >> BLUE_SHIFT
#define GET_ALPHA(pixel) pixel & ALPHA_MASK
#define DESATURATE_BT601(r, g, b) (((r) * 299 + (g) * 587 + (b) * 114) / 1000) & BYTE_MASK
#define GET_PIXEL(grey, alpha) ((grey) << RED_SHIFT) + ((grey) << GREEN_SHIFT) + ((grey) << BLUE_SHIFT) + (alpha) 

void desaturate(int bufferLength, int channels) {
  unsigned pixel, grey;

  for (int index = 0; index < bufferLength; index += channels) {
    pixel = readUInt32(index);
    grey = DESATURATE_BT601(GET_RED(pixel), GET_GREEN(pixel), GET_BLUE(pixel));
    writeUInt32(GET_PIXEL(grey, GET_ALPHA(pixel)), index);
  }
}

void desaturateVoid(int bufferLength, int channels) {
  unsigned pixel, desaturatedPixel, grey;

  for (int index = 0; index < bufferLength; index += channels) {
    pixel = 0x123456FF;
    grey = DESATURATE_BT601(GET_RED(pixel), GET_GREEN(pixel), GET_BLUE(pixel));
    desaturatedPixel = GET_PIXEL(grey, GET_ALPHA(pixel));
  }
}