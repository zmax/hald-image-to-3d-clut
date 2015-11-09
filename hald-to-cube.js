#!/usr/bin/env node

var getPixels = require("get-pixels"),
    fs = require('fs'),
    program = require('commander');

function haldToCube(hald, output, creator, copyright) {
    // "identity.png"
    getPixels(hald, function(err, pixels) {

        if (err) {
            console.log("Bad image path");
            return false;
        }

        var nx = pixels.shape[0],
            ny = pixels.shape[1],
            index = 0, r = 0, g = 0, b = 0, steps = 0, stream;

        if (nx != ny) {
            console.log("Hald Image is not square.");
            return false;
        }

        steps = parseInt(Math.round(Math.pow(nx, 1/3)));

        console.log("got pixels", pixels.shape.slice());
        console.log("steps: ", steps);

        // "test.cube"
        stream = fs.createWriteStream(output);
        stream.once('open', function(fd) {
            if (creator) stream.write("#Created by: " + creator + "\n");
            if (copyright) stream.write("#Copyright: " + copyright + "\n")
            stream.write('LUT_3D_SIZE ' + (steps * steps) + "\n\n");
            for(var dx=0; dx<nx; dx++) {
                for(var dy=0; dy<ny; dy++) {
                    r = pixels.data[index++]/255, g = pixels.data[index++]/255, b = pixels.data[index++]/255, a = pixels.data[index++]/255;
                    // console.log(a);
                    // if transparent
                    if (a < 1) {
                        r = ((1 - a) * r) + (a * r);
                        g = ((1 - a) * g) + (a * g);
                        b = ((1 - a) * b) + (a * b);
                    }
                    stream.write(parseFloat(r) + " " + parseFloat(g) + " " + parseFloat(b) + "\n");
                }
            }
            stream.end();
        });
    });
}

program
    .version('0.0.1')
    .arguments('<hald> <outout>')
    .option('-a, --creator [value]', 'Creator information')
    .option('-c, --copyright [value]', 'Copyright')
    .action(function(hald, output) {
        haldToCube(hald, output, program.creator, program.copyright);
    });

program.parse(process.argv);
