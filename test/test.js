var assert = require("assert");

let calcMapNodeCoordinate = require("../dist/utils").calcMapNodeCoordinate;

describe("calcMapNodeCoordinate", function() {
  it("第1圈 第一个", function() {
    assert.deepEqual(calcMapNodeCoordinate(0, [0, 0]), [200, 0]);
  });
  it("第2圈 第一个", function() {
    assert.deepEqual(calcMapNodeCoordinate(8, [0, 0]), [369, -154]);
  });
  it("第3圈 第一个", function() {
    assert.deepEqual(calcMapNodeCoordinate(16, [0, 0]), [369, -154]);
  });
});
