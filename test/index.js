const babel = require("@babel/core");
const { expect } = require("chai");
const path = require("path");
const fs = require("fs");
const transformer = require("../lib");

function removeSpaces(str) { return str.replace(/\s/gm, ""); }
const fixturesDir = path.join(__dirname, "fixtures");

describe("transform redom jsx", () => {

    for (const caseName of fs.readdirSync(fixturesDir)) {

        it(`supports ${caseName.split("-").join(" ")}`, () => {

            const fixtureDir = path.join(fixturesDir, caseName);
            const actual = babel.transformFileSync(
                path.join(fixtureDir, "actual.js"),
                { plugins: [transformer] }
            );
            const expected = fs.readFileSync(path.join(fixtureDir, "expected.js"), 'utf8');
            expect(removeSpaces(actual.code)).to.equal(removeSpaces(expected));
        });
    };
});
