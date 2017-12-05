/* https://wasdk.github.io/WasmFiddle/?taawz */
/* https://wasdk.github.io/WasmFiddle/?9g5vz */

const unsigned int redShift = 24;
const unsigned int greenShift = 16;
const unsigned int blueShift = 8;

unsigned int desaturateBT601(double r, double g, double b) {
  double grey = r * 0.299 + g * 0.587 + b * 0.114;
  return (unsigned int)grey;
}

unsigned char desaturateBT601Byte(unsigned char r, unsigned char g, unsigned char b) {
  return (unsigned char)((float)r * 0.299 + (float)g * 0.587 + (float)b * 0.114);
}

unsigned int desaturateLuma(double r, double g, double b) {
  double grey = r * 0.2126 + g * 0.7152 + b * 0.0722;
  return (unsigned int)grey;
}

unsigned int desaturateAverage(double r, double g, double b) {
  double grey = (r + g + b) / 3;
  return (unsigned int)grey;
}

int desaturateRGBA(int rgba) {
  unsigned int red = (rgba >> redShift) & 0xFF;
  unsigned int green = (rgba >> greenShift) & 0xFF;
  unsigned int blue = (rgba >> blueShift) & 0xFF;
  unsigned int alpha = rgba & 0xFF;
  unsigned int grey = desaturateBT601((double) red, (double) green, (double) blue);
  return (grey << redShift) + (grey << greenShift) + (grey << blueShift) + alpha;
}

void desaturateBuffer(unsigned char *src, unsigned char *dest, int length) {
  unsigned char grey;
  for (int i = 0; i < length; i += 4) {
    grey = desaturateBT601Byte(src[i], src[i + 1], src[i + 2]);
    dest[i] = dest[i + 1] = dest[i + 2] = grey;
    dest[i + 3] = src[i + 3];
  }
}
