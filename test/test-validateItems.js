//TODO:You have to write your global "node_modules" path as "NODE_PATH" on .bashrc for 'chai'
//Otherwise, require('chai'); will throw exception.

const chai = require('chai');
const should = chai.should();

const fs = require('fs');

const target = require('../validateItems');

/*

describe('validateItems', ()=> {
  describe('validateItems', () => {
    it('should return when the input argment is invalid', () => {
      let test_json = JSON.parse(fs.readFileSync("result.json", "utf-8"));
      target.validateItems(test_json).should.equal(null);
    });
  });
});
*/
