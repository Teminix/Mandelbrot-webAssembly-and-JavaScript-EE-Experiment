# File used to compile "main.cpp" into executable WASM and output to "output.js"/"output.wasm"
emcc main.cpp -o static/output.js -s EXPORTED_FUNCTIONS='["_sum","_mandelbrotCheck","_encodeMandelbrot","_malloc","_free"]' -s ASSERTIONS=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]' -s ALLOW_MEMORY_GROWTH=1
