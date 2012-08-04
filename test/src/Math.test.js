/*global require, describe, it */
var should = require('chai').should(); 
var MathLib = require("../../public/src/Helpers/MathLib");

describe('MathLib', function() {

  describe('#add()', function() {

    it('should return the sum of its two parameters', function(){
      var math = new MathLib();
      math.add(2, 16).should.equal(18);
    });

  });

});
