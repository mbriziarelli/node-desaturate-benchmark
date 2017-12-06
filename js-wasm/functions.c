/* https://wasdk.github.io/WasmFiddle/?k4qsn */

extern unsigned int readUInt32(int index);
extern void writeUInt32(unsigned int pixel, int index);

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
#define DESATURATE_BT601(r, g, b) (unsigned int)((float)(r) * 0.299f + (float)(g) * 0.587f + (float)(b) * 0.114f) & BYTE_MASK
#define DESATURATE_LUMA(r, g, b) (unsigned int)((float)(r) * 0.2126f + (float)(g) * 0.7152f + (float)(b) * 0.0722f) & BYTE_MASK
#define DESATURATE_AVERAGE(r, g, b) (unsigned int)((r + g + b) / 3) & BYTE_MASK;
#define GET_PIXEL(grey, alpha) ((grey) << RED_SHIFT) + ((grey) << GREEN_SHIFT) + ((grey) << BLUE_SHIFT) + (alpha) 

void desaturate(int bufferLength, int channels) {
  unsigned int pixel, grey;

  for (int index = 0; index < bufferLength; index += channels) {
    pixel = readUInt32(index);
    grey = DESATURATE_BT601(GET_RED(pixel), GET_GREEN(pixel), GET_BLUE(pixel));
    writeUInt32(GET_PIXEL(grey, GET_ALPHA(pixel)), index);
  }
}
