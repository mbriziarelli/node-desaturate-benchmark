/* https://wasdk.github.io/WasmFiddle/?taawz */

const unsigned int redShift = 24;
const unsigned int greenShift = 16;
const unsigned int blueShift = 8;

unsigned int desaturateBT601(double r, double g, double b) {
  double grey = r * 0.299 + g * 0.587 + b * 0.114;
  return (unsigned int)grey;
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
