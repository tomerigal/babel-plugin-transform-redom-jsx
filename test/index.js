var babel = require("babel-core");
var redomT = require("../src/index");
var expect = require("chai").expect;
var path = require("path");
var fs = require("fs");
function trim(str) {return str.replace(/^\s+|\s+$/, "");}
function removeSpaces(str){return str.replace(/\s/gm, "");}
describe("transform redom jsx", () => {
    const fixturesDir = path.join(__dirname, "fixtures");
    fs.readdirSync(fixturesDir).map((caseName) => {
        it(`should ${caseName.split("-").join(" ")}`, () => {
            const fixtureDir = path.join(fixturesDir, caseName);
            const actual = babel.transformFileSync(
                path.join(fixtureDir, "actual.js"),
                {
                    plugins: [ 'syntax-jsx', redomT]
                }
            );
            const expected = fs.readFileSync(path.join(fixtureDir, "expected.js")).toString();
            expect(removeSpaces(actual.code)).to.equal(removeSpaces(expected));
        });
  });
});
